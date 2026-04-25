# LLM Prompt for ELA Claim 3 (Listening) Questions

Generate 15 Grade 3 ELA questions for Claim 3 - Listening and Speaking.

## OUTPUT
Valid JSON array only.

## CLAIM 3 - Listening/Speaking
- Target 1: Listening comprehension - central idea and key details
- Target 2: Listening comprehension - inference and supporting evidence

## SCHEMA
```json
{
  "id": "g3-listen-01",
  "type": "listening",
  "format": "single|multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.SL.3.2",
  "claim": "3",
  "target": "1|2",
  "dok": 1,
  "question": "question text",
  "passage": {"id": "listen-1", "text": "80-150 word transcript", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why answer is correct"
}
```

## REQUIREMENTS
- Listening passages are written as transcripts (simulating audio)
- Include "Listen to [person] talk about [topic]"
- Questions test comprehension from listening content
- 8-10 single-select, 5-7 multi-select

## PROMPT COPY

```
Generate 15 Grade 3 ELA Claim 3 (Listening) questions.

OUTPUT: Valid JSON array only.

SCHEMA: id, type, format, grade, standard, claim, target, dok, question, passage (with id/text/source), options, correctAnswer, explanation

Claim 3 targets:
- SL.3.2: Determine main idea and key details from spoken text
- SL.3.3: Ask and answer questions about what a speaker says

Format: Listening passages as transcripts (simulating audio). Include intro like "Listen to the teacher explain..."

Questions: 8-10 single-select, 5-7 multi-select
DOK: 1-2

Output as JSON array.
```