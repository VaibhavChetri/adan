/** Shared page primitives. Every template composes from these.
 *  No page defines its own layout or styling. */

import { ReactNode } from 'react';
import Image from 'next/image';

/** The one H1 on any page, with its standfirst.
 *  Dark band, sized to its content. `aside` fills the right-hand column on wide
 *  screens; without it the hero narrows rather than leaving half the band empty. */
export function PageIntro({ title, lead, eyebrow, eyebrowHref, eyebrowLabel, aside }: {
  title: string; lead?: string; eyebrow?: string;
  eyebrowHref?: string; eyebrowLabel?: string; aside?: ReactNode;
}) {
  return (
    <section className="hero hero--dark hero--page">
      <div className={aside ? 'container hero__grid hero__grid--page' : 'container'}>
        <div>
          {eyebrowHref && eyebrowLabel && (
            <p className="page-back"><a href={eyebrowHref}>{eyebrowLabel}</a></p>
          )}
          {eyebrow && !eyebrowHref && <p className="hero__eyebrow">{eyebrow}</p>}
          <h1 className="hero__title hero__title--page">{title}</h1>
          {lead && <p className="hero__lead">{lead}</p>}
        </div>
        {aside && <div className="hero__aside">{aside}</div>}
      </div>
    </section>
  );
}

export function Section({ title, children, inverse, sunken, major, rail, centred, id }: {
  title?: string; children: ReactNode; inverse?: boolean; sunken?: boolean;
  major?: boolean; rail?: boolean; centred?: boolean; id?: string;
}) {
  const cls = ['section', inverse && 'section--inverse', sunken && 'section--sunken',
               major && 'section--major', rail && 'section--rail',
               centred && 'section--centred']
    .filter(Boolean).join(' ');
  return (
    <section className={cls} id={id}>
      <div className="container">
        {/* rail: the heading holds a narrow sticky column on the left while the
            content scrolls past it. Editorial rhythm with no card and no panel. */}
        {rail ? (
          <div className="rail">
            {title && <div className="rail__head"><h2 className="section__title">{title}</h2></div>}
            <div className="rail__body">{children}</div>
          </div>
        ) : (
          <>
            {title && <h2 className="section__title">{title}</h2>}
            {children}
          </>
        )}
      </div>
    </section>
  );
}

export function Prose({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={wide ? 'prose prose--wide' : 'prose'}>{children}</div>;
}

/** The hairline row. Used for services, practices, and any name/description pair. */
export function RuleRow({ name, href, line, level = 3 }: {
  name: string; href?: string; line: string; level?: 2 | 3;
}) {
  const H = (level === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  return (
    <div className="practice">
      <H className="practice__name">{href ? <a href={href}>{name}</a> : name}</H>
      <p className="practice__line">{line}</p>
    </div>
  );
}

/** Figure + label row with tabular numerals. Used by the deal record and any
 *  key/value list that carries numbers. */
export function RecordRow({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="record__row">
      <span className="record__figure"><span className="tk">{figure}</span></span>
      <span className="record__label">{label}</span>
    </div>
  );
}

export function Person({ initials, name, role, focus, city, photo, href, level = 3 }: {
  initials: string; name: string; role?: string; focus?: string; city?: string;
  photo?: string; href?: string; level?: 2 | 3;
}) {
  const H = (level === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  return (
    <article className="person">
      <div className={photo ? 'person__frame person__frame--photo' : 'person__frame'}>
        {photo ? (
          // Headshots as published by the firm. 400px originals: see register F55.
          <Image src={photo} alt="" width={400} height={400} sizes="(min-width:1024px) 300px, 50vw" />
        ) : (
          <span className="person__initials" aria-hidden="true">{initials}</span>
        )}
      </div>
      <H className="person__name">{href ? <a href={href}>{name}</a> : name}</H>
      {role && <p className="person__role">{role}{city ? ` · ${city}` : ''}</p>}
      {focus && <p className="person__outcome">{focus}</p>}
    </article>
  );
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="hero__actions">{children}</div>;
}

export function TK({ children }: { children: ReactNode }) {
  return <span className="tk">{children}</span>;
}

/** Legal and policy documents: a definition-style list on hairline rules. */
export function DefinitionRow({ term, children, level = 3 }: {
  term: string; children: ReactNode; level?: 2 | 3;
}) {
  const H = (level === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  return (
    <div className="practice">
      <H className="practice__name">{term}</H>
      <div className="practice__line">{children}</div>
    </div>
  );
}
