# AGENTS.md

## Developer Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build   # Production build
npm run lint    # Run ESLint
npm test       # Run tests
```

## Project Structure

- `src/app/page.tsx` - Main page with all UI logic
- `src/data/questions-grade3.json` - Question bank (grade 3, 70 questions)
- `src/data/questions-grade4.json` - Placeholder for grade 4
- `src/data/questions-grade5.json` - Placeholder for grade 5
- `src/types/questions.ts` - TypeScript interfaces
- `docs/llm-question-generation-plan.md` - LLM prompt for generating more questions

## App Features

- Grade selection (3-5) filters questions
- Random question selection from bank
- Configurable question count (5, 8, 10, 15)
- Shuffled options for each question
- Reading, vocabulary, grammar, writing question types
- California state standards (CCSS/SBAC) aligned
- Progress bar and answer tracking
- Results saved to localStorage

## Adding More Questions

1. Use the LLM prompt in `docs/llm-question-generation-plan.md`
2. Generate questions for grade 4, 5 using Gemini
3. Save JSON to respective files
4. Update `loadQuestions()` in page.tsx to include new data files