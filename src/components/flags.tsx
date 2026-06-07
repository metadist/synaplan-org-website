// Animated EU + Swiss flags for the hero. Pure SVG + CSS (see globals.css
// flag-wave / flag-float). Decorative — hidden from assistive tech.

const STAR_RADIUS = 13.3;
const STAR_PATH =
  "M0,-3 L0.69,-0.95 L2.85,-0.93 L1.12,0.36 L1.76,2.43 L0,1.18 L-1.76,2.43 L-1.12,0.36 L-2.85,-0.93 L-0.69,-0.95 Z";

function EuFlag() {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const theta = (i * 30 * Math.PI) / 180;
    const x = 30 + STAR_RADIUS * Math.sin(theta);
    const y = 20 - STAR_RADIUS * Math.cos(theta);
    return { x, y, key: i };
  });

  return (
    <svg viewBox="0 0 60 40" className="h-full w-full" aria-hidden>
      <rect width="60" height="40" rx="2" fill="#003399" />
      <g fill="#FFCC00">
        {stars.map((s) => (
          <path key={s.key} d={STAR_PATH} transform={`translate(${s.x} ${s.y})`} />
        ))}
      </g>
    </svg>
  );
}

function SwissFlag() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
      <rect width="40" height="40" rx="2" fill="#D52B1E" />
      <rect x="17" y="8" width="6" height="24" fill="#fff" />
      <rect x="8" y="17" width="24" height="6" fill="#fff" />
    </svg>
  );
}

export function Flags() {
  return (
    <div
      className="flag-float flex items-center justify-center gap-5 sm:gap-7"
      aria-hidden
    >
      <div className="flag-wave aspect-[3/2] w-28 overflow-hidden rounded-md shadow-lg shadow-black/15 ring-1 ring-black/5 sm:w-36">
        <EuFlag />
      </div>
      <div
        className="flag-wave aspect-square w-20 overflow-hidden rounded-md shadow-lg shadow-black/15 ring-1 ring-black/5 sm:w-24"
        style={{ animationDelay: "-2s" }}
      >
        <SwissFlag />
      </div>
    </div>
  );
}
