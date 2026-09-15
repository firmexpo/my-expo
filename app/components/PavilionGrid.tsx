const COLS = 6;
const ROWS = 7;
const CELL = 42;
const GAP = 10;
const STEP = CELL + GAP;

// Deterministic pseudo-random-ish sizing/delay per cell so the grid reads as
// an expo floor plan of booths of varying size, not a uniform checkerboard.
function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function PavilionGrid() {
  const width = COLS * STEP - GAP;
  const height = ROWS * STEP - GAP;

  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      const r = seeded(i);
      if (r < 0.22) continue; // leave gaps, like open aisles
      const lit = r > 0.6;
      const delay = (seeded(i + 99) * 2.2).toFixed(2);
      cells.push(
        <rect
          key={i}
          className="booth"
          x={col * STEP}
          y={row * STEP}
          width={CELL}
          height={CELL}
          rx={4}
          fill={lit ? "var(--signal)" : "var(--bg-panel-2)"}
          stroke={lit ? "var(--signal)" : "var(--line)"}
          strokeWidth={1}
          style={{ animationDelay: `${delay}s` }}
        />
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-md"
      role="img"
      aria-label="Abstract grid of exposition booths, lighting up in sequence"
    >
      {cells}
    </svg>
  );
}
