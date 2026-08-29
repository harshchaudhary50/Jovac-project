import html2pdf from 'html2pdf.js';

// Clean sanitization for raw text
function sanitize(text) {
  if (!text) return "";
  return String(text)
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .trim();
}

/**
 * Convert Markdown string to clean, professional, print-ready HTML
 */
function markdownToHtml(md) {
  if (!md) return "";
  let text = String(md)
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "  ")
    .replace(/\\"/g, '"');

  // Fix concatenated table rows (| ... | | ... |)
  text = text.replace(/\|\s*\|\s*/g, "|\n|");

  const lines = text.split("\n");
  let html = "";
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length === 0) return "";
    let tableHtml = `<div style="margin: 16px 0; overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #E5E7EB; border-radius: 6px;">`;
    
    let isHeaderRow = true;
    for (const rowLine of tableRows) {
      const cells = rowLine.split("|").map(c => c.trim()).filter(Boolean);
      const isSep = cells.every(c => /^:?-+:?$/.test(c));
      if (isSep) {
        isHeaderRow = false;
        continue;
      }
      if (cells.length > 0) {
        tableHtml += `<tr style="${isHeaderRow ? 'background-color: #F3F4F6; font-weight: 700; color: #111827;' : 'border-top: 1px solid #E5E7EB; background-color: #FFFFFF; color: #374151;'}">`;
        cells.forEach(cell => {
          const cleanCell = cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          tableHtml += `<td style="padding: 8px 10px; border: 1px solid #E5E7EB; text-align: left; vertical-align: top;">${cleanCell}</td>`;
        });
        tableHtml += `</tr>`;
        isHeaderRow = false;
      }
    }
    tableHtml += `</table></div>`;
    tableRows = [];
    return tableHtml;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else {
      if (inTable) {
        html += flushTable();
        inTable = false;
      }
    }

    if (!line) continue;

    // H1 Heading
    if (line.startsWith("# ")) {
      const title = line.replace(/^#\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1");
      html += `<h2 style="font-size: 16px; font-weight: 800; color: #111827; margin: 18px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #E5E7EB;">${title}</h2>`;
    }
    // H2 Heading
    else if (line.startsWith("## ")) {
      const title = line.replace(/^##\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1");
      html += `<h3 style="font-size: 13.5px; font-weight: 700; color: #1F2937; margin: 14px 0 6px 0;">${title}</h3>`;
    }
    // H3 Heading
    else if (line.startsWith("### ")) {
      const title = line.replace(/^###\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1");
      html += `<h4 style="font-size: 12px; font-weight: 700; color: #374151; margin: 10px 0 4px 0;">${title}</h4>`;
    }
    // Bullet Point
    else if (/^[-*•]\s+/.test(line)) {
      const content = line.replace(/^[-*•]\s+/, "")
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827;">$1</strong>');
      html += `<div style="margin: 3px 0 3px 12px; font-size: 11px; line-height: 1.5; color: #374151;">• &nbsp; ${content}</div>`;
    }
    // Numbered Item
    else if (/^\d+\.\s+/.test(line)) {
      const content = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827;">$1</strong>');
      html += `<div style="margin: 3px 0 3px 12px; font-size: 11px; line-height: 1.5; color: #374151;">${content}</div>`;
    }
    // Standard Paragraph
    else {
      const content = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827;">$1</strong>');
      html += `<p style="font-size: 11px; line-height: 1.55; color: #374151; margin: 6px 0;">${content}</p>`;
    }
  }

  if (inTable) {
    html += flushTable();
  }

  return html;
}

/**
 * High-performance, pixel-perfect PDF export using html2pdf
 * Eliminates blank pages, truncations, and broken fonts permanently.
 */
export async function exportNotesToPdf(result) {
  if (!result) return;

  const topic = result.topic || "Exam Preparation Notes";
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Build the complete printable DOM structure
  const container = document.createElement('div');
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
    background-color: #FFFFFF;
    padding: 24px 30px;
    width: 750px;
    box-sizing: border-box;
  `;

  // 1. Header
  let contentHtml = `
    <div style="border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; margin-bottom: 16px;">
      <h1 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 4px 0;">${topic}</h1>
      <p style="font-size: 10.5px; color: #6B7280; margin: 0;">NoteX Study Notes &bull; ${dateStr}</p>
    </div>
  `;

  // 2. Notes Content
  if (result.notes) {
    contentHtml += markdownToHtml(result.notes);
  }

  // 3. Predicted Exam Questions
  if (result.questions && (result.questions.short?.length > 0 || result.questions.long?.length > 0)) {
    contentHtml += `
      <div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #E5E7EB;">
        <h2 style="font-size: 15px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">Important Exam Questions</h2>
    `;

    if (Array.isArray(result.questions.short) && result.questions.short.length > 0) {
      contentHtml += `<h3 style="font-size: 12.5px; font-weight: 700; color: #1F2937; margin: 10px 0 6px 0;">Short Answer Questions:</h3>`;
      result.questions.short.forEach((q, i) => {
        contentHtml += `<div style="font-size: 11px; color: #374151; margin: 4px 0 4px 8px; line-height: 1.45;"><strong>Q${i + 1}.</strong> ${sanitize(q)}</div>`;
      });
    }

    if (Array.isArray(result.questions.long) && result.questions.long.length > 0) {
      contentHtml += `<h3 style="font-size: 12.5px; font-weight: 700; color: #1F2937; margin: 12px 0 6px 0;">Long Answer Questions:</h3>`;
      result.questions.long.forEach((q, i) => {
        contentHtml += `<div style="font-size: 11px; color: #374151; margin: 4px 0 4px 8px; line-height: 1.45;"><strong>Q${i + 1}.</strong> ${sanitize(q)}</div>`;
      });
    }

    contentHtml += `</div>`;
  }

  container.innerHTML = contentHtml;
  document.body.appendChild(container);

  const cleanFilename = (topic.replace(/[^a-zA-Z0-9_-]/g, "_") || "NoteX_Notes") + ".pdf";

  const opt = {
    margin: [10, 10, 10, 10],
    filename: cleanFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
