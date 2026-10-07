import Link from "next/link";
import AddVideoForm from "@/components/admin/AddVideoForm";
import VideoRow from "@/components/admin/VideoRow";
import { getSettings, getVideos } from "@/lib/data";
import { CATEGORIES, type Category } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const category: Category = CATEGORIES.includes(cat as Category) ? (cat as Category) : "motion";
  const [settings, videos] = await Promise.all([getSettings(), getVideos(category, { includeHidden: true })]);
  const dbReady = Boolean(process.env.DATABASE_URL);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Videos</h1>
        <p className="mt-1 text-ink-2">Upload to YouTube, paste the link here, and it appears on the site.</p>
      </div>
      {!dbReady && (
        <p className="card p-4 text-sm text-red-700">DATABASE_URL is not set, so changes cannot be saved yet.</p>
      )}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/admin?cat=${c}`}
            className={`rounded-full border px-5 py-2.5 font-semibold ${
              c === category ? "border-gold bg-gold text-[#2a1d00]" : "border-[var(--line)] text-ink hover:border-gold/60"
            }`}
          >
            {settings.categories[c].label}
          </Link>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <AddVideoForm key={category} category={category} />
        <div>
          {videos.length === 0 ? (
            <p className="card p-6 text-ink-2">No videos in this category yet.</p>
          ) : (
            <ul className="space-y-3">
              {videos.map((v, i) => (
                <VideoRow key={v.id} video={v} first={i === 0} last={i === videos.length - 1} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
