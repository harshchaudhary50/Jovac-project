export const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionMode = false,
  includeDiagram = false,
  includeChart = false,
  userRole,
  userCourse,
  userSemester
}) => {
  const isQuestionBank = examType?.toLowerCase().includes("question") || examType?.toLowerCase().includes("bank");
  const isVisualDiagram = examType?.toLowerCase().includes("diagram") || examType?.toLowerCase().includes("flowchart");

  return `You are an expert academic exam co-pilot. Generate comprehensive, high-yield study content in strict JSON format.

STUDENT ACADEMIC CONTEXT:
- Academic Level: ${classLevel || userSemester || "Undergraduate / College"}
- Course / Subject Stream: ${userCourse || examType || "Academic Studies"}
- Topic: "${topic}"
- Generation Format: ${revisionMode ? "5-Minute Rapid Revision Cheat Sheet" : isQuestionBank ? "Predicted Exam Question Bank & Model Answers" : isVisualDiagram ? "Visual Diagram & Process Flowchart Notes" : "Deep Comprehensive Concept Notes"}

STRICT GENERATION RULES:
1. NOTES FIELD ("notes"):
${
  revisionMode
    ? `- Mode: RAPID 5-MINUTE REVISION CHEAT SHEET
- Provide ONLY concise, high-yield bullet points: core definitions, formulas, memory shortcuts, and 1-line key facts.
- Use bold keywords and clean markdown lists.`
    : `- Mode: COMPREHENSIVE CONCEPT NOTES
- Write detailed Markdown notes structured as:
  # ${topic} - Exam Study Notes
  ## 1. Core Concept & Detailed Explanation
  ## 2. Working Principles & Step-by-Step Mechanisms
  ## 3. Important Formulas, Theorems, or Key Definitions
  ## 4. Key Summary / Comparison Table
  ## 5. Real-World Applications & Exam Scoring Insights`
}

2. SUBTOPICS ("subTopics"):
- Categorize 2-3 essential subtopics by exam priority into "⭐" (Good to know), "⭐⭐" (Frequently Asked), and "⭐⭐⭐" (Must-Study / High Weightage).

3. REVISION POINTS ("revisionPoints"):
- 5 to 7 high-impact revision takeaway points (perfect for last-minute cramming).

4. QUESTIONS ("questions"):
- "short": 3 concise questions with typical 2-5 mark weightage
- "long": 2 analytical / descriptive questions with 10-15 mark weightage
- "diagram": "${includeDiagram || isVisualDiagram ? "Draw and explain the architecture / step-by-step flowchart of " + topic : ""}"

5. DIAGRAM ("diagram"):
${
  includeDiagram || isVisualDiagram
    ? `- Generate a valid Mermaid flowchart starting with graph TD using square bracket node labels:
  {"type": "flowchart", "data": "graph TD\\n[A] --> [B]\\n[B] --> [C]"}`
    : `- STRICTLY SET EMPTY: {"type": "", "data": ""}`
}

6. CHARTS ("charts"):
${
  includeChart
    ? `- Generate 1 chart object representing exam topic weightage or breakdown:
  [{"type": "bar", "title": "Exam Weightage (%)", "data": [{"name": "Core Principles", "value": 40}, {"name": "Practical Applications", "value": 35}, {"name": "Numerical Problems", "value": 25}]}]`
    : `- STRICTLY SET EMPTY: []`
}

STRICT JSON OUTPUT SCHEMA:
{
  "subTopics": {
    "⭐": ["Subtopic 1"],
    "⭐⭐": ["Subtopic 2"],
    "⭐⭐⭐": ["Subtopic 3"]
  },
  "importance": "⭐⭐⭐",
  "notes": "Markdown formatted string...",
  "revisionPoints": ["Revision point 1", "Revision point 2"],
  "questions": {
    "short": ["Q1", "Q2", "Q3"],
    "long": ["Long Q1", "Long Q2"],
    "diagram": "${includeDiagram || isVisualDiagram ? "Explain the diagram..." : ""}"
  },
  "diagram": ${includeDiagram || isVisualDiagram ? '{"type": "flowchart", "data": "graph TD\\n[Start] --> [End]"}' : '{"type": "", "data": ""}'},
  "charts": ${includeChart ? '[{"type": "bar", "title": "Topic Weightage", "data": [{"name": "Concept", "value": 50}, {"name": "Problems", "value": 50}]}]' : '[]'}
}
RETURN VALID JSON ONLY. NO MARKDOWN TICKS AROUND JSON.`;
};
