import type { Metadata } from 'next';
import { PARTNERS } from '@/app/lib/content';
import { PageIntro, Section, Person, Prose } from '@/app/components/Primitives';

export const metadata: Metadata = {
  title: 'Team | Adan Corporate',
  description: 'Senior multi-disciplinary corporate and finance professionals with diverse geographic, sector and transaction focuses.',
  alternates: { canonical: '/en-uk/about-us/team' },
};

const GROUPS = ['Managing Partner', 'Partner', 'Director', 'Financial Analyst',
                'Corporate Intern (Technology)', 'Advisor'] as const;

export default function TeamIndex() {
  return (
    <>
      <PageIntro title="Our people" eyebrow="The firm"
        lead="Senior multi-disciplinary corporate and finance professionals with diverse geographic, sector and transaction focuses. Every engagement is led by a named partner."
        aside={
          <>
            <p className="hero__aside-head">{PARTNERS.length} people</p>
            <ul className="hero__jump">
              {GROUPS.filter((g) => PARTNERS.some((p) => p.role === g)).map((g) => (
                <li key={g}>
                  <a href={`#${g.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`}>
                    {g} ({PARTNERS.filter((p) => p.role === g).length})
                  </a>
                </li>
              ))}
            </ul>
          </>
        } />
      {GROUPS.map((g) => {
        const people = PARTNERS.filter((p) => p.role === g);
        if (!people.length) return null;
        return (
          <Section key={g} id={g.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}
                   sunken={GROUPS.indexOf(g) % 2 === 1}
                   title={g === 'Partner' ? 'Partners' : `${g}s`.replace('(Technology)s', '(Technology)')}>
            <div className="team">
              {people.map((p) => (
                <Person key={p.slug} initials={p.initials} name={p.name} focus={p.focus}
                        city={p.city} photo={p.photo} href={`/en-uk/team/${p.slug}`} />
              ))}
            </div>
          </Section>
        );
      })}
      <Section title="On photography" major>
        <Prose>
          <p>Photographs are the headshots each person supplied to the firm. Where a
             frame carries initials instead, no approved headshot exists yet and the
             frame stays empty rather than being filled with a stand-in.</p>
        </Prose>
      </Section>
    </>
  );
}
