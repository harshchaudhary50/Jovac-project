import PDFDocument from "pdfkit";

// Clean text for PDF: strip emojis, asterisks, and backticks cleanly
function sanitizeText(text) {
  if (!text) return "";
  return String(text)
    // Remove markdown bold/italic asterisks & backticks cleanly
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    // Remove all emojis cleanly without leaving strange symbols
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{200D}]/gu, "")
    .replace(/[^\x00-\x7F\u00A0-\u00FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Draw a clean, compact table in PDFKit with auto word-wrapping & borders
 */
function drawPdfTable(doc, tableLines, startX, printableWidth) {
  if (!tableLines || tableLines.length < 2) return;

  const parsedRows = [];
  for (const line of tableLines) {
    const rawCells = line
      .split("|")
      .map(c => sanitizeText(c));
    if (rawCells.length > 0 && rawCells[0] === "") rawCells.shift();
    if (rawCells.length > 0 && rawCells[rawCells.length - 1] === "") rawCells.pop();

    const isSeparator = rawCells.every(c => /^:?-+:?$/.test(c.replace(/\s+/g, "")));
    if (!isSeparator && rawCells.length > 0) {
      parsedRows.push(rawCells);
    }
  }

  if (parsedRows.length === 0) return;

  const numCols = Math.max(...parsedRows.map(r => r.length));
  if (numCols === 0) return;

  const colWidth = printableWidth / numCols;
  const headerBg = "#F3F4F6";
  const zebraBg = "#FAFAFA";
  const whiteBg = "#FFFFFF";
  const borderColor = "#E5E7EB";

  doc.moveDown(0.3);

  parsedRows.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;

    let maxCellHeight = 18;
    doc.fontSize(isHeader ? 9 : 8.5).font(isHeader ? "Helvetica-Bold" : "Helvetica");

    row.forEach((cellText) => {
      const textH = doc.heightOfString(cellText || "-", {
        width: colWidth - 10,
        align: "left"
      });
      if (textH + 8 > maxCellHeight) {
        maxCellHeight = textH + 8;
      }
    });

    if (doc.y + maxCellHeight > 750) {
      doc.addPage();
      doc.x = startX;
    }

    const currentY = doc.y;

    for (let c = 0; c < numCols; c++) {
      const cellX = startX + c * colWidth;
      const cellVal = row[c] || "-";

      const fillBg = isHeader ? headerBg : rowIndex % 2 === 1 ? zebraBg : whiteBg;
      doc.rect(cellX, currentY, colWidth, maxCellHeight).fillAndStroke(fillBg, borderColor);

      doc.fillColor(isHeader ? "#111827" : "#374151");
      doc.fontSize(isHeader ? 9 : 8.5).font(isHeader ? "Helvetica-Bold" : "Helvetica");
      doc.text(cellVal, cellX + 5, currentY + 4, {
        width: colWidth - 10,
        align: "left"
      });
    }

    doc.y = currentY + maxCellHeight;
  });

  doc.x = startX;
  doc.moveDown(0.4);
  doc.fillColor("#111827");
}

