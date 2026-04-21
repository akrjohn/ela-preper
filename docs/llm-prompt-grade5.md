# LLM Prompt for Grade 5 ELA Question Generation

Generate 40 Grade 5 English Language Arts questions aligned to Smarter Balanced (SBAC) California standards.

## OUTPUT
Valid JSON array only (no additional text).

## SCHEMA (All Fields Required)
```json
{
  "id": "g5-q01",
  "type": "reading|vocabulary|grammar|writing",
  "format": "single|two-part|multi-select",
  "grade": 5,
  "standard": "CCSS.ELA-LITERACY.X.X",
  "question": "question text",
  "passage": {"id": "passage-id", "text": "100-200 word passage", "source": "original"},
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
  "explanation": "why this evidence supports Part A"
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

## DISTRIBUTION (40 Total)
- 20 Reading (16 passage-based, 4 standalone)
- 8 Vocabulary (context clues, prefixes, suffixes, Greek/Latin roots, idioms)
- 6 Grammar/Conventions (verb tense, pronouns, modifiers)
- 6 Writing (opinion, informative, narrative elements)

## FORMAT DISTRIBUTION
- 24 single-choice
- 8 two-part (evidence-based)
- 8 multi-select (select 2 that apply)

## STANDARDS TO COVER
- RL.5.1: Key details (who, what, where, when, why, how)
- RL.5.2: Main idea/theme
- RL.5.3: Character actions and motivations
- RL.5.4: Vocabulary in context
- RL.5.5: Text structure
- RL.5.7: Illustrations support text
- RI.5.1: Ask and answer questions
- RI.5.2: Main idea and key details
- RI.5.3: Explain relationships
- RI.5.4: Vocabulary in informational text
- RI.5.5: Text features
- W.5.1: Opinion writing
- W.5.2: Informational writing
- L.5.1: Subject-verb agreement
- L.5.2: Capitalization and punctuation
- L.5.4: Vocabulary from context

## PASSAGE REQUIREMENTS
- 5-6 original reading passages (120-200 words each)
- More complex vocabulary (grade 5 level)
- Mix of literary (stories, myths, poetry excerpts) and informational (science, social studies, biography)
- Include 2-3 passages with multiple questions

## PROMPT COPY

Copy this entire section for Gemini:

```
Generate 40 Grade 5 English Language Arts questions aligned to Smarter Balanced SBAC California standards.

OUTPUT: Valid JSON array only - no intro text, no code blocks, just raw JSON.

MUST INCLUDE ALL FIELDS per question:
id, type, format, grade, standard, question, passage (with id/text/source), options, correctAnswer, explanation

For two-part: add partBQuestion, partBOptions, partBCorrectAnswer
For multi-select: correctAnswer as array [0,2], question says "Select TWO"

DISTRIBUTION:
- 24 single-choice
- 8 two-part (evidence-based)
- 8 multi-select (select all that apply)

Total: 20 reading, 8 vocabulary, 6 grammar, 6 writing

STANDARDS: RL.5.1, RL.5.2, RL.5.3, RL.5.4, RL.5.5, RL.5.7, RI.5.1, RI.5.2, RI.5.3, RI.5.4, RI.5.5, W.5.1, W.5.2, L.5.1, L.5.2, L.5.4

Create 5-6 original passages (120-200 words each) covering:
- A myth or legend
- A science fiction story
- A biography of an inventor
- An informational text about an ecosystem
- A realistic fiction story about a challenge

Output as valid JSON array starting with [ and ending with ].
```