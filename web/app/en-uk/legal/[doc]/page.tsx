import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageIntro, Section, DefinitionRow, Prose, TK } from '@/app/components/Primitives';

const DOCS = {
  'privacy-policy': {
    title: 'Privacy policy',
    lead: 'How Adan Corporate collects, uses and stores personal data, under UK GDPR.',
    sections: ['Who we are and how to contact us', 'What personal data we collect',
      'Our lawful basis for processing', 'How long we keep it', 'Who we share it with',
      'International transfers', 'Your rights, including erasure',
      'How to complain to the Information Commissioner'],
  },
  'cookie-policy': {
    title: 'Cookie policy',
    lead: 'What this site stores on your device, and how to change your mind.',
    sections: ['Essential cookies', 'Measurement cookies', 'How consent is recorded',
      'How to withdraw consent', 'Third parties'],
  },
  legal: {
    title: 'Legal',
    lead: 'Terms of use, company information and regulatory detail.',
    sections: ['Company information', 'Terms of use', 'Limitation of liability',
      'Intellectual property', 'Governing law'],
  },
  accessibility: {
    title: 'Accessibility statement',
    lead: 'What this site commits to, how it was tested, and what is outstanding.',
    sections: ['Conformance target', 'How this site was tested',
      'Known issues', 'How to report a problem', 'Enforcement'],
  },
  'diversity-policy': {
    title: 'Diversity policy',
    lead: 'How Adan Corporate approaches hiring, partnership and engagement staffing.',
    sections: ['Commitment', 'Hiring practice', 'Partnership admission', 'Reporting'],
  },
} as const;

type Doc = keyof typeof DOCS;

export function generateStaticParams() {
  return (Object.keys(DOCS) as Doc[]).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  const d = DOCS[doc as Doc];
  if (!d) return {};
  return { title: `${d.title} | Adan Corporate`, description: d.lead,
           alternates: { canonical: `/en-uk/legal/${doc}` }, robots: { index: true, follow: true } };
}

export default async function LegalDoc({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const key = doc as Doc;
  const d = DOCS[key];
  if (!d) notFound();
  return (
    <>
      <PageIntro title={d.title} lead={d.lead} eyebrow="Legal"
                 eyebrowHref="/en-uk/legal/legal" eyebrowLabel="← Legal" />
      <Section>
        <Prose>
          <p><strong>Last reviewed: <TK>TKTK</TK>.</strong> This document is drafted against UK GDPR and reviewed by counsel before publication. The previous version on this site was dated 17 October 2019, predating the UK regime, and is not carried forward.</p>
        </Prose>
        <div style={{ marginTop: 'var(--s-7)' }}>
          {d.sections.map((s) => (
            <DefinitionRow key={s} term={s} level={2}>
              <TK>TKTK</TK> — drafted and reviewed by counsel before this page is published.
            </DefinitionRow>
          ))}
        </div>
      </Section>
    </>
  );
}
