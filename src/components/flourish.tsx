const SEED = "jishnuteegala.com";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

export function Flourish() {
  const rand = mulberry32(hash(SEED));
  const width = 640;
  const dots: { cx: number; cy: number; r: number; o: number }[] = [];
  let x = 0;
  while (x < width) {
    x += 14 + rand() * 34;
    const lane = Math.floor(rand() * 3);
    dots.push({
      cx: x,
      cy: 6 + lane * 8,
      r: rand() > 0.82 ? 2.4 : 1.5,
      o: 0.25 + rand() * 0.55,
    });
  }
  return (
    <svg
      className="mt-8 w-full max-w-xl text-accent"
      viewBox={`0 0 ${width} 28`}
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="6"
        x2={width}
        y2="6"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
      <line
        x1="0"
        y1="14"
        x2={width}
        y2="14"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
      <line
        x1="0"
        y1="22"
        x2={width}
        y2="22"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="currentColor" opacity={d.o} />
      ))}
    </svg>
  );
}
