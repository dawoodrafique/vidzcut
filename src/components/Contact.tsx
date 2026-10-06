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
    <section id="contact" className="py-20">
      <div className="container-x">
        <p className="eyebrow">04 / Contact</p>
        <h2 className="mt-4 text-4xl font-extrabold text-cream md:text-5xl">Let&apos;s work together</h2>
        <p className="mt-3 max-w-[56ch] text-[var(--muted)]">
          Tell me about your video and I&apos;ll send back a quote and timeline.
        </p>
        <div className={`mt-10 grid gap-6 ${contact.formEnabled ? "lg:grid-cols-[360px_1fr]" : ""}`}>
          <div className="grid gap-3 self-start">
            {items.length === 0 && (
              <div className="card p-6 text-[var(--muted)]">Contact details are coming soon.</div>
            )}
            {items.map((it) => (
              <a
                key={it.label}
                href={it.href}
                target={it.label === "WhatsApp" || it.label === "Instagram" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="card flex items-center justify-between gap-4 p-5 transition hover:border-gold/60"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-gold">{it.label}</span>
                  <span className="mt-1 block break-all font-medium text-cream">{it.value}</span>
                </span>
                <span aria-hidden="true" className="text-gold">
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
