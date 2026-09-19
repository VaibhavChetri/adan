'use client';

import { useEffect, useState } from 'react';

const KEY = 'adan.consent.v1';

/**
 * Opt-in consent. No non-essential script loads until an explicit Accept,
 * and Reject is exactly as easy as Accept.
 */
export default function Consent() {
  const [choice, setChoice] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* blocked storage */ }
    setChoice(stored);
    if (stored === 'accepted') loadAnalytics();
  }, []);

  function loadAnalytics() {
    // TKTK: measurement ID to be confirmed before launch. Nothing loads until
    // this is filled in AND the visitor has accepted.
  }

  function decide(value: 'accepted' | 'rejected') {
    try { localStorage.setItem(KEY, value); } catch { /* blocked storage */ }
    setChoice(value);
    if (value === 'accepted') loadAnalytics();
  }

  // undefined = not yet read from storage; render nothing to avoid a hydration flash
  const showBanner = choice === null;

  return (
    <>
      <aside className="consent" role="region" aria-label="Cookie choices" hidden={!showBanner}>
        <div className="container consent__inner">
          <p className="consent__text">
            <strong>We would like to measure how this site is used.</strong> No
            measurement or marketing cookie is set unless you accept. Essential
            cookies keep the site working.
          </p>
          <div className="consent__actions">
            <button className="btn btn--primary" type="button" onClick={() => decide('accepted')}>Accept</button>
            <button className="btn btn--reject" type="button" onClick={() => decide('rejected')}>Reject</button>
          </div>
        </div>
      </aside>
    </>
  );
}
