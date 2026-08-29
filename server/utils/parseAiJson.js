import { jsonrepair } from 'jsonrepair';

/**
 * Standardize and guarantee complete schema matching FinalResult and Sidebar components
 */
function standardizeNoteResult(parsed, defaultTopic, rawText) {
  const result = typeof parsed === "object" && parsed !== null ? parsed : {};

  // Standardize notes markdown
  const notes = result.notes || result.fullContent || result.content || rawText || `# ${defaultTopic}\n\nComprehensive exam notes generated.`;

  // Standardize subTopics
  let subTopics = result.subTopics;
  if (!subTopics || typeof subTopics !== "object" || Object.keys(subTopics).length === 0) {
    subTopics = {
      "⭐": ["Foundational Theory", "Overview & History"],
      "⭐⭐": ["Working Mechanisms", "Core Architectures"],
      "⭐⭐⭐": [defaultTopic, "High-Yield Formulas & Exam Problems"]
    };
  }

  // Standardize importance
  const importance = result.importance || "⭐⭐⭐";

  // Standardize revisionPoints
  let revisionPoints = Array.isArray(result.revisionPoints) ? result.revisionPoints : (Array.isArray(result.revisionSheet) ? result.revisionSheet.map(r => typeof r === 'object' ? `${r.key}: ${r.val}` : String(r)) : []);
  if (revisionPoints.length === 0) {
    revisionPoints = [
      `Key definition and working principle of ${defaultTopic}.`,
      "Critical exam formulas and complexity boundaries.",
      "High-probability exam problem solving patterns.",
      "Primary advantages and trade-offs in practical applications."
    ];
  }

  // Standardize questions
  let questions = result.questions;
  if (!questions || typeof questions !== "object") {
    questions = {
      short: [
        `Define ${defaultTopic} and state its primary significance.`,
        "List key characteristics and boundary conditions."
      ],
      long: [
        `Explain the comprehensive architecture and working mechanism of ${defaultTopic} with suitable diagrams and examples.`
      ],
      diagram: `Draw and explain the structured flowchart/architecture of ${defaultTopic}.`
    };
  } else {
    if (!Array.isArray(questions.short)) questions.short = [`Explain core concept of ${defaultTopic}.`];
    if (!Array.isArray(questions.long)) questions.long = [`Provide detailed architectural analysis of ${defaultTopic}.`];
  }

  // Standardize diagram
  const diagram = result.diagram && typeof result.diagram === "object" ? result.diagram : { type: "", data: "" };

  // Standardize charts
  const charts = Array.isArray(result.charts) ? result.charts : [];

  return {
    subTopics,
    importance,
    notes,
    revisionPoints,
    questions,
    diagram,
    charts,
    topic: result.topic || defaultTopic
  };
}

/**
 * Robust, fault-tolerant AI JSON parser.
 * Handles markdown fences, unescaped quotes/newlines, and guarantees a 100% valid note schema.
 */
export function parseAiJson(rawText, defaultTopic = "Exam Notes") {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid AI response text");
  }

  // 1. Strip markdown code fences
  let clean = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // 2. Direct JSON.parse attempt
  try {
    const parsed = JSON.parse(clean);
    if (parsed && typeof parsed === "object") {
      return standardizeNoteResult(parsed, defaultTopic, clean);
    }
  } catch (err1) {
    // Proceed to repair
  }

  // 3. Use jsonrepair on full string
  try {
    const repaired = jsonrepair(clean);
    const parsed = JSON.parse(repaired);
    if (parsed && typeof parsed === "object") {
      return standardizeNoteResult(parsed, defaultTopic, clean);
    }
  } catch (err2) {
    // Proceed to substring extraction
  }

  // 4. Extract { ... } substring and repair
  try {
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const substring = clean.slice(firstBrace, lastBrace + 1);
      const repairedSub = jsonrepair(substring);
      const parsed = JSON.parse(repairedSub);
      if (parsed && typeof parsed === "object") {
        return standardizeNoteResult(parsed, defaultTopic, clean);
      }
    }
  } catch (err3) {
    console.warn("JSON repair substring attempt failed:", err3.message);
  }

  // 5. Ultimate Fallback: Construct standard valid note structure from raw text
  console.warn("Constructing standardized note structure from raw text fallback...");
  return standardizeNoteResult({}, defaultTopic, clean);
}
