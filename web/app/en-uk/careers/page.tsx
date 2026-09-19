import type { Metadata } from 'next';
import { PageIntro, Section, RuleRow, Prose, Actions, TK } from '@/app/components/Primitives';

export const metadata: Metadata = {
  title: 'Careers | Adan Corporate',
  description: 'Experienced hires, associate partners and internships at Adan Corporate.',
  alternates: { canonical: '/en-uk/careers' },
};

const ROUTES = [
  { name: 'Associate Partner', line: 'For operators with a transaction record who want to advise rather than run.' },
  { name: 'Experienced Hire', line: 'Corporate finance, M&A, risk and strategy professionals joining an engagement team.' },
  { name: 'Internship', line: 'Structured placements in corporate finance advisory and risk.' },
];

export default function Careers() {
  return (
    <>
      <PageIntro title="Careers" eyebrow="Join us"
        lead="We hire people who have done the job before advising on it. That is the whole model, so it is also the hiring bar." />
      <Section title="Three routes in">
        {ROUTES.map((r) => <RuleRow key={r.name} name={r.name} line={r.line} />)}
      </Section>
      <Section title="Open positions" major>
        <Prose>
          <p><TK>TKTK</TK> — open roles are listed here with a location, a named hiring partner and a closing date. Nothing is listed until those three are confirmed.</p>
        </Prose>
        <Actions>
          <a className="btn btn--primary" href="mailto:careers@adancorporate.com">Send a CV</a>
          <a className="btn btn--secondary" href="/en-uk/legal/diversity-policy">Diversity policy</a>
        </Actions>
      </Section>
    </>
  );
}
