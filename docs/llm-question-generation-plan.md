# LLM Question Generation Plan

## Overview
Generate questions aligned to Smarter Balanced (SBAC) California state standards, including advanced formats. Store locally in JSON files.

## Question Bank Structure
- `src/data/questions-grade3.json` - Grade 3 questions
- `src/data/questions-grade4.json` - Grade 4 questions
- `src/data/questions-grade5.json` - Grade 5 questions

## Question Schema

### Single Answer (default)
```json
{
  "id": "g3-q01",
  "type": "reading|vocabulary|grammar|writing",
  "format": "single",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.X.X",
  "question": "question text",
  "passage": {"id": "passage-id", "text": "50-150 word passage", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why this answer is correct"
}
```

### Two-Part (Evidence-Based)
```json
{
  "id": "g3-q26",
  "type": "reading",
  "format": "two-part",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RL.3.1",
  "question": "Part A: Based on the passage, how does the main character feel?",
  "passage": {"id": "passage-1", "text": "...", "source": "original"},
  "options": ["A: Happy", "B: Sad", "C: Angry", "D: Scared"],
  "correctAnswer": 1,
  "partBQuestion": "Part B: Which sentence from the passage best supports your answer?",
  "partBOptions": ["A: She ran home crying.", "B: She smiled at her friends.", "C: She went to the store.", "D: She played outside."],
  "partBCorrectAnswer": 0,
  "explanation": "The character showing sadness is supported by..."
}
```

### Multi-Select (Select all that apply)
```json
{
  "id": "g3-q27",
  "type": "reading",
  "format": "multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RI.3.1",
  "question": "Select TWO details that show how plants grow.",
  "passage": {"id": "passage-2", "text": "...", "source": "original"},
  "options": ["They need sunlight.", "They grow at night only.", "They need water.", "They grow in the dark."],
  "correctAnswer": [0, 2],
  "explanation": "Plants need sunlight and water to grow."
}
```

## Question Formats Supported
| Format | Description | Scoring |
|--------|-------------|---------|
| `single` | Standard multiple-choice | 1 correct answer |
| `two-part` | Part A + Part B evidence | Both parts must be correct |
| `multi-select` | Select all that apply | All correct answers required |

## Standards to Cover

### Grade 3
- Reading Literature: RL.3.1, RL.3.2, RL.3.3, RL.3.4, RL.3.7
- Reading Informational: RI.3.1, RI.3.2, RI.3.3, RI.3.4, RI.3.5
- Writing: W.3.1, W.3.2
- Language/Grammar: L.3.1, L.3.2, L.3.4

### Grade 4
- Reading Literature: RL.4.1, RL.4.2, RL.4.3, RL.4.4, RL.4.7
- Reading Informational: RI.4.1, RI.4.2, RI.4.3, RI.4.4, RI.4.5
- Writing: W.4.1, W.4.2
- Language/Grammar: L.4.1, L.4.2, L.4.4

### Grade 5
- Reading Literature: RL.5.1, RL.5.2, RL.5.3, RL.5.4, RL.5.7
- Reading Informational: RI.5.1, RI.5.2, RI.5.3, RI.5.4, RI.5.5
- Writing: W.5.1, W.5.2
- Language/Grammar: L.5.1, L.5.2, L.5.4

## LLM Prompt for Two-Part Questions

```
Generate 5 Grade 3 English Language Arts TWO-PART evidence-based questions aligned to Smarter Balanced standards.

OUTPUT: Valid JSON array only

SCHEMA:
{
  "id": "g3-q2p-01",
  "type": "reading",
  "format": "two-part",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RL.3.1",
  "question": "Part A question (e.g., How does the character feel?)",
  "passage": {"id": "passage-id", "text": "100-150 word passage", "source": "original"},
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0-3,
  "partBQuestion": "Part B: Which sentence from the passage best supports your answer?",
  "partBOptions": ["sentence 1", "sentence 2", "sentence 3", "sentence 4"],
  "partBCorrectAnswer": 0-3,
  "explanation": "Explanation linking both parts"
}

REQUIREMENTS:
- Include 2-3 reading passages (100-150 words each)
- For each passage: 1-2 two-part questions
- Part B must reference specific text evidence from the passage
- Cover RL.3.1 (key details) and RL.3.3 (character analysis)
```

## LLM Prompt for Multi-Select Questions

```
Generate 5 Grade 3 English Language Arts MULTI-SELECT questions (select all that apply).

OUTPUT: Valid JSON array only

SCHEMA:
{
  "id": "g3-qms-01",
  "type": "reading",
  "format": "multi-select",
  "grade": 3,
  "standard": "CCSS.ELA-LITERACY.RI.3.1",
  "question": "Select TWO details that...",
  "passage": {"id": "passage-id", "text": "passage text", "source": "original"},
  "options": ["detail A", "detail B", "detail C", "detail D"],
  "correctAnswer": [0, 2],
  "explanation": "Both A and C are correct because..."
}

REQUIREMENTS:
- Exactly 2 correct answers per question
- Include 1-2 reading passages
- Cover informational text key details (RI.3.1, RI.3.2)
- Make sure distractors are plausible but incorrect
```

## App Integration
1. Load JSON files via `loadQuestions()` in page.tsx
2. Random selection via `shuffleArray()`
3. Option shuffling via `shuffleOptions()`
4. Multi-select uses array comparison for scoring
5. Two-part requires both Part A and Part B correct

## Resources
- Smarter Balanced: https://portal.smarterbalanced.org/
- Sample Items: https://sampleitems.smarterbalanced.org/
- Content Explorer: https://contentexplorer.smarterbalanced.org/