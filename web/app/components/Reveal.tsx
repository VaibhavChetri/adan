'use client';

import { useEffect } from 'react';

/** Adds a scroll entrance to anything carrying .reveal.
 *
 *  Content is visible by default in CSS; this only marks elements "pending"
 *  once JS is confirmed running, then flips them to "in" as they enter view.
 *  Done the other way round, a headless renderer, a paused tab or a JS failure
 *  would ship every section blank.
 *
 *  Also flags the header once the page has scrolled, so its shadow only appears
 *  when there is something underneath it. */
export default function Reveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('.header');

    const onScroll = () => header?.setAttribute('data-stuck', String(window.scrollY > 8));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      const els = [...document.querySelectorAll<HTMLElement>('.reveal')];
      els.forEach((el, i) => {
        el.dataset.reveal = 'pending';
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 60}ms`;
      });
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.reveal = 'in';
          io!.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -12% 0px' });
      els.forEach((el) => io!.observe(el));
    }

    return () => { window.removeEventListener('scroll', onScroll); io?.disconnect(); };
  }, []);

  return null;
}
