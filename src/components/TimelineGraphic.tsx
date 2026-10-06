const top = [18, 7, 25, 10, 22, 7, 11];
const bottom = [9, 17, 14, 28, 13, 15];

function Track({ widths, dim }: { widths: number[]; dim?: boolean }) {
  return (
    <div className="flex gap-1.5">
      {widths.map((w, i) => (
        <div
          key={i}
          style={{ flexGrow: w }}
          className={`h-8 rounded-md ${dim ? "bg-[#a98a45]/70" : "bg-gradient-to-b from-[#ffd06a] to-[#f2b13c]"}`}
        />
      ))}
    </div>
  );
}

export default function TimelineGraphic() {
  return (
    <div
      aria-hidden="true"
      className="card relative mx-auto mt-14 w-full max-w-[740px] overflow-hidden bg-[#071c25]/70 p-5 text-left"
    >
      <div className="mb-3 flex justify-between text-xs font-medium text-cream/90">
        <span>Raw footage: 14:32</span>
        <span>Final edit: 8:10</span>
      </div>
      <div className="relative space-y-2">
        <Track widths={top} />
        <Track widths={bottom} dim />
        <div className="flex h-8 items-center justify-between">
          {Array.from({ length: 70 }).map((_, i) => (
            <span
              key={i}
              className="wave-bar w-[3px] rounded-full bg-gold/80"
              style={{ height: `${12 + ((i * 37) % 20)}px`, animationDelay: `${(i % 9) * 0.12}s` }}
            />
          ))}
        </div>
        <div className="playhead absolute -top-3 bottom-0 w-px bg-[#ffd978]">
          <span className="absolute -top-0 -left-[5px] block h-0 w-0 border-x-[5.5px] border-t-[8px] border-x-transparent border-t-[#ffd978]" />
        </div>
      </div>
    </div>
  );
}
