# LLM Prompt for ELA Question Generation

Generate 30 Grade 3 English Language Arts questions aligned to Smarter Balanced (SBAC) California standards.

## OUTPUT
Valid JSON array only (no additional text).

## SCHEMA (All Fields Required)
```json
{
  "id": "g3-q01",
  "type": "reading|vocabulary|grammar|writing",
  "format": "single|two-part|multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.X.X",
  "question": "question text",
  "passage": {"id": "passage-id", "text": "50-150 word passage", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why this answer is correct"
}
```

### Two-Part Additional Fields
```json
{
  "format": "two-part",
  "question": "Part A: [question]",
  "partBQuestion": "Part B: Which sentence from the passage best supports your answer?",
  "partBOptions": ["sentence 1", "sentence 2", "sentence 3", "sentence 4"],
  "partBCorrectAnswer": 0,
  "partBExplanation": "why this evidence supports Part A"
}
```

### Multi-Select Additional Fields
```json
{
  "format": "multi-select",
  "question": "Select TWO [details/example/actions] that...",
  "correctAnswer": [0, 2],
  "explanation": "Both A and C are correct because..."
}
```

## DISTRIBUTION (30 Total)
- 15 Reading (12 passage-based, 3 standalone)
- 5 Vocabulary (context clues, prefixes/suffixes, multiple meanings)
- 5 Grammar/Conventions (subject-verb agreement, punctuation, capitalization)
- 5 Writing (opinion, informative, narrative elements)

## FORMAT DISTRIBUTION
- 18 single-choice
- 6 two-part (evidence-based)
- 6 multi-select (select 2 that apply)

## STANDARDS TO COVER
- RL.3.1: Key details (who, what, where, when, why, how)
- RL.3.2: Main idea/theme
- RL.3.3: Character actions and motivations
- RL.3.4: Vocabulary in context
- RI.3.1: Ask and answer questions
- RI.3.2: Main idea and key details
- RI.3.3: Describe relationships
- RI.3.4: Vocabulary in informational text
- RI.3.5: Text features
- W.3.1: Opinion writing
- W.3.2: Informational writing
- L.3.1: Subject-verb agreement
- L.3.2: Capitalization and punctuation
- L.3.4: Vocabulary from context

## PASSAGE REQUIREMENTS
- 4-5 original reading passages (80-150 words each)
- Mix of literary (stories, fables) and informational (science, social studies)
- Grade-appropriate vocabulary
- Include 2-3 passages with multiple questions

## EXAMPLES

### Single (RL.3.1)
```json
{
  "id": "g3-q01",
  "type": "reading",
  "format": "single",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RL.3.1",
  "question": "What did the character do first to solve the problem?",
  "passage": {"id": "p1", "text": "[100-word story]", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "The text states..."
}
```

### Two-Part (RL.3.3)
```json
{
  "id": "g3-q19",
  "type": "reading",
  "format": "two-part",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RL.3.3",
  "question": "Part A: How does the character feel at the end of the story?",
  "passage": {"id": "p2", "text": "[100-word story]", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 2,
  "partBQuestion": "Part B: Which sentence from the passage best supports your answer?",
  "partBOptions": ["A sentence", "B sentence", "C sentence", "D sentence"],
  "partBCorrectAnswer": 1,
  "explanation": "The character's feelings are shown through..."
}
```

### Multi-Select (RI.3.1)
```json
{
  "id": "g3-q25",
  "type": "reading",
  "format": "multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RI.3.1",
  "question": "Select TWO details that show how the process works.",
  "passage": {"id": "p3", "text": "[science passage]", "source": "original"},
  "options": ["detail A", "detail B", "detail C", "detail D"],
  "correctAnswer": [0, 2],
  "explanation": "Both A and D are correct because..."
}
```

## PROMPT COPY

Copy this entire section for Gemini:

```
Generate 30 Grade 3 English Language Arts questions aligned to Smarter Balanced SBAC California standards.

OUTPUT: Valid JSON array only - no intro text, no code blocks, just raw JSON.

MUST INCLUDE ALL 31 FIELDS per question:
id, type, format, grade, standard, question, passage (with id/text/source), options, correctAnswer, explanation

For two-part: add partBQuestion, partBOptions, partBCorrectAnswer
For multi-select: correctAnswer as array [0,2], question says "Select TWO"

DISTRIBUTION:
- 18 single-choice
- 6 two-part (evidence-based)  
- 6 multi-select (select all that apply)

STANDARDS: RL.3.1, RL.3.2, RL.3.3, RL.3.4, RI.3.1, RI.3.2, RI.3.3, RI.3.4, RI.3.5, W.3.1, W.3.2, L.3.1, L.3.2, L.3.4

Types: 15 reading, 5 vocabulary, 5 grammar, 5 writing
```