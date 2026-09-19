import type { Metadata } from 'next';
import { PageIntro, Section, Prose } from '@/app/components/Primitives';
import { INSIGHTS } from '@/app/lib/content';

export const metadata: Metadata = {
  title: 'Insights | Adan Corporate',
  description: 'Writing and recorded conversations from Adan Corporate partners.',
  alternates: { canonical: '/en-uk/insights' },
};

export default function Insights() {
  return (
    <>
      <PageIntro title="The latest insights from our team" eyebrow="Insights"
        lead="Writing and recorded conversations from the partners." />
      <Section>
        <Prose>
          <p>Each piece below was published to its author&rsquo;s own account rather than
             to this domain, so each link goes there and says so. Nothing here is
             presented as an article owned by the firm.</p>
        </Prose>
        <div style={{ marginTop: 'var(--s-7)' }}>
          {INSIGHTS.map((i) => (
            <div className="practice" key={i.href}>
              <h2 className="practice__name">
                <a href={i.href} rel="noopener noreferrer nofollow" target="_blank">
                  {i.title} <span className="meta meta--inline">on LinkedIn</span>
                </a>
              </h2>
              <div className="practice__line">
                <p>{i.line}</p>
                <p className="meta">
                  {i.author}, {i.role} &nbsp;&middot;&nbsp; <time dateTime={i.iso}>{i.date}</time>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
