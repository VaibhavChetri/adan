'use client';

import { useState, FormEvent } from 'react';
import { PRACTICES } from '@/app/lib/content';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function EnquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const [valid, setValid] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get('name') || '').trim()) next.name = 'Please tell us your name.';
    const email = String(data.get('email') || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Please enter an email address we can reply to.';
    }
    if (!String(data.get('message') || '').trim()) {
      next.message = 'Please tell us briefly what you are considering.';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      setValid(false);
      setStatus('Please correct the highlighted fields.');
      const first = document.querySelector<HTMLElement>('.field.is-invalid input, .field.is-invalid textarea');
      first?.focus();
      return;
    }
    // There is no endpoint yet (TKTK: a form handler, or a monitored inbox to
    // address a mailto at). The previous message said the enquiry "has been
    // recorded and a partner will reply directly", which was false: nothing
    // left the browser. Someone mid-transaction could have waited on a reply
    // that was never coming. Until a destination is confirmed this says only
    // what is true and points at the routes that do work, which sit in the
    // aside beside this form.
    setValid(true);
    setStatus('This form is not connected to an inbox yet, so nothing has been sent. '
            + 'Please use one of the direct routes listed alongside \u2014 a partner\u2019s '
            + 'own address, or the telephone number for the nearest office.');
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <div className={`field${errors.name ? ' is-invalid' : ''}`}>
          <label htmlFor="f-name">Your name</label>
          <input id="f-name" name="name" type="text" autoComplete="name"
                 aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
          {errors.name && <p className="error" id="e-name">{errors.name}</p>}
        </div>

        <div className={`field${errors.email ? ' is-invalid' : ''}`}>
          <label htmlFor="f-email">Email <span className="hint">We reply here.</span></label>
          <input id="f-email" name="email" type="email" autoComplete="email"
                 aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
          {errors.email && <p className="error" id="e-email">{errors.email}</p>}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="f-org">Organisation <span className="hint">Optional.</span></label>
          <input id="f-org" name="organisation" type="text" autoComplete="organization" />
        </div>

        {/* Options come from PRACTICES, so the routing choices can never drift
            out of step with the practices the site actually lists. */}
        <div className="field">
          <label htmlFor="f-topic">What is this about? <span className="hint">Optional.</span></label>
          <select id="f-topic" name="topic" defaultValue="">
            <option value="">Not sure yet</option>
            {PRACTICES.map((p) => <option key={p.slug} value={p.name}>{p.name}</option>)}
            <option value="Careers">Joining the firm</option>
            <option value="Other">Something else</option>
          </select>
        </div>
      </div>

      <div className={`field${errors.message ? ' is-invalid' : ''}`}>
        <label htmlFor="f-msg">What are you considering? <span className="hint">A sentence or two is enough.</span></label>
        <textarea id="f-msg" name="message"
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-msg' : undefined} />
        {errors.message && <p className="error" id="e-msg">{errors.message}</p>}
      </div>

      <button className="btn btn--primary" type="submit">Send enquiry</button>
      <p className={`form__status${valid ? ' form__status--warn' : ''}`}
         role="status" aria-live="polite">{status}</p>
    </form>
  );
}
