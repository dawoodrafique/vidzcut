import ContentForm from "@/components/admin/ContentForm";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-extrabold text-cream">Content</h1>
      <ContentForm settings={settings} />
    </div>
  );
}