export const pdfDownload = async (req, res) => {
  try {
    const { result } = req.body;
    if (!result) {
      return res.status(400).json({ error: "No content provided" });
    }

    const startX = 45;
    const printableWidth = 505.28; // A4 (595.28) - 2 * 45

    const doc = new PDFDocument({
      size: "A4",
      margin: 45,
      bufferPages: true,
      autoFirstPage: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="NoteX_ExamNotes.pdf"');

    doc.pipe(res);

    // -------------------------------------------------------------
    // 1. CLEAN MINIMAL HEADER
    // -------------------------------------------------------------
    const topicHeading = sanitizeText(result.topic || "Exam Preparation Notes");
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    doc.x = startX;
    doc.fillColor("#111827").fontSize(17).font("Helvetica-Bold").text(topicHeading, {
      width: printableWidth,
      align: "left"
    });

    doc.moveDown(0.2);
    doc.x = startX;
    doc.fillColor("#6B7280").fontSize(9).font("Helvetica").text(`NoteX Study Notes   •   ${dateStr}`, {
      width: printableWidth,
      align: "left"
    });

    doc.moveDown(0.4);
    doc.moveTo(startX, doc.y).lineTo(startX + printableWidth, doc.y).strokeColor("#E5E7EB").lineWidth(1).stroke();
    doc.moveDown(0.5);

    // -------------------------------------------------------------
    // 2. DETAILED NOTES / MARKDOWN CONTENT
    // -------------------------------------------------------------
    if (result.notes) {
      const rawNotes = String(result.notes)
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "  ")
        .replace(/\\"/g, '"');

      const lines = rawNotes.split("\n");
      let tableBuffer = [];
      let inTable = false;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Detect Markdown Table
        if (line.startsWith("|") && line.endsWith("|")) {
          inTable = true;
          const subRows = line.split(/\|\s*\|\s*/).filter(Boolean);
          subRows.forEach(sr => {
            const formatted = sr.startsWith("|") ? sr : `| ${sr}`;
            const finalRow = formatted.endsWith("|") ? formatted : `${formatted} |`;
            tableBuffer.push(finalRow);
          });
          continue;
        } else {
          if (inTable && tableBuffer.length > 0) {
            drawPdfTable(doc, tableBuffer, startX, printableWidth);
            tableBuffer = [];
            inTable = false;
          }
        }

        if (!line) {
          doc.moveDown(0.15);
          continue;
        }

        // Prevent heading orphan near bottom
        const isHeading = line.startsWith("#");
        if (isHeading && doc.y > 700) {
          doc.addPage();
          doc.x = startX;
        }

        const cleanLine = sanitizeText(line);

        // Always lock doc.x to startX to prevent right margin leaks
        doc.x = startX;

        // H1 Heading (# Heading)
        if (line.startsWith("# ")) {
          doc.moveDown(0.4);
          doc.fillColor("#111827").fontSize(14).font("Helvetica-Bold").text(cleanLine.replace(/^#\s*/, ""), {
            width: printableWidth,
            align: "left"
          });
          doc.moveDown(0.2);
        }
        // H2 Heading (## Heading)
        else if (line.startsWith("## ")) {
          doc.moveDown(0.35);
          doc.fillColor("#1F2937").fontSize(12).font("Helvetica-Bold").text(cleanLine.replace(/^##\s*/, ""), {
            width: printableWidth,
            align: "left"
          });
          doc.moveDown(0.2);
        }
        // H3 Heading (### Heading)
        else if (line.startsWith("### ")) {
          doc.moveDown(0.3);
          doc.fillColor("#374151").fontSize(10.5).font("Helvetica-Bold").text(cleanLine.replace(/^###\s*/, ""), {
            width: printableWidth,
            align: "left"
          });
          doc.moveDown(0.15);
        }
        // Sub-bullet item
        else if (/^(\s{2,}|\t)[-*•]\s+/.test(lines[i]) || /^\s*-\s+/.test(lines[i]) && lines[i].startsWith(" ")) {
          const itemText = cleanLine.replace(/^[-*•]\s+/, "");
          doc.fillColor("#4B5563").fontSize(9).font("Helvetica");
          doc.text(`      -  ${itemText}`, {
            width: printableWidth,
            align: "left",
            lineGap: 2
          });
          doc.moveDown(0.1);
        }
        // Top-level Bullet List Item
        else if (/^[-*•]\s+/.test(line)) {
          const itemText = cleanLine.replace(/^[-*•]\s+/, "");
          doc.fillColor("#374151").fontSize(9.5).font("Helvetica");
          doc.text(`   •  ${itemText}`, {
            width: printableWidth,
            align: "left",
            lineGap: 2
          });
          doc.moveDown(0.1);
        }
        // Numbered List Item
        else if (/^\d+\.\s+/.test(line)) {
          doc.fillColor("#374151").fontSize(9.5).font("Helvetica");
          doc.text(`   ${cleanLine}`, {
            width: printableWidth,
            align: "left",
            lineGap: 2
          });
          doc.moveDown(0.1);
        }
        // Standard Paragraph
        else {
          doc.fillColor("#374151").fontSize(9.5).font("Helvetica");
          doc.text(cleanLine, {
            width: printableWidth,
            align: "left",
            lineGap: 2.5
          });
          doc.moveDown(0.15);
        }
      }

      if (inTable && tableBuffer.length > 0) {
        drawPdfTable(doc, tableBuffer, startX, printableWidth);
        tableBuffer = [];
      }

      doc.x = startX;
      doc.moveDown(0.4);
    }

    // -------------------------------------------------------------
    // 3. IMPORTANT EXAM QUESTIONS (CLEAN FORMAT)
    // -------------------------------------------------------------
    if (result.questions && (result.questions.short?.length > 0 || result.questions.long?.length > 0)) {
      if (doc.y > 690) {
        doc.addPage();
        doc.x = startX;
      }

      doc.x = startX;
      doc.moveDown(0.3);
      doc.fillColor("#111827").fontSize(12).font("Helvetica-Bold").text("Important Exam Questions", {
        width: printableWidth,
        align: "left"
      });
      doc.moveDown(0.2);

      if (Array.isArray(result.questions.short) && result.questions.short.length > 0) {
        doc.x = startX;
        doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold").text("Short Answer Questions:", {
          width: printableWidth,
          align: "left"
        });
        doc.moveDown(0.15);
        result.questions.short.forEach((q, i) => {
          doc.x = startX;
          doc.fillColor("#4B5563").fontSize(9).font("Helvetica").text(`   Q${i + 1}. ${sanitizeText(q)}`, {
            width: printableWidth,
            align: "left",
            lineGap: 2
          });
          doc.moveDown(0.1);
        });
        doc.moveDown(0.2);
      }

      if (Array.isArray(result.questions.long) && result.questions.long.length > 0) {
        doc.x = startX;
        doc.fillColor("#374151").fontSize(10).font("Helvetica-Bold").text("Long Answer Questions:", {
          width: printableWidth,
          align: "left"
        });
        doc.moveDown(0.15);
        result.questions.long.forEach((q, i) => {
          doc.x = startX;
          doc.fillColor("#4B5563").fontSize(9).font("Helvetica").text(`   Q${i + 1}. ${sanitizeText(q)}`, {
            width: printableWidth,
            align: "left",
            lineGap: 2
          });
          doc.moveDown(0.1);
        });
      }
    }

    // -------------------------------------------------------------
    // 4. CLEAN FOOTER (Page Numbers)
    // -------------------------------------------------------------
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      doc.moveTo(startX, 805).lineTo(startX + printableWidth, 805).strokeColor("#E5E7EB").lineWidth(0.5).stroke();

      doc.fillColor("#9CA3AF").fontSize(8).font("Helvetica");
      doc.text("NoteX Study Notes", startX, 810, { align: "left" });
      doc.text(`Page ${i + 1} of ${range.count}`, startX, 810, {
        width: printableWidth,
        align: "right"
      });
    }

    doc.end();

  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF document", details: error.message });
    }
  }
};