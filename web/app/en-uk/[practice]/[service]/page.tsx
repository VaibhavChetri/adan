import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PRACTICES, serviceBySlug } from '@/app/lib/content';
import { PageIntro, Section, Prose, Actions, RuleRow, TK } from '@/app/components/Primitives';

export function generateStaticParams() {
  return PRACTICES.flatMap((p) => p.services.map((s) => ({ practice: p.slug, service: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ practice: string; service: string }> }): Promise<Metadata> {
  const { practice, service } = await params;
  const found = serviceBySlug(practice, service);
  if (!found?.service) return {};
  return { title: `${found.service.name} | ${found.practice.name} | Adan Corporate`,
           description: found.service.line,
           alternates: { canonical: `/en-uk/${practice}/${service}` } };
}

export default async function ServiceLeaf({ params }: { params: Promise<{ practice: string; service: string }> }) {
  const { practice, service } = await params;
  const found = serviceBySlug(practice, service);
  if (!found?.service) notFound();
  const { practice: p, service: s } = found;
  const siblings = p.services.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <>
      <PageIntro title={s.name} lead={s.line}
        eyebrowHref={`/en-uk/${p.slug}`} eyebrowLabel={`\u2190 ${p.name}`}
        aside={
          <>
            <p className="hero__aside-head">Also in {p.name}</p>
            <ul className="hero__jump">
              {p.services.filter((x) => x.slug !== s.slug).map((x: { slug: string; name: string }) => (
                <li key={x.slug}>
                  <a href={`/en-uk/${p.slug}/${x.slug}`}>{x.name}</a>
                </li>
              ))}
            </ul>
          </>
        } />
      <Section title="What this involves">
        <Prose>
          <p><TK>TKTK</TK> — a description of how this service is actually delivered: what happens first, who is involved, and what the client receives. Written once, for this service only, not adapted from another page.</p>
          <p style={{ marginTop: 'var(--s-4)' }}>Every claim on this page about past engagements is held until a partner has confirmed it and a source is recorded.</p>
        </Prose>
      </Section>
      <Section title="Related" major>
        {siblings.map((x) => (
          <RuleRow key={x.slug} name={x.name} href={`/en-uk/${p.slug}/${x.slug}`} line={x.line} />
        ))}
        <Actions>
          <a className="btn btn--primary" href="/en-uk/contact">Discuss this</a>
        </Actions>
      </Section>
    </>
  );
}
