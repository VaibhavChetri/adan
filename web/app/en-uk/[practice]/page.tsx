import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRACTICES, practiceBySlug } from '@/app/lib/content';
import { PageIntro, Section, Prose, Actions } from '@/app/components/Primitives';

export function generateStaticParams() {
  return PRACTICES.map((p) => ({ practice: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ practice: string }> }): Promise<Metadata> {
  const { practice } = await params;
  const p = practiceBySlug(practice);
  if (!p) return {};
  return { title: `${p.name} | Adan Corporate`, description: p.lead,
           alternates: { canonical: `/en-uk/${p.slug}` } };
}

export default async function PracticeHub({ params }: { params: Promise<{ practice: string }> }) {
  const { practice } = await params;
  const p = practiceBySlug(practice);
  if (!p) notFound();
  return (
    <>
      <PageIntro
        title={p.name}
        lead={p.lead}
        eyebrow="Practice"
        aside={
          <>
            <p className="hero__aside-head">{p.services.length} services</p>
            <ul className="hero__jump">
              {p.services.map((s) => (
                <li key={s.slug}><a href={`#${s.slug}`}>{s.name}</a></li>
              ))}
            </ul>
          </>
        }
      />
      <Section title="What we cover" sunken>
        <div className="cards cards--3">
          {p.services.map((s) => (
            <article className="card reveal" id={s.slug} key={s.slug}>
              <h3 className="card__title">
                <a href={`/en-uk/${p.slug}/${s.slug}`}>{s.name}</a>
              </h3>
              <p className="card__body">{s.line}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Who you would work with" major>
        <Prose><p>Every engagement is led by a named partner who is accountable for the outcome. There is no delegation to an unnamed team.</p></Prose>
        <Actions>
          <a className="btn btn--primary" href="/en-uk/contact">Start a conversation</a>
          <a className="btn btn--secondary" href="/en-uk/about-us/team">Meet the partners</a>
        </Actions>
      </Section>
    </>
  );
}
