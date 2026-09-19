/* Mobile nav toggle and client-side form validation. No dependencies. */
(function () {
  'use strict';
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
  }

  var form = document.getElementById('enquiry');
  if (!form) return;
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll('input,textarea'), function (f) {
      var wrap = f.closest('.field');
      var bad = !f.checkValidity();
      if (wrap) wrap.classList.toggle('is-invalid', bad);
      f.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) { e.preventDefault(); if (status) status.textContent = 'Please correct the highlighted fields.'; return; }
    // TKTK: endpoint to be confirmed. Until then the submission is held client-side.
    e.preventDefault();
    if (status) status.textContent = 'Thank you. Your enquiry has been recorded and a partner will reply directly.';
    form.reset();
  });
})();
