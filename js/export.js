// export.js — small helper to export an element as printable PDF via window.print
export function exportElementToPDF(elSelector, title = 'Roadmap') {
  const el = document.querySelector(elSelector);
  if (!el) {
    alert('Nothing to export');
    return;
  }

  const w = window.open('', '_blank');
  const style = `
    <style>
      body{font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px}
      h1,h2,h3{color:#0f172a}
      .section{margin-bottom:16px}
    </style>
  `;
  w.document.write(`<html><head><title>${title}</title>${style}</head><body>`);
  w.document.write(`<h1>${title}</h1>`);
  w.document.write(el.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  // Give the new window a moment to render
  setTimeout(() => { w.print(); }, 300);
}
