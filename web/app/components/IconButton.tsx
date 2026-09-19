/** A circular icon link: 32px disc, 44px tap target, colour + scale + glow on
 *  hover and focus.
 *
 *  Everything visual is a custom property on `.iconbtn`, so a caller restyles it
 *  with a style override and never touches the rules:
 *    --icon-size --icon-bg --icon-bg-hover --icon-bg-active
 *    --icon-fg --icon-scale --icon-glow --icon-duration
 *
 *  The disc is a ::before, not the anchor itself. That is what lets the tap
 *  target stay 44x44 while the circle stays 32px, and it means the hover scale
 *  never moves the target under the user's finger or cursor.
 */

import type { ReactNode } from 'react';

export type IconName = 'mail' | 'linkedin' | 'arrow';

/* Outlined glyphs on a 16 box, 1.5 stroke, currentColor. Stroke rather than
   fill so one glyph works on any disc colour without a second asset. */
const ICONS: Record<IconName, ReactNode> = {
  mail: (
    <>
      <rect x="1.6" y="3.4" width="12.8" height="9.2" rx="0.5" />
      <path d="M1.6 4.2 8 8.9l6.4-4.7" />
    </>
  ),
  linkedin: (
    <>
      <rect x="1.6" y="1.6" width="12.8" height="12.8" rx="1" />
      <path d="M4.6 6.8v4.6M4.6 4.7v.01M7.6 11.4V6.8M7.6 8.6c0-1 .7-1.8 1.8-1.8s1.8.8 1.8 1.8v2.8" />
    </>
  ),
  arrow: <path d="M2.5 8h11M9.5 4l4 4-4 4" />,
};

export default function IconButton({
  icon, href, label, className,
}: {
  icon: IconName;
  href: string;
  /** Used for BOTH the aria-label and the visually-hidden text, so the two can
   *  never drift apart and disagree about where the link goes. */
  label: string;
  className?: string;
}) {
  return (
    <a
      className={className ? `iconbtn ${className}` : 'iconbtn'}
      href={href}
      aria-label={label}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
           aria-hidden="true" focusable="false">
        {ICONS[icon]}
      </svg>
      {/* Belt and braces. `aria-label` is what assistive tech announces, since
          it overrides element content; this span is what a sighted user gets if
          the stylesheet fails to load and the glyph is all that would remain. */}
      <span className="u-hidden-text">{label}</span>
    </a>
  );
}
