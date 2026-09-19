import Image from 'next/image';
import EnquiryForm from './components/EnquiryForm';
import FlowDiagram from './components/FlowDiagram';
import CapitalFlow from './components/CapitalFlow';
import IconButton from './components/IconButton';
import { Section, Prose, Actions } from './components/Primitives';
import {
  SENIOR, WHO_WE_ARE, WHAT_WE_DO, ADVANTAGE_LINE, BREADTH,
  NETWORK, OFFICES, AI_METHOD, OFFICE_COUNT, COUNTRY_COUNT,
  CONTINENT_COUNT, INSIGHTS, SENIORITY_YEARS, PARTNERS, LARGEST_DEAL,
} from './lib/content';
import network from '@/public/careers-network.webp';

const LONDON = OFFICES.find((o) => o.city === 'London');

// The four figures on the stat band, in the same order and to the same sense as
// the live site's counters. Every one is derived from a list on this site, never
// typed. Where the live figure has no source behind it the derived one differs,
// and the difference is deliberate:
//   live "35 corporate professionals" -> 32, the roster it actually publishes
//   live "20 average years"           -> 25+, parsed from the bios themselves
//   live "15 countries"               -> 13, counted from its own office list
//   live "5 (billion USD) value"      -> largest DISCLOSED deal; no cumulative
//                                        total is published anywhere
const FIGURES = [
  { n: String(PARTNERS.length), l: 'corporate professionals, each listed here by name' },
  { n: `${SENIORITY_YEARS}+`, l: 'years of experience, the figure most partners state in their own bio' },
  { n: String(COUNTRY_COUNT), l: `countries across ${CONTINENT_COUNT} continents, ${OFFICE_COUNT} listed addresses` },
  { n: LARGEST_DEAL, l: 'largest single transaction the firm discloses' },
];

