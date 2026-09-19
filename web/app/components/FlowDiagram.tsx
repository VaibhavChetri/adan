/** Where the firm sits in the capital chain: every arrow between a source of
 *  capital and a mid-market firm passes through Adan.
 *
 *  Redrawn from the diagram the firm already publishes at
 *  /assets/images/adan-where-we-operate.webp.
 *
 *  The labels are HTML, not SVG text. Text inside a scaled viewBox resizes with
 *  the box, which put these labels between 9px and 14px depending on viewport —
 *  below the 14px floor in DESIGN.md. Only the connecting lines are SVG; they
 *  stretch with preserveAspectRatio="none" and hold a true hairline via
 *  vector-effect. Row centres below must match the label rows: five rows put
 *  centres at 10/30/50/70/90, four rows at 12.5/37.5/62.5/87.5. */

import Image from 'next/image';
import hub from '@/public/logo-round.png';

const SOURCES = ['Private equity', 'Venture capital', 'Sovereign wealth', 'Family offices', 'Lenders'];
const OUTCOMES = ['M&A', 'Growth capital', 'Alliances & JVs', 'Exits'];

const centres = (n: number) => Array.from({ length: n }, (_, i) => ((i + 0.5) / n) * 100);

export default function FlowDiagram() {
  return (
    <figure className="flow">
      <div className="flow__grid">
        <ul className="flow__col">
          {SOURCES.map((s) => <li key={s}>{s}</li>)}
        </ul>

        <svg className="flow__wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {centres(SOURCES.length).map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2="50" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <div className="flow__hub">
          {/* The firm's circular badge, cropped from the 360x573 canvas it ships
              on and masked to its own circle so it carries no white square.
              256px native is sharp to 128 CSS px at 2x; the hub caps at 104.
              No `sizes`: it made the optimiser serve an 84px variant, which the
              browser then upscaled 2.5x at dpr 2. The intrinsic width wins. */}
          <Image src={hub} alt="" width={256} height={256} priority />
        </div>

        <svg className="flow__wires flow__wires--out" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {centres(OUTCOMES.length).map((y) => (
            <line key={y} x1="0" y1="50" x2="100" y2={y} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        <ul className="flow__col flow__col--out">
          {OUTCOMES.map((o) => <li key={o}>{o}</li>)}
        </ul>

        <p className="flow__key flow__key--in">Capital</p>
        <p className="flow__key flow__key--hub">Adan</p>
        <p className="flow__key flow__key--out">Mid-market firms</p>
      </div>
      <figcaption className="flow__caption">
        Private equity, venture capital, sovereign wealth, family offices and lenders
        on one side; M&amp;A, growth capital, alliances and joint ventures, and exits
        on the other. Adan sits on every transaction between them.
      </figcaption>
    </figure>
  );
}
