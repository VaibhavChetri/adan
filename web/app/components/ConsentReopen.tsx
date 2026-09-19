'use client';

/** Lives in the footer, not floating over the page. A fixed control in the
 *  bottom-left corner overlapped body copy on every interior template. */
export default function ConsentReopen() {
  return (
    <button
      type="button"
      className="footer__linkbutton"
      onClick={() => {
        try { localStorage.removeItem('adan.consent.v1'); } catch { /* blocked storage */ }
        location.reload();
      }}
    >
      Cookie choices
    </button>
  );
}
