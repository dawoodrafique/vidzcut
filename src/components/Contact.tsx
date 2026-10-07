import type { Settings } from "@/lib/defaults";
import ContactForm from "./ContactForm";

export function instagramUrl(v: string): string {
  const t = v.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `https://instagram.com/${t.replace(/^@/, "").replace(/^instagram\.com\//i, "")}`;
}

export default function Contact({ contact }: { contact: Settings["contact"] }) {
  const wa = contact.whatsapp.replace(/\D/g, "");
  const items = [
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, "")}` },
    wa && { label: "WhatsApp", value: contact.whatsapp, href: `https://wa.me/${wa}` },
    contact.instagram && { label: "Instagram", value: contact.instagram, href: instagramUrl(contact.instagram) },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section
      id="contact"
      className="on-dark relative overflow-hidden bg-[radial-gradient(700px_400px_at_90%_0%,rgba(249,191,75,0.16),transparent_60%),linear-gradient(180deg,#0f3a48,#082029)] py-24 text-white"
    >
      <div className="container-x">
        <p className="eyebrow !text-gold">04 / Contact</p>
        <h2 className="mt-4 text-4xl font-extrabold text-white md:text-5xl">Let&apos;s work together</h2>
        <p className="mt-3 max-w-[56ch] text-white/70">Tell me about your video and I&apos;ll send back a quote and timeline.</p>
        <div className={`mt-12 grid gap-6 ${contact.formEnabled ? "lg:grid-cols-[380px_1fr]" : "max-w-xl"}`}>
          <div className="grid gap-3 self-start">
            {items.length === 0 && (
              <div className="rounded-[20px] border border-white/15 bg-white/5 p-6 text-white/70">Contact details are coming soon.</div>
            )}
            {items.map((it) => (
              <a
                key={it.label}
                href={it.href}
                target={it.label === "WhatsApp" || it.label === "Instagram" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-[20px] border border-white/15 bg-white/5 p-5 transition hover:border-gold/70 hover:bg-white/10"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gold">{it.label}</span>
                  <span className="mt-1 block break-all font-medium text-white">{it.value}</span>
                </span>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-gold transition group-hover:bg-gold group-hover:text-[#2a1d00]">
                  →
                </span>
              </a>
            ))}
          </div>
          {contact.formEnabled && <ContactForm />}
        </div>
      </div>
    </section>
  );
}
