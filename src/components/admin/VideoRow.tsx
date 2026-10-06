"use client";

import { useActionState, useState } from "react";
import { deleteVideo, moveVideo, toggleVideo, updateVideo } from "@/app/actions/videos";
import type { Video } from "@/lib/data";
import { thumbnailUrl } from "@/lib/youtube";
import Status from "./Status";

export default function VideoRow({ video, first, last }: { video: Video; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(updateVideo.bind(null, video.id), undefined);
  const small = "rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-cream hover:border-gold/60 disabled:opacity-30";

  return (
    <li className={`card p-4 ${video.visible ? "" : "opacity-60"}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl(video.youtubeId)} alt="" className="h-16 w-28 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-cream">{video.title || "(untitled)"}</p>
          <p className="truncate text-sm text-[var(--muted)]">
            {video.subtitle || "—"} · {video.orientation}
            {!video.visible && " · hidden"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={small} disabled={first} onClick={() => moveVideo(video.id, "up")} aria-label="Move up">
            ↑
          </button>
          <button className={small} disabled={last} onClick={() => moveVideo(video.id, "down")} aria-label="Move down">
            ↓
          </button>
          <button className={small} onClick={() => toggleVideo(video.id)}>
            {video.visible ? "Hide" : "Show"}
          </button>
          <button className={small} onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </button>
          <button
            className={`${small} !text-red-300`}
            onClick={() => confirm("Delete this video?") && deleteVideo(video.id)}
          >
            Delete
          </button>
        </div>
      </div>
      {editing && (
        <form action={action} className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 sm:grid-cols-2">
          <input type="hidden" name="category" value={video.category} />
          <label className="block text-sm text-cream sm:col-span-2">
            YouTube link
            <input name="url" required defaultValue={`https://youtu.be/${video.youtubeId}`} className="field mt-1" />
          </label>
          <label className="block text-sm text-cream">
            Title
            <input name="title" defaultValue={video.title} maxLength={120} className="field mt-1" />
          </label>
          <label className="block text-sm text-cream">
            Subtitle
            <input name="subtitle" defaultValue={video.subtitle} maxLength={160} className="field mt-1" />
          </label>
          <label className="block text-sm text-cream">
            Shape
            <select name="orientation" defaultValue={video.orientation} className="field mt-1">
              <option value="vertical">Vertical reel (9:16)</option>
              <option value="landscape">Landscape (16:9)</option>
            </select>
          </label>
          <div className="flex items-center gap-4 sm:col-span-2">
            <button disabled={pending} className="btn btn-gold !py-2.5 disabled:opacity-60">
              Save changes
            </button>
            <Status state={state} />
          </div>
        </form>
      )}
    </li>
  );
}
