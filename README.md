# ELA Test Prep

An interactive English Language Arts (ELA) practice application for California students in grades 3-5, aligned to Smarter Balanced (SBAC) state standards.

## Purpose

This app helps kids prepare for their California ELA state tests by providing:
- Practice questions aligned to CCSS/SBAC standards
- Immediate feedback with explanations
- Progress tracking
- Randomized question selection for variety

## Features

- **Grade-based practice** - Select Grade 3 (more grades coming soon)
- **Multiple question formats**:
  - Single choice
  - Two-part (evidence-based)
  - Multi-select (select all that apply)
- **Question types**:
  - Reading comprehension
  - Vocabulary in context
  - Grammar/conventions
  - Writing prompts
- **Instant feedback** with detailed explanations
- **Score tracking** saved to localStorage
- **Randomized questions** - Each test is different

## Tech Stack

- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- Jest for testing

## Running the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Main application
│   ├── layout.tsx       # Root layout
│   └── globals.css     # Global styles
├── data/
│   ├── questions-grade3.json  # Grade 3 question bank
│   ├── questions-grade4.json  # Grade 4 (coming soon)
│   └── questions-grade5.json  # Grade 5 (coming soon)
├── types/
│   └── questions.ts    # TypeScript interfaces
└── utils/
    ├── questions.ts   # Utility functions
    └── questions.test.ts # Unit tests
```

## Question Bank

Currently 70 Grade 3 questions covering:
- Reading Literature (RL.3.1-3.7)
- Reading Informational (RI.3.1-3.5)
- Writing (W.3.1, W.3.2)
- Language/Grammar (L.3.1, L.3.2, L.3.4)

## Contributing

To add more questions:
1. Use Gemini with the prompt in `docs/llm-prompt.md`
2. Generate JSON following the schema
3. Add to `src/data/questions-grade*.json`
4. Run tests: `npm test`

## Standards Reference

- [Smarter Balanced](https://smarterbalanced.org)
- [California ELA Standards](https://www.cde.ca.gov/ei/in/)
- [Content Explorer](https://contentexplorer.smarterbalanced.org)