/** Where Adan sits in the capital chain. A faithful redraw of the diagram the
 *  firm publishes under "What we do" — same boxes, same arrows, same direction.
 *
 *  Topology, read off the published diagram:
 *    tray of nine capital sources
 *      -> "Investments"    -> SMEs (growth stage)
 *      -> "Fund placement" -> PE & VC funds
 *    Lenders -> SMEs (growth stage)       [debt, working capital]
 *    Lenders -> SMEs (exit stage)         [same instruments, later stage]
 *    PE & VC funds -> "Primary raises"    -> SMEs (growth stage)
 *    SMEs (growth) -> down -> SMEs (exit) [M&A, go to market, growth, JVs]
 *    SMEs (exit)   -> "Secondary exits"   -> up into PE & VC funds
 *
 *  An Adan node sits on every one of those eight flows. That repetition is the
 *  argument of the diagram, so the badge is the repeated element.
 *
 *  Both enterprise boxes carry the same name in the original because they are
 *  the same firm at two points in its life; the arrow between them is what
 *  distinguishes them. Drawn that way here rather than merged.
 *
 *  Structure is CSS grid and labels are HTML, so no connector can drift from
 *  the box it points at and no text is ever scaled below the 14px floor.
 */

import Image from 'next/image';
import badge from '@/public/logo-round.png';
import {
  CAPITAL_SOURCES, VALUE_CREATION, LENDER_INSTRUMENTS, SOURCE_COUNT,
} from '@/app/lib/content';

const SME = 'Small & medium-sized enterprises (SMEs)';

/** The Adan node. Sits on a flow, never inside a box. */
function Node() {
  return (
    <span className="cf__node">
      <Image src={badge} alt="" width={64} height={64} />
    </span>
  );
}

export default function CapitalFlow() {
  return (
    <figure className="cf">
      <div className="cf__grid">
        <div className="cf__tray" style={{ gridArea: 'tray' }}>
          <p className="cf__traylabel">Capital sources</p>
          <ul className="cf__chips">
            {CAPITAL_SOURCES.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>

        <div className="cf__down" style={{ gridArea: 'din' }}>
          <Node />
          <span className="cf__flowlabel">Investments</span>
        </div>
        <div className="cf__down" style={{ gridArea: 'dfu' }}>
          <Node />
          <span className="cf__flowlabel">Fund placement</span>
        </div>

        {/* The lenders column, drawn the way the published diagram draws it:
            one vertical riser through the middle of the box, a node sitting on
            it directly above and directly below, and a flow leaving each node
            to the right. The instruments are a list beside the lower node, not
            contents of the box. */}
        <div className="cf__lbox" style={{ gridArea: 'lbox' }}>
          <div className="cf__box cf__box--side">
            <p className="cf__boxname">Lenders</p>
          </div>
        </div>

        <div className="cf__lnode cf__lnode--top" style={{ gridArea: 'lnt' }}>
          <Node />
        </div>
        <div className="cf__across cf__across--stub" style={{ gridArea: 'cl1' }}
             aria-hidden="true" />

        <div className="cf__box cf__box--focus" style={{ gridArea: 'sme1' }}>
          <p className="cf__boxname">{SME}</p>
          <p className="cf__boxnote">Growth stage</p>
        </div>

        <div className="cf__across cf__across--rev" style={{ gridArea: 'cr1' }}>
          <Node />
          <span className="cf__flowlabel">Primary raises</span>
        </div>

        <div className="cf__box cf__box--side" style={{ gridArea: 'pevc' }}>
          <p className="cf__boxname">Private equity &amp; venture capital</p>
          <p className="cf__boxnote">Funds</p>
        </div>

        {/* Growth stage to exit stage. The work Adan does on that arrow is the
            list beside it, exactly where the original puts it. */}
        <div className="cf__stage" style={{ gridArea: 'stage' }}>
          <Node />
          <ul className="cf__sub cf__stagelist">
            {VALUE_CREATION.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </div>

        <div className="cf__upline" style={{ gridArea: 'pup' }} aria-hidden="true" />

        <div className="cf__lnode cf__lnode--bottom" style={{ gridArea: 'lnb' }}>
          <ul className="cf__sub cf__lendlist">
            {LENDER_INSTRUMENTS.map((i) => <li key={i}>{i}</li>)}
          </ul>
          <Node />
        </div>
        <div className="cf__across cf__across--stub" style={{ gridArea: 'cl3' }}
             aria-hidden="true" />



        <div className="cf__box cf__box--muted" style={{ gridArea: 'sme2' }}>
          <p className="cf__boxname">{SME}</p>
          <p className="cf__boxnote">Exit stage</p>
        </div>

        <div className="cf__across cf__across--plain" style={{ gridArea: 'rm' }}>
          <Node />
          <span className="cf__flowlabel">Secondary exits</span>
        </div>
        <div className="cf__corner" style={{ gridArea: 'rr' }} aria-hidden="true" />
      </div>

      {/* The diagram is information, not ornament, so it carries its own prose
          equivalent. Visible on narrow screens where the connectors are dropped;
          read by assistive technology everywhere. */}
      <figcaption className="cf__caption">
        {SOURCE_COUNT} kinds of capital source reach mid-market firms two ways:
        invested directly, or placed with private equity and venture capital funds.
        Lenders provide {LENDER_INSTRUMENTS.join(' and ').toLowerCase()} at both the
        growth and exit stages, and the funds provide primary raises. Between those
        two stages sit {VALUE_CREATION.join(', ').toLowerCase()}. Firms then return
        capital to the funds through secondary exits. Adan sits on every one of
        those flows.
      </figcaption>
    </figure>
  );
}
