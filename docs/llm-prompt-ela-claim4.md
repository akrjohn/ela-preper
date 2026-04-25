# LLM Prompt for ELA Claim 4 (Research) Questions

Generate 15 Grade 3 ELA questions for Claim 4 - Research/Inquiry.

## OUTPUT
Valid JSON array only.

## CLAIM 4 - Research/Inquiry
- Target 1: Interpret and integrate information from multiple sources
- Target 2: Identify relevant vs. irrelevant information
- Target 3: Cite sources and evaluate credibility

## SCHEMA
```json
{
  "id": "g3-research-01",
  "type": "research",
  "format": "single|multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RI.3.7",
  "claim": "4",
  "target": "1|2|3",
  "dok": 2,
  "question": "question text",
  "passages": [{"id": "r1a", "text": "source 1"}, {"id": "r1b", "text": "source 2"}],
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why answer is correct"
}
```

## REQUIREMENTS
- Questions require using 2+ short passages
- Test integration of information across sources
- Include "using both passages" type questions
- Some questions about what information is relevant

## PROMPT COPY

```
Generate 15 Grade 3 ELA Claim 4 (Research) questions.

OUTPUT: Valid JSON array only.

SCHEMA: id, type, format, grade, standard, claim, target, dok, question, passages (array of 2+ sources), options, correctAnswer, explanation

Claim 4 targets:
- RI.3.7: Use information from illustrations and text to understand
- RI.3.8: Identify author's reasons and supporting evidence
- RI.3.9: Compare key details across texts

Key: Questions should reference multiple sources ("According to both passages...", "What do Source 1 and Source 2 agree on?")

Format: 10 single-select, 5 multi-select
DOK: 2-3

Output as JSON array.
```