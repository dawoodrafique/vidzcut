const top = [18, 7, 25, 10, 22, 7, 11];
const bottom = [9, 17, 14, 28, 13, 15];

function Track({ widths, dim }: { widths: number[]; dim?: boolean }) {
  return (
    <div className="flex gap-1">
      {widths.map((w, i) => (
        <div
          key={i}
          style={{ flexGrow: w }}
          className={`h-7 rounded-[6px] ${dim ? "bg-white/20" : "bg-gradient-to-b from-[#ffd06a] to-[#f2b13c]"}`}
        />
      ))}
    </div>
  );
}

/** Decorative "editor window": preview frame plus a timeline with a moving playhead. */
export default function TimelineGraphic() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-[#12495a] to-[#082029] p-4 text-left shadow-[0_40px_80px_-30px_rgba(11,42,53,0.75)] ring-1 ring-white/10 sm:p-5"
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="ml-3 text-xs font-medium text-white/60">final_edit.mp4</span>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[radial-gradient(120%_120%_at_30%_20%,#1f6a80_0%,#0d3442_55%,#071b23_100%)] ring-1 ring-white/10">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/50 backdrop-blur-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
            <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
          </svg>
        </span>
        <span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/70">Raw footage 14:32</span>
        <span className="absolute bottom-3 right-4 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-[#2a1d00]">Final edit 8:10</span>
      </div>

      <div className="relative mt-4 space-y-1.5">
        <Track widths={top} />
        <Track widths={bottom} dim />
        <div className="flex h-7 items-center justify-between">
          {Array.from({ length: 64 }).map((_, i) => (
            <span
              key={i}
              className="wave-bar w-[3px] rounded-full bg-gold/80"
              style={{ height: `${10 + ((i * 37) % 18)}px`, animationDelay: `${(i % 9) * 0.12}s` }}
            />
          ))}
        </div>
        <div className="playhead absolute -top-2 bottom-0 w-px bg-white">
          <span className="absolute -left-[5px] top-0 block h-0 w-0 border-x-[5.5px] border-t-[8px] border-x-transparent border-t-white" />
        </div>
      </div>
    </div>
  );
}
