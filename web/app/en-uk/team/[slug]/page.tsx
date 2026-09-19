import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PARTNERS } from '@/app/lib/content';
import { PageIntro, Section, Actions } from '@/app/components/Primitives';

export function generateStaticParams() {
  return PARTNERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PARTNERS.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} | Adan Corporate`,
           description: `${p.name}, ${p.role}, ${p.focus}. Based in ${p.city}.`,
           alternates: { canonical: `/en-uk/team/${p.slug}` } };
}

export default async function TeamMember({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PARTNERS.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageIntro title={p.name} eyebrowHref="/en-uk/about-us/team" eyebrowLabel="&larr; Team"
                 lead={`${p.role} · ${p.focus} · ${p.city}`} />
      <Section>
        <div className="team team--single">
          <div>
            <div className={p.photo ? 'person__frame person__frame--photo' : 'person__frame'}>
              {p.photo
                ? <Image src={p.photo} alt="" width={400} height={400} sizes="(min-width:1024px) 300px, 60vw" priority />
                : <span className="person__initials" aria-hidden="true">{p.initials}</span>}
            </div>
          </div>
          <div className="prose">
            {p.bio && <p>{p.bio}</p>}
            <p style={{ marginTop: 'var(--s-5)' }}>
              <a className="inline-link" href={`mailto:${p.email}`}>{p.email}</a>
              {p.linkedin && (
                <> &nbsp;·&nbsp; <a className="inline-link" href={p.linkedin}
                   rel="noopener noreferrer" target="_blank">LinkedIn</a></>
              )}
            </p>
          </div>
        </div>
      </Section>
      <Section title="Start a conversation" major>
        <Actions>
          <a className="btn btn--primary" href="/en-uk/contact">Contact {p.name.replace(/\s*\(.*?\)\s*/, ' ').split(' ')[0]}</a>
          <a className="btn btn--secondary" href="/en-uk/about-us/team">All of the team</a>
        </Actions>
      </Section>
    </>
  );
}
