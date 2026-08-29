export const buildPrompt = ({
  topic,
  classLevel,
  examType,
  formatMode,
  revisionMode = false,
  includeDiagram = false,
  includeChart = false,
  userRole,
  userCourse,
  userSemester
}) => {
  const typeStr = (examType || "").toLowerCase();
  const modeStr = (formatMode || "").toLowerCase();

  const isQuestionBank = modeStr === "questions" || modeStr === "question_bank" || typeStr.includes("question") || typeStr.includes("bank");
  const isRevision = revisionMode || modeStr === "revision" || modeStr === "revision_sheet" || typeStr.includes("revision");
  const isVisualDiagram = modeStr === "diagrams" || modeStr === "visual_diagram" || typeStr.includes("diagram") || typeStr.includes("flowchart");

  let formatDescription = "Deep Comprehensive Concept Notes";
  let notesInstructions = "";

  if (isQuestionBank) {
    formatDescription = "Predicted Exam Question Bank & Model Answers";
    notesInstructions = `
- Mode: PREDICTED EXAM QUESTION BANK & MODEL ANSWER GUIDE
- Structure the "notes" markdown string strictly as follows with rich, comprehensive, exam-ready answers:
  # ${topic} - Predicted Exam Question Bank & Model Solutions

  ## 🎯 Section A: High-Probability Short Questions (2 - 5 Marks)
  Provide 4 to 5 frequently asked short questions. For EACH question, write:
  - **Question:** (Exact question text)
  - **Mark Weightage:** (2 or 5 Marks)
  - **Model Answer:** (Precise, high-scoring answer with key bullet points and highlighted keywords)
  - **Examiner Key Point:** (What examiners look for to give full marks)

  ## 📝 Section B: Medium Concept & Mechanism Questions (5 - 7 Marks)
  Provide 3 analytical/conceptual questions. For EACH question, write:
  - **Question:** (Exact question text)
  - **Model Answer:** (Structured step-by-step breakdown, working principles, and formulas where applicable)

  ## 🏆 Section C: Long Essay / Architecture & Deep Questions (10 - 15 Marks)
  Provide 2 comprehensive essay-style questions. For EACH question, write:
  - **Question:** (Detailed 10-15 mark question text)
  - **Complete Model Solution:** (Exhaustive, deeply structured answer with sub-headings, architectural/procedural steps, comparison points, and real-world examples)

  ## 💡 Section D: Examiner Pitfalls & Scoring Strategy
  - Top 3 common mistakes students make in exams for this topic.
  - Strategy to secure maximum marks.
`;
  } else if (isRevision) {
    formatDescription = "5-Minute Rapid Revision Cheat Sheet";
    notesInstructions = `
- Mode: 5-MINUTE RAPID REVISION CHEAT SHEET
- Structure the "notes" markdown string as a condensed, high-yield cramming sheet:
  # ${topic} - 5-Minute Exam Revision Cheat Sheet

  ## ⚡ 1. Core Summary & 1-Line Definitions
  - Rapid definitions and 1-line conceptual summaries with **bolded keywords**.

  ## 🔑 2. Critical Formulas, Laws, & Key Equations
  - All essential formulas, complexity terms, or laws with variable breakdowns.

  ## 📊 3. High-Yield Comparison Table
  - Provide a clean Markdown comparison table summarizing core categories/types.
  - IMPORTANT: Format table rows on separate lines with standard Markdown table syntax (| Col 1 | Col 2 |).

  ## 🧠 4. Mnemonics & Memory Shortcuts
  - Easy-to-remember memory tricks and acronyms for rapid recall.

  ## 🚀 5. Top 10 Must-Remember Exam Takeaways
  - 10 bullet points covering the highest-probability exam facts.
`;
  } else if (isVisualDiagram) {
    formatDescription = "Visual Architecture & Process Flowchart Notes";
    notesInstructions = `
- Mode: VISUAL ARCHITECTURE & PROCESS FLOWCHART NOTES
- Structure the "notes" markdown string focusing on visual understanding:
  # ${topic} - Visual Architecture & Diagrammatic Study Guide

  ## 🎨 1. Visual System Architecture & Flow Overview
  - High-level architectural overview and component interaction.

  ## 🔄 2. Step-by-Step State Transition & Data Flow Mechanism
  - Sequential step-by-step flow of how data/control moves through the system.

  ## 🧩 3. Component-by-Component Deep Dive
  - Detailed breakdown of each component, inputs, outputs, and responsibilities.

  ## 📐 4. Diagrammatic Exam Questions & Drawing Guidelines
  - Standard questions asking to "Draw and explain..." with scoring guidelines.
`;
  } else {
    formatDescription = "Deep Comprehensive Concept Notes";
    notesInstructions = `
- Mode: COMPREHENSIVE HIGH-YIELD CONCEPT NOTES
- Structure the "notes" markdown string with rich, deeply researched academic explanations (DO NOT give short 1-line summaries; write in-depth, thorough explanations):
  # ${topic} - Comprehensive Exam Study Notes

  ## 📖 1. Core Concept & Detailed Explanation
  - In-depth theoretical explanation spanning 3 to 4 detailed paragraphs with real-world analogies and exact technical terminology.

  ## ⚙️ 2. Working Principles & Step-by-Step Mechanisms
  - Complete step-by-step breakdown of how the concept functions internally with numbered mechanisms.

  ## 📐 3. Important Formulas, Theorems, or Key Definitions
  - Mathematical equations, theorems, algorithms, or formal definitions clearly explained with variable descriptions.

  ## 📊 4. Key Summary & Comparison Table
  - Comprehensive Markdown comparison table highlighting advantages, disadvantages, and types.
  - CRITICAL: Format each table row on its own separate line using standard markdown syntax.

  ## 🌍 5. Real-World Applications & High-Scoring Exam Insights
  - Real-world industry applications and high-scoring exam writing strategies.
`;
  }

  return `You are a distinguished university professor and academic exam co-pilot. Generate comprehensive, rich, and high-yield study material in strict JSON format.

STUDENT ACADEMIC CONTEXT:
- Academic Level: ${classLevel || userSemester || "Undergraduate / College"}
- Course / Subject Stream: ${userCourse || examType || "Academic Studies"}
- Topic: "${topic}"
- Requested Format: ${formatDescription}

CRITICAL CONTENT DEPTH GUIDELINES:
- Provide rich, thorough, and in-depth academic content. Avoid superficial 1-sentence explanations.
- Table Rule: When writing Markdown tables, use standard markdown syntax with newlines between rows (| Col 1 | Col 2 |\\n| --- | --- |\\n| Val 1 | Val 2 |). NEVER use double pipes || to concatenate rows on a single line.

FORMAT SPECIFIC INSTRUCTIONS:
${notesInstructions}

JSON FIELD DEFINITIONS:
1. "subTopics": Categorize 3 key subtopics by exam priority into "⭐" (Good to know), "⭐⭐" (Frequently Asked), and "⭐⭐⭐" (Must-Study / High Weightage).
2. "importance": Overall exam weightage ("⭐", "⭐⭐", or "⭐⭐⭐").
3. "notes": The complete rich Markdown formatted string following the format instructions above.
   - Use clear markdown headers (##, ###), bullet points, and bold text for key terms.
   - TABLE FORMATTING: When writing markdown comparison tables, every single row MUST be separated by a real newline (\\n). Example:
     "| Feature | Type A | Type B |\\n| :--- | :--- | :--- |\\n| Speed | Fast | Slow |\\n| Space | O(1) | O(n) |"
     NEVER put multiple table rows on the same line.
4. "revisionPoints": 5 to 7 high-impact revision takeaway bullet points.
5. "questions":
   - "short": 3 concise questions with typical 2-5 mark weightage.
   - "long": 2 analytical / descriptive questions with 10-15 mark weightage.
   - "diagram": "${includeDiagram || isVisualDiagram ? "Draw and explain the architecture / step-by-step flowchart of " + topic : ""}"
6. "diagram": ${
    includeDiagram || isVisualDiagram
      ? `Generate a valid Mermaid flowchart starting with graph TD using clean node labels:
   {"type": "flowchart", "data": "graph TD\\n[Start] --> [Process]\\n[Process] --> [End]"}`
      : `{"type": "", "data": ""}`
  }
7. "charts": ${
    includeChart
      ? `Generate 1 chart object representing topic weightage or breakdown:
   [{"type": "bar", "title": "Exam Weightage (%)", "data": [{"name": "Core Principles", "value": 40}, {"name": "Mechanisms & Protocols", "value": 35}, {"name": "Practical Applications", "value": 25}]}]`
      : `[]`
  }

STRICT JSON OUTPUT SCHEMA:
{
  "subTopics": {
    "⭐": ["Subtopic A"],
    "⭐⭐": ["Subtopic B"],
    "⭐⭐⭐": ["Subtopic C"]
  },
  "importance": "⭐⭐⭐",
  "notes": "Markdown content...",
  "revisionPoints": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "questions": {
    "short": ["Q1", "Q2", "Q3"],
    "long": ["Long Q1", "Long Q2"],
    "diagram": "${includeDiagram || isVisualDiagram ? "Explain diagram..." : ""}"
  },
  "diagram": ${includeDiagram || isVisualDiagram ? '{"type": "flowchart", "data": "graph TD\\n[A] --> [B]"}' : '{"type": "", "data": ""}'},
  "charts": ${includeChart ? '[{"type": "bar", "title": "Topic Weightage", "data": [{"name": "Core", "value": 50}, {"name": "Practice", "value": 50}]}]' : '[]'}
}

RETURN VALID JSON ONLY. DO NOT INCLUDE ANY MARKDOWN CODE TICKS (NO \`\`\`json OR \`\`\`) AROUND THE JSON.`;
};
