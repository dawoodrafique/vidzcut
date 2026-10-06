import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { contactSchema, firstError } from "@/lib/validation";

export async function POST(req: Request) {
  const settings = await getSettings();
  if (!settings.contact.formEnabled) {
    return NextResponse.json({ error: "The contact form is currently turned off." }, { status: 404 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(`contact:${ip}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    return NextResponse.json({ error: "Email is not set up yet. Please use the contact details instead." }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    const { name, email, message } = parsed.data;
    await transporter.sendMail({
      from: `"Portfolio contact form" <${user}>`,
      to: settings.contact.email || user,
      replyTo: `"${name.replace(/["\r\n]/g, "")}" <${email}>`,
      subject: `New project enquiry from ${name.replace(/[\r\n]/g, " ")}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact send failed", err);
    return NextResponse.json({ error: "Could not send your message. Please try again later." }, { status: 500 });
  }
}
