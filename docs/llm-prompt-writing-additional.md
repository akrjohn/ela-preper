# LLM Prompt for Additional Writing Questions - Grade 3

Generate 15 additional Grade 3 ELA Writing questions.

## OUTPUT
Valid JSON array only.

## FOCUS
Add more writing prompts to strengthen Claim 2 coverage.

## TYPES NEEDED
- Opinion essays (10)
- Informative/explanatory (10)  
- Narrative writing (5)

## SCHEMA
```json
{
  "id": "g3-w-71",
  "type": "writing",
  "format": "single",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.W.3.1",
  "claim": "2",
  "target": "1|2|3",
  "dok": 2,
  "question": "prompt text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why this is the best response",
  "rubric": {
    "score2": "description",
    "score1": "description",
    "score0": "description"
  }
}
```

## PROMPT

Generate writing prompts where students identify:
- Best thesis statement
- Best supporting detail
- Best concluding statement
- Best transition word
- Strongest evidence

Include rubric for each question.

## PROMPT COPY

```
Generate 15 Grade 3 Writing questions (multiple choice format).

OUTPUT: Valid JSON array only.

SCHEMA: id, type, format, grade, standard, claim, target, dok, question, options, correctAnswer, explanation, rubric

Distribution:
- Opinion writing: 6 questions (thesis, reasons, evidence, conclusion)
- Informative: 5 questions (topic sentence, details, organization)
- Narrative: 4 questions (character, setting, plot, dialogue)

Format: Multiple choice - identify best answer for writing task
Rubric: Include score2/score1/score0 for each question

Output as JSON array.
```