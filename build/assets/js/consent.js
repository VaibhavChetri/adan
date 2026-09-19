/* Opt-in consent. No non-essential script loads until an explicit Accept.
   Reject is as easy as accept. Choice is stored and re-openable. */
(function () {
  'use strict';
  var KEY = 'adan.consent.v1';
  var banner = document.getElementById('consent');
  var reopen = document.getElementById('consent-reopen');

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // Analytics are loaded ONLY from here, and only after an explicit accept.
  function loadAnalytics() {
    if (window.__adanAnalyticsLoaded) return;
    window.__adanAnalyticsLoaded = true;
    // TKTK: measurement ID to be confirmed before launch.
    // var s=document.createElement('script');
    // s.async=true; s.src='https://www.googletagmanager.com/gtag/js?id=TKTK';
    // document.head.appendChild(s);
  }

  function decide(value) {
    write(value);
    if (banner) { banner.hidden = true; }
    if (reopen) { reopen.hidden = false; }
    if (value === 'accepted') loadAnalytics();
  }

  var stored = read();
  if (stored === 'accepted') { loadAnalytics(); if (reopen) reopen.hidden = false; }
  else if (stored === 'rejected') { if (reopen) reopen.hidden = false; }
  else if (banner) { banner.hidden = false; }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-consent]');
    if (!el) return;
    e.preventDefault();
    var action = el.getAttribute('data-consent');
    if (action === 'reopen') { if (banner) banner.hidden = false; return; }
    decide(action === 'accept' ? 'accepted' : 'rejected');
  });
})();
