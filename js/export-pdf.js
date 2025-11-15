/**
 * PDF Export Utility - Vanilla JS
 * Exports roadmap/content to PDF using browser print
 */

function exportToPDF(elementSelector, title = 'Roadmap') {
  const element = document.querySelector(elementSelector);
  if (!element) {
    alert('Content not found to export');
    return;
  }
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  const printContent = element.cloneNode(true);
  
  // Remove interactive elements
  const buttons = printContent.querySelectorAll('button, .no-print');
  buttons.forEach(btn => btn.remove());
  
  // Create HTML for print
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          h1, h2, h3 {
            color: #1e40af;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
          .bg-gradient-to-r, .bg-blue-600, .bg-gray-800 {
            background: #f3f4f6 !important;
            color: #111 !important;
          }
          .text-white {
            color: #111 !important;
          }
          .border {
            border: 1px solid #ddd;
          }
          .rounded-lg {
            border-radius: 0.5rem;
          }
          .p-6 {
            padding: 1.5rem;
          }
          .mb-4 {
            margin-bottom: 1rem;
          }
          ul {
            list-style-type: disc;
            margin-left: 2rem;
          }
          li {
            margin-bottom: 0.5rem;
          }
          .task-item {
            padding: 0.5rem;
            margin-bottom: 0.25rem;
          }
          .completed {
            text-decoration: line-through;
            opacity: 0.7;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${printContent.innerHTML}
      <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.875rem; color: #666;">
        <p>Generated from EduRise - ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// Make available globally
if (typeof window !== 'undefined') {
  window.exportToPDF = exportToPDF;
}

