# LLM Prompt for Grade 3 ELA Question Generation (SBAC Aligned)

Generate 40 Grade 3 English Language Arts questions aligned to Smarter Balanced (SBAC) California standards.

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
  "claim": "1|2|3|4",
  "target": "1-7",
  "dok": 1,
  "question": "question text",
  "passage": {"id": "passage-id", "text": "80-150 word passage", "source": "original"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why this answer is correct"
}
```

### SBAC CLAIMS (Required)
- **Claim 1**: Reading - key details, central idea, vocabulary, inference
- **Claim 2**: Writing - opinion, informational, narrative
- **Claim 3**: Speaking and Listening - comprehension
- **Claim 4**: Research/Inquiry - integrate sources, cite

### DEPTH OF KNOWLEDGE (Required)
- **DOK 1**: Recall and reproduction (identify, define, list)
- **DOK 2**: Skills and concepts (explain, compare, classify)
- **DOK 3**: Strategic thinking (analyze, evaluate, justify)

### TARGETS (per Claim 1)
| Target | Description |
|--------|-------------|
| 1 | Key details and central idea (literary) |
| 2 | Craft and structure — vocabulary in context |
| 3 | Craft and structure — text structure and author's purpose |
| 4 | Inference and conclusion from literary text |
| 5 | Key details and central idea (informational) |
| 6 | Inference and conclusion from informational text |
| 7 | Text structure and author's purpose (informational) |

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
- 20 Reading (passage-based, mix literary/informational)
- 8 Vocabulary (context clues, prefixes/suffixes, Greek/Latin roots)
- 6 Grammar/Conventions (subject-verb agreement, punctuation, capitalization)
- 6 Writing (opinion, informative, narrative)

## FORMAT DISTRIBUTION
- 24 single-choice
- 8 two-part (evidence-based)
- 8 multi-select (select 2 that apply)

## CLAIM DISTRIBUTION
- 18+ Claim 1 (Reading)
- 6 Claim 2 (Writing)
- 4 Claim 3 (Listening/Speaking)
- 4 Claim 4 (Research)

## DOK DISTRIBUTION
- 8-10 DOK 1 (20-25%)
- 20-24 DOK 2 (50-60%)
- 8-10 DOK 3 (20-25%)

## STANDARDS TO COVER
- RL.3.1, RL.3.2, RL.3.3, RL.3.4, RL.3.5, RL.3.7
- RI.3.1, RI.3.2, RI.3.3, RI.3.4, RI.3.5
- W.3.1, W.3.2, W.3.3
- L.3.1, L.3.2, L.3.4, L.3.5

## PASSAGE REQUIREMENTS
- 5-6 original reading passages (100-200 words each)
- Mix of literary (realistic fiction, fables, folktales) and informational (science, social studies)
- Grade-appropriate vocabulary (Lexile 520L-820L)
- Include 2-3 passages with multiple questions

## PROMPT COPY

```
Generate 40 Grade 3 English Language Arts questions aligned to Smarter Balanced SBAC California standards.

OUTPUT: Valid JSON array only - no intro text, no code blocks, just raw JSON.

MUST INCLUDE ALL FIELDS per question:
id, type, format, grade, standard, claim, target, dok, question, passage (with id/text/source), options, correctAnswer, explanation

CLAIMS (required):
- Claim 1: Reading (key details, central idea, vocabulary, inference)
- Claim 2: Writing (opinion, informational, narrative)
- Claim 3: Speaking and Listening
- Claim 4: Research/Inquiry

DOK (required):
- DOK 1: Recall/reproduction
- DOK 2: Skills/concepts (explain, compare, classify)
- DOK 3: Strategic thinking (analyze, evaluate, justify)

DISTRIBUTION:
- 24 single-choice
- 8 two-part (evidence-based)
- 8 multi-select (select all that apply)

CLAIM DISTRIBUTION: 18 Claim 1, 6 Claim 2, 4 Claim 3, 4 Claim 4
DOK DISTRIBUTION: 8-10 DOK-1, 20-24 DOK-2, 8-10 DOK-3

Types: 20 reading, 8 vocabulary, 6 grammar, 6 writing

Output as valid JSON array starting with [ and ending with ].
```