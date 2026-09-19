import type { Metadata } from 'next';
import EnquiryForm from '@/app/components/EnquiryForm';
import { PageIntro, Section, Prose, TK } from '@/app/components/Primitives';
import { OFFICES, OFFICE_COUNT, COUNTRY_COUNT, CONTINENT_COUNT } from '@/app/lib/content';

export const metadata: Metadata = {
  title: 'Contact and offices | Adan Corporate',
  description: `Drop us a line. Adan Corporate has ${OFFICE_COUNT} offices in ${COUNTRY_COUNT} countries across ${CONTINENT_COUNT} continents.`,
  alternates: { canonical: '/en-uk/contact' },
};

const CONTINENTS = [...new Set(OFFICES.map((o) => o.continent))];

export default function Contact() {
  return (
    <>
      <PageIntro title="Drop us a line" eyebrow="Contact"
        lead="We would be delighted to hear from you. Whether you want to try us out, join us, ask a one-off question or just pick our brains about our professional services, a partner replies directly."
        aside={
          <>
            <p className="hero__aside-head">{OFFICE_COUNT} offices</p>
            <ul className="hero__jump">
              {CONTINENTS.map((c) => (
                <li key={c}>
                  <a href={`#${c.toLowerCase()}`}>
                    {c} ({OFFICES.filter((o) => o.continent === c).length})
                  </a>
                </li>
              ))}
            </ul>
          </>
        } />
      <Section>
        <EnquiryForm />
      </Section>

      <Section title="Global locations" major>
        <Prose>
          <p>Global presence, local knowledge. {OFFICE_COUNT} offices in {COUNTRY_COUNT} countries
             across {CONTINENT_COUNT} continents.</p>
        </Prose>
        {CONTINENTS.map((c) => (
          <div key={c} id={c.toLowerCase()} style={{ marginTop: 'var(--s-8)' }}>
            <h3 className="cols__head">{c}</h3>
            <div className="offices">
              {OFFICES.filter((o) => o.continent === c).map((o) => (
                <div className="office" key={o.city}>
                  <h4 className="office__city">{o.city}</h4>
                  <address className="office__address">
                    {o.address ?? o.country}
                    {o.address && <><br />{o.country}</>}
                    {o.tel && <><br /><a href={`tel:${o.tel.replace(/\s/g, '')}`}>{o.tel}</a></>}
                  </address>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Registered office">
        <Prose>
          <address style={{ fontStyle: 'normal', lineHeight: 1.7 }}>
            Adan Corporate<br />
            27 Old Gloucester Street<br />
            London WC1N 3AX<br />
            United Kingdom<br />
            <a className="inline-link" href="tel:+447917120849">+44 7917 120849</a>
          </address>
          <p style={{ marginTop: 'var(--s-5)' }}>
            Company number <TK>TKTK</TK> &mdash; held until confirmed against the
            Companies House record.
          </p>
        </Prose>
      </Section>
    </>
  );
}
