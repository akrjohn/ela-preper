# LLM Prompt for Additional Grade 3 Math Questions

Generate 30 additional Grade 3 Math questions to fill gaps in the question bank.

## OUTPUT
Valid JSON array only.

## FOCUS AREAS (fill these gaps)
- Domain G (Geometry): Need 10+ more (currently only 5)
- Domain NF (Fractions): Need 5+ more
- Domain NBT: Need 5+ more
- Claim 2+4 (Problem Solving): Need more word problems
- Claim 3 (Reasoning): Need more explanation/justification questions

## SCHEMA
```json
{
  "id": "m3-q41",
  "type": "math",
  "format": "single|multi-select|numeric_entry|word_problem",
  "grade": 3,
  "domain": "OA|NBT|NF|MD|G",
  "standard": "3.OA.A.1",
  "claim": "1|2|3",
  "dok": 1,
  "question": "question text",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "why answer is correct",
  "solutionWork": "step-by-step"
}
```

## PRIORITY
1. **Geometry (G)**: Partition shapes, equal areas, quadrilaterals - 10 questions
2. **Fractions (NF)**: Compare fractions, number lines, equivalent - 5 questions  
3. **NBT**: Rounding, addition/subtraction - 5 questions
4. **Problem Solving**: Multi-step word problems - 5 questions
5. **Reasoning**: Explain thinking, justify answers - 5 questions

## PROMPT COPY

```
Generate 30 Grade 3 Math questions to fill gaps.

OUTPUT: Valid JSON array only.

PRIORITY FILL:
1. Geometry (G): 10 questions - partition shapes, equal areas, quadrilaterals
2. Fractions (NF): 5 questions - compare fractions, number lines  
3. NBT: 5 questions - rounding, addition/subtraction
4. Problem Solving (Claim 2): 5 questions - multi-step word problems
5. Reasoning (Claim 3): 5 questions - explain thinking, justify answers

SCHEMA: id, type, format, grade, domain, standard, claim, dok, question, options, correctAnswer, explanation, solutionWork

Output as JSON array.
```