export default function Home() {
  return (
    <>
      <section className="hero hero--dark hero--full">
        <div className="container hero__grid hero__grid--flow">
          <div>
            <p className="hero__eyebrow">International corporate advisory</p>
            <h1 className="hero__title">{ADVANTAGE_LINE}</h1>
            <p className="hero__lead">{WHAT_WE_DO[0]}</p>
            <Actions>
              <a className="btn btn--primary" href="#contact">Speak to a partner</a>
            </Actions>
          </div>
          <FlowDiagram />
        </div>

      </section>

      {/* Image beside the text, the arrangement the firm already uses for this
          section. alt is empty: the photograph is decorative and the paragraphs
          beside it carry the whole meaning, so announcing it would only add
          noise for a screen reader. */}
      <Section>
        <div className="split">
          <div className="split__media">
            <Image src={network} alt="" sizes="(min-width:860px) 46vw, 92vw" placeholder="blur" />
          </div>
          <div className="split__body">
            <h2 className="section__title">Who we are</h2>
            {WHO_WE_ARE.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </Section>

      <section className="statband">
        <div className="statband__inner">
          <div className="container">
            <div className="statband__grid">
              {FIGURES.map((f) => (
                <div key={f.l}>
                  <span className="statband__n">{f.n}</span>
                  <span className="statband__l">{f.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section title="What we do" sunken centred>
        <Prose><p>{WHAT_WE_DO[1]}</p></Prose>
        <CapitalFlow />
        <Prose wide><p>{WHAT_WE_DO[2]}</p></Prose>
      </Section>

      <Section title={AI_METHOD.title} id="ai" sunken rail>
        <p className="standfirst">{AI_METHOD.standfirst}</p>
        {/* Same three paragraphs, not a word rewritten - set side by side under
            hairlines instead of stacked, so the section reads as three points
            rather than as an essay. */}
        <div className="notes">
          {AI_METHOD.body.map((t, i) => <p className="notes__item" key={i}>{t}</p>)}
        </div>
        <Actions>
          <a className="btn btn--secondary" href={AI_METHOD.href}>How we apply it</a>
        </Actions>
      </Section>

      <Section title="Our breadth and depth of services" rail>
        <Prose>
          <p>The spectrum of our expertise and network of decision makers helps us
             assist clients with innovative solutions.</p>
        </Prose>
        <div className="facets">
          {BREADTH.map((b) => (
            <div className="facets__item reveal" key={b.name}>
              <h3 className="facets__name">{b.name}</h3>
              <p className="facets__line">{b.line}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How do we do it?" inverse major>
        <Prose><p>We use our extensive global network.</p></Prose>
        <div className="cols">
          {NETWORK.map((n) => (
            <div key={n.group} className="reveal">
              <h3 className="cols__head">{n.group}</h3>
              <ul className="cols__list">{n.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our people" major sunken>
        <Prose>
          <p>Senior multi-disciplinary corporate and finance professionals with diverse
             geographic, sector and transaction focuses. Every engagement is led by a
             named partner.</p>
        </Prose>
        <div className="people">
          {SENIOR.slice(0, 6).map((p) => (
            <article className="person-card reveal" key={p.slug}>
              <div className="person-card__frame">
                {p.photo
                  ? <Image src={p.photo} alt="" width={400} height={400} sizes="(min-width:960px) 220px, 60vw" />
                  : <span className="person-card__initials" aria-hidden="true">{p.initials}</span>}
              </div>
              <h3 className="person-card__name">
                <a href={`/en-uk/team/${p.slug}`}>{p.name}</a>
              </h3>
              <p className="person-card__role">{p.role}, {p.city}</p>
              <p className="person-card__focus">{p.focus}</p>
              {/* Sits above the tile's stretched link, so it is a real second
                  target rather than 44px of the profile link wearing an icon. */}
              <IconButton icon="mail" href={`mailto:${p.email}`}
                          label={`Email ${p.name}`} className="person-card__mail" />
            </article>
          ))}
        </div>
        <Actions>
          <a className="btn btn--secondary" href="/en-uk/about-us/team">Meet our people</a>
        </Actions>
      </Section>

      <Section title="Latest insights from our team">
        <Prose>
          <p>Writing and recorded conversations from the partners. Each piece was
             published to its author&rsquo;s own account; the link goes there.</p>
        </Prose>
        <div className="cards cards--3">
          {INSIGHTS.slice(0, 3).map((i) => (
            <article className="card reveal" key={i.href}>
              <p className="card__kicker">
                <time dateTime={i.iso}>{i.date}</time>
              </p>
              <h3 className="card__title">
                <a href={i.href} rel="noopener noreferrer nofollow" target="_blank">{i.title}</a>
              </h3>
              <p className="card__body">{i.line}</p>
              <p className="card__meta">{i.author}, {i.role} &middot; on LinkedIn</p>
            </article>
          ))}
        </div>
        <Actions>
          <a className="btn btn--secondary" href="/en-uk/insights">All insights</a>
        </Actions>
      </Section>

      <Section title="See what we can do for you" major sunken id="contact">
        <div className="contact">
          <div>
            <Prose>
              <p>Whether you want to try us out, join us, ask a one-off question or
                 just pick our brains, tell us briefly what you are considering.
                 A partner replies directly.</p>
            </Prose>
            <EnquiryForm />
          </div>

          {/* The routes that work today. This is also what stops the form being
              a dead end while it has no inbox behind it. */}
          <aside className="contact__aside">
            <div className="contact__group">
              <p className="contact__grouptitle">Go straight to a partner</p>
              <p className="contact__lead">
                All {SENIOR.length} partners publish their own address.
              </p>
              <p className="contact__note">
                Engagements are led by a named partner, so writing to one directly
                is the shortest route. Each profile carries an email and a LinkedIn.
              </p>
              <p style={{ marginTop: 'var(--s-4)' }}>
                <a className="arrow-link" href="/en-uk/about-us/team">Find a partner</a>
              </p>
            </div>

            <div className="contact__group">
              <p className="contact__grouptitle">Call an office</p>
              {LONDON?.tel && (
                <a className="contact__tel" href={`tel:${LONDON.tel.replace(/\s/g, '')}`}>
                  {LONDON.tel}
                </a>
              )}
              <p className="contact__note">
                London. {OFFICE_COUNT - 1} other offices publish their own number.
              </p>
              <p style={{ marginTop: 'var(--s-4)' }}>
                <a className="arrow-link" href="/en-uk/contact">All {OFFICE_COUNT} offices</a>
              </p>
            </div>

            <div className="contact__group">
              <p className="contact__grouptitle">Registered office</p>
              <address className="contact__addr">{LONDON?.address}</address>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
