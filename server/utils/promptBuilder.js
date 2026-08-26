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
  return `You are an expert exam co-pilot. Generate precise study content in strict JSON format.

STUDENT PROFILE:
- Level: ${classLevel || userSemester || "Undergraduate"}
- Course / Exam: ${userCourse || examType || "Academic Studies"}
- Topic: "${topic}"

STRICT GENERATION RULES:
1. NOTES FIELD ("notes"):
${
  revisionMode
    ? `- Mode: RAPID 5-MINUTE REVISION CHEAT SHEET
- Provide ONLY high-yield bullet points: core definitions, formulas, and 1-line key facts.
- DO NOT generate long paragraphs or comparison tables.`
    : `- Mode: COMPREHENSIVE CONCEPT NOTES
- Write detailed Markdown study notes:
  # ${topic} - Exam Study Notes
  ## Core Concept & Technical Explanation
  ## Working Principles & Step-by-Step Breakdown
  ## Key Comparison / Summary Table
  ## Real-world Example / Code / Key Formulas
  ## High-Yield Exam Tips & Scoring Points`
}

2. SUBTOPICS ("subTopics"):
- Categorize 2-3 key subtopics into "⭐", "⭐⭐", "⭐⭐⭐" by exam priority.

3. REVISION POINTS ("revisionPoints"):
- 5 to 7 high-impact revision bullet points.

4. QUESTIONS ("questions"):
- "short": 3 concise questions (2-5 marks)
- "long": 2 analytical questions (10-15 marks)
- "diagram": "${includeDiagram ? "Draw and explain the architecture / process of " + topic : ""}"

5. DIAGRAM ("diagram"):
${
  includeDiagram
    ? `- Generate a valid Mermaid flowchart starting with graph TD using square bracket node labels:
  {"type": "flowchart", "data": "graph TD\\n[A] --> [B]"}`
    : `- STRICTLY SET EMPTY: {"type": "", "data": ""}`
}

6. CHARTS ("charts"):
${
  includeChart
    ? `- Generate 1 chart object with topic weightage:
  [{"type": "bar", "title": "Exam Weightage (%)", "data": [{"name": "Core Concept", "value": 40}, {"name": "Advanced Theory", "value": 60}]}]`
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
    "diagram": "${includeDiagram ? "Explain the diagram..." : ""}"
  },
  "diagram": ${includeDiagram ? '{"type": "flowchart", "data": "graph TD\\n[Start] --> [End]"}' : '{"type": "", "data": ""}'},
  "charts": ${includeChart ? '[{"type": "bar", "title": "Weightage", "data": [{"name": "Topic A", "value": 50}, {"name": "Topic B", "value": 50}]}]' : '[]'}
}
RETURN VALID JSON ONLY.`;
};
