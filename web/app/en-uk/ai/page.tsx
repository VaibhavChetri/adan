import type { Metadata } from 'next';
import { PageIntro, Section, Prose, Actions } from '@/app/components/Primitives';
import { AI_METHOD, AI_APPLICATIONS, AI_LIMITS } from '@/app/lib/content';

export const metadata: Metadata = {
  title: 'AI and automation in risk and diligence | Adan Corporate',
  description:
    'How Adan Corporate uses automated tooling in diligence and risk work, where judgement stays with a named partner, and what we do not claim.',
  alternates: { canonical: '/en-uk/ai' },
};

export default function AiSection() {
  return (
    <>
      <PageIntro
        title={AI_METHOD.title}
        eyebrow="Method"
        lead={AI_METHOD.standfirst}
        aside={
          <>
            <p className="hero__aside-head">Where we apply it</p>
            <ul className="hero__jump">
              {AI_APPLICATIONS.map((a) => (
                <li key={a.name}><a href={`#${a.href.split('/').pop()}`}>{a.name}</a></li>
              ))}
            </ul>
          </>
        }
      />

      <Section title="What the tooling does" rail>
        <Prose>
          {AI_METHOD.body.map((t, i) => (
            <p key={i} style={i ? { marginTop: 'var(--s-4)' } : undefined}>{t}</p>
          ))}
        </Prose>
      </Section>

      <Section title="Where we apply it" sunken major>
        <Prose>
          <p>Each of these sits inside work the firm already does. None of it is a
             separate product, and none of it is billed as one.</p>
        </Prose>
        <div className="cards cards--3">
          {AI_APPLICATIONS.map((a) => (
            <article className="card reveal" id={a.href.split('/').pop()} key={a.name}>
              <p className="card__kicker">{a.practice}</p>
              <h3 className="card__title"><a href={a.href}>{a.name}</a></h3>
              <p className="card__body">{a.line}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section title="What we do not claim" inverse major>
        <Prose>
          <p>The clearest thing a firm can say about this is where it stops.</p>
        </Prose>
        <ul className="limits">
          {AI_LIMITS.map((l) => <li className="reveal" key={l}>{l}</li>)}
        </ul>
      </Section>

      <Section title="Talk to the partner who would do the work" major>
        <Prose>
          <p>Every engagement is led by a named partner who is accountable for the
             conclusions, whatever produced the first draft of them.</p>
        </Prose>
        <Actions>
          <a className="btn btn--primary" href="/en-uk/contact">Start a conversation</a>
          <a className="btn btn--secondary" href="/en-uk/risk">Risk &amp; Governance</a>
        </Actions>
      </Section>
    </>
  );
}
