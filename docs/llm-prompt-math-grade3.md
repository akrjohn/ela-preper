# LLM Prompt for Grade 3 Math Question Generation

Generate 40 Grade 3 Math questions aligned to Smarter Balanced (SBAC) California standards and Common Core.

## OUTPUT
Valid JSON array only (no additional text).

## SCHEMA
```json
{
  "id": "m3-q01",
  "type": "math",
  "format": "single|multi-select|numeric_entry|word_problem",
  "grade": 3,
  "domain": "OA|NBT|NF|MD|G",
  "standard": "3.OA.A.1",
  "claim": "1|2|3",
  "dok": 1,
  "question": "question text",
  " passage": {"id": "p1", "text": "optional word problem context"},
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "solution explanation",
  "solutionWork": "step-by-step solution"
}
```

## CONTENT DOMAINS

### OA - Operations and Algebraic Thinking
- 3.OA.A.1: Interpret products of whole numbers
- 3.OA.A.2: Interpret whole-number quotients
- 3.OA.A.3: Use multiplication within 100 to solve word problems
- 3.OA.B.5: Apply properties of operations
- 3.OA.C.7: Multiply within 100

### NBT - Number and Operations in Base Ten  
- 3.NBT.A.1: Use place value to round
- 3.NBT.A.2: Add/subtract within 1000

### NF - Number and Operations - Fractions
- 3.NF.A.1: Understand fractions as parts of wholes
- 3.NF.A.2: Understand fractions on number lines
- 3.NF.A.3: Compare fractions

### MD - Measurement and Data
- 3.MD.A.1: Tell time, money
- 3.MD.B.4: Generate measurement data
- 3.MD.C.7: Relate area to multiplication
- 3.MD.D.8: Solve perimeter problems

### G - Geometry
- 3.G.A.1: Categorize shapes
- 3.G.A.2: Partition shapes into equal areas

## QUESTION TYPES
- **single**: 4-choice multiple choice
- **multi-select**: Select all that apply
- **numeric_entry**: Student enters number
- **word_problem**: Multi-step real-world context

## CLAIM DISTRIBUTION
- Claim 1: Concepts and Procedures (60%)
- Claim 2+4: Problem Solving and Modeling (25%)
- Claim 3: Communicating Reasoning (15%)

## DOK DISTRIBUTION
- 8-10 DOK 1 (20-25%)
- 20-24 DOK 2 (50-60%)  
- 8-10 DOK 3 (20-25%)

## DOMAIN TARGETS
- OA: 12-14 questions
- NBT: 6-8 questions
- NF: 6-8 questions
- MD: 8-10 questions
- G: 4-6 questions

## PROMPT COPY

```
Generate 40 Grade 3 Math questions aligned to SBAC/Common Core.

OUTPUT: Valid JSON array only - no intro text, no code blocks.

SCHEMA: id, type, format, grade, domain, standard, claim, dok, question, (optional passage), options, correctAnswer, explanation, solutionWork

DOMAINS: OA, NBT, NF, MD, G (cover all 5)

QUESTION TYPES: single (MC), multi-select, numeric_entry, word_problem

CLAIMS: 1 (Concepts), 2+4 (Problem Solving), 3 (Reasoning)
DOK: 1 (recall), 2 (skill/concept), 3 (strategic thinking)

DISTRIBUTION:
- OA: 12-14 questions
- NBT: 6-8 questions  
- NF: 6-8 questions
- MD: 8-10 questions
- G: 4-6 questions

Include word problems with real-world contexts.
Include solution work for teacher reference.

Output as valid JSON array starting with [ and ending with ].
```