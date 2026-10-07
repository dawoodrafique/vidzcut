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

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#0a2b36] ring-1 ring-white/10">
        {/* drifting colour glows */}
        <span className="aurora absolute -left-10 -top-16 h-56 w-56 rounded-full bg-[#2a8ba3]/60 blur-3xl" />
        <span className="aurora absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-gold/35 blur-3xl [animation-delay:-6s] [animation-direction:alternate-reverse]" />
        <span className="aurora absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-[#14465a] blur-3xl [animation-delay:-12s]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:36px_36px]" />

        {/* floating reel frames */}
        <div className="float-a absolute left-[7%] top-[14%] h-[58%] w-[17%] rounded-xl bg-gradient-to-b from-[#ffd06a] to-[#e0a02b] p-[3px] shadow-xl">
          <div className="flex h-full w-full items-end rounded-[9px] bg-gradient-to-b from-[#17566b] to-[#082029] p-1.5">
            <span className="h-1 w-3/5 rounded-full bg-white/60" />
          </div>
        </div>
        <div className="float-b absolute right-[7%] top-[22%] h-[58%] w-[17%] rounded-xl bg-white/90 p-[3px] shadow-xl">
          <div className="flex h-full w-full items-end rounded-[9px] bg-gradient-to-b from-[#2a8ba3] to-[#0d3442] p-1.5">
            <span className="h-1 w-2/3 rounded-full bg-white/60" />
          </div>
        </div>

        {/* kinetic captions */}
        <div className="absolute inset-0 flex items-center justify-center">
          {["Sharp cuts", "Clean sound", "Smooth motion", "Hooks that stick"].map((w, i) => (
            <span
              key={w}
              style={{ animationDelay: `${i * 2}s` }}
              className="cap-word absolute whitespace-nowrap rounded-xl bg-gold px-4 py-2 font-display text-lg font-extrabold uppercase tracking-tight text-[#2a1d00] opacity-0 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] sm:text-2xl"
            >
              {w}
            </span>
          ))}
        </div>

        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
          <span className="rec-dot h-1.5 w-1.5 rounded-full bg-red-400" />
          Editing
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
