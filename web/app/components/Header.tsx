'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import logo from '@/public/logo.webp';
import { NAV, FIRM_NAV } from '@/app/lib/content';

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  // A practice is current for its hub and for every service beneath it.
  const isCurrent = (href: string) => path === href || path.startsWith(href + '/');

  const items = (list: typeof NAV, onClick?: () => void) =>
    list.map((s) => (
      <li className="nav__item" key={s.href}>
        <a href={s.href} onClick={onClick}
           aria-current={isCurrent(s.href) ? 'page' : undefined}>
          {s.label}
        </a>
      </li>
    ));

  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="/" aria-label="Adan Corporate, home">
          <Image src={logo} alt="Adan Corporate" priority unoptimized className="brand__logo" />
        </a>
        <nav className="nav" aria-label="Primary">
          <ul className="nav__list">{items(NAV)}</ul>
        </nav>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      {/* Carries the firm routes as well as the practices. On a laptop those
          four live in the footer and the footer is one flick away; on a phone
          it is thousands of pixels down, so without them here the menu was the
          only navigation on screen and it could not reach Team, Insights,
          Careers or Contact at all. */}
      <nav className="nav--mobile" id="nav-mobile" aria-label="Primary, mobile" hidden={!open}>
        <div className="container">
          <ul className="nav__list">{items(NAV, () => setOpen(false))}</ul>
          <p className="nav__grouphead">Firm</p>
          <ul className="nav__list">{items(FIRM_NAV, () => setOpen(false))}</ul>
        </div>
      </nav>
    </header>
  );
}
