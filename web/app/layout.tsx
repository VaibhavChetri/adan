import type { Metadata } from 'next';
import Image from 'next/image';
import { Newsreader, Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Consent from './components/Consent';
import ConsentReopen from './components/ConsentReopen';
import Reveal from './components/Reveal';
import { PRACTICES, ADVANTAGE_LINE, OFFICES, OFFICE_COUNT, FIRM_NAV } from './lib/content';
import badge from '@/public/logo-round.png';

// The pairing McKinsey uses is a high-contrast editorial serif for names and
// headings against a neutral grotesque for everything else. Their own two faces
// cannot be licensed - McKinsey Sans was commissioned for them exclusively and
// their serif is licensed to them - so these are the closest faces that can
// actually ship. The structure is what carries the look, not the drawing.
//
// Newsreader over Source Serif 4: Source Serif is a sturdy workhorse with low
// stroke contrast, which reads solid rather than editorial at display size.
// Newsreader has the fine hairlines and sharp bracketed serifs that make a
// large name look set rather than enlarged. Variable on `opsz`, so the drawing
// tightens as size grows instead of being scaled up.
const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  axes: ['opsz'],
});

// Inter over IBM Plex Sans: Plex is a humanist sans with signature details -
// flared stems, a tailed 'a', a distinctive 'g' - that make it recognisably
// IBM's. McKinsey Sans is deliberately neutral, and neutrality is the point:
// the type should not have a voice of its own next to the serif. Inter is the
// closest neutral grotesque that is free to use.
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://adancorporate.com'),
  title: 'Corporate finance, M&A and risk advisory for mid-market firms | Adan Corporate',
  description:
    'Adan Corporate advises owners and boards of mid-market firms on raising capital, buying and selling businesses, managing risk and expanding across borders. Partners are former C-suite operators.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Adan Corporate',
    description:
      'Corporate finance, M&A and risk advisory for mid-market firms trading across borders.',
    url: '/',
    siteName: 'Adan Corporate',
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="footer__cta">
            <div className="container footer__cta-inner">
              <p className="footer__cta-text">
                Considering a raise, a transaction or a restructuring?
                <span> A partner replies directly &mdash; this is not routed to a mailbox.</span>
              </p>
              <div className="footer__cta-actions">
                <a className="btn btn--primary" href="/en-uk/contact">Start a conversation</a>
                <a className="btn btn--secondary" href="/en-uk/about-us/team">Meet the team</a>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="footer__grid">
              <div className="footer__brand">
                <a className="footer__mark" href="/" aria-label="Adan Corporate, home">
                  <Image src={badge} alt="" width={256} height={256} sizes="56px" />
                  <span className="footer__name">Adan Corporate</span>
                </a>
                <p className="footer__line">{ADVANTAGE_LINE}</p>
                <address className="footer__address">
                  <span className="footer__addr-label">Registered office</span>
                  27 Old Gloucester Street<br />London WC1N 3AX<br />United Kingdom
                  <a className="footer__tel" href="tel:+447917120849">+44 7917 120849</a>
                </address>
              </div>

              <nav className="footer__col" aria-labelledby="f-practices">
                <h2 className="footer__head" id="f-practices">Services</h2>
                <ul className="footer__list">
                  {PRACTICES.map((p) => (
                    <li key={p.slug}><a href={`/en-uk/${p.slug}`}>{p.name}</a></li>
                  ))}
                  <li><a href="/en-uk/ai">AI &amp; Automation</a></li>
                </ul>
              </nav>

              <nav className="footer__col" aria-labelledby="f-firm">
                <h2 className="footer__head" id="f-firm">Firm</h2>
                <ul className="footer__list">
                  {FIRM_NAV.map((f) => (
                    <li key={f.href}><a href={f.href}>{f.label}</a></li>
                  ))}
                </ul>
              </nav>

              <nav className="footer__col" aria-labelledby="f-legal">
                <h2 className="footer__head" id="f-legal">Legal</h2>
                <ul className="footer__list">
                  <li><a href="/en-uk/legal/legal">Legal and terms</a></li>
                  <li><a href="/en-uk/legal/privacy-policy">Privacy policy</a></li>
                  <li><a href="/en-uk/legal/cookie-policy">Cookie policy</a></li>
                  <li><a href="/en-uk/legal/diversity-policy">Diversity policy</a></li>
                  <li><a href="/en-uk/legal/accessibility">Accessibility</a></li>
                  <li><ConsentReopen /></li>
                </ul>
              </nav>
            </div>

            <div className="footer__offices">
              <h2 className="footer__head footer__head--inline" id="f-offices">
                {OFFICE_COUNT} offices
              </h2>
              <ul className="footer__cities" aria-labelledby="f-offices">
                {OFFICES.map((o) => <li key={o.city}>{o.city}</li>)}
              </ul>
            </div>

            <div className="footer__base">
              <p className="footer__legal">
                &copy; {new Date().getFullYear()} Adan Corporate. Registered in the United Kingdom.
              </p>
              <ul className="footer__social">
                <li>
                  <a href="https://www.linkedin.com/company/11209203" rel="noopener noreferrer"
                     target="_blank" aria-label="Adan Corporate on LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 23 10.9 23 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21h-4V9Z"/></svg>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/AdanCorpFinance" rel="noopener noreferrer"
                     target="_blank" aria-label="Adan Corporate on X">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.53 3h3.17l-6.93 7.92L22 21h-6.37l-4.99-6.52L4.93 21H1.76l7.41-8.47L2 3h6.53l4.51 5.96L17.53 3Zm-1.11 16.07h1.75L7.66 4.83H5.78l10.64 14.24Z"/></svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/AdanCorpFinance" rel="noopener noreferrer"
                     target="_blank" aria-label="Adan Corporate on Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        <Reveal />
        <Consent />
      </body>
    </html>
  );
}
