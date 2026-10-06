import ContactSettingsForm from "@/components/admin/ContactSettingsForm";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactAdminPage() {
  const { contact } = await getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-cream">Contact details</h1>
      <ContactSettingsForm contact={contact} />
    </div>
  );
}
