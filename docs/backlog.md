# Backlog

## Quick Wins

- [ ] Timer - Add countdown timer to simulate test conditions
- [ ] Progress summary - Show correct/incorrect breakdown at end
- [ ] Review mode - Retake only missed questions
- [ ] Question count selector - Already done

## Data & Content

- [ ] Add Grade 4 questions - Using LLM prompts
- [ ] Add Grade 5 questions - Using LLM prompts
- [ ] Short constructed response - Writing prompts

## UX Enhancements

- [ ] Dark mode - Add theme toggle
- [ ] Save progress - Pause and resume test
- [ ] Keyboard navigation - Arrow keys for questions

## Engagement

- [ ] Streak tracking - Daily practice streaks
- [ ] Badges/achievements - Milestone celebrations
- [ ] Review incorrect answers - Button to see wrong answers

## Technical

- [ ] UI component tests - Expand test coverage
- [ ] PWA support - Make installable

---

## Implementation Notes

- Timer should be configurable (e.g., 30, 45, 60 minutes per test)
- Review mode filters questions where `isCorrect === false`
- Dark mode can use Tailwind's `dark:` variant or context
- PWA uses `next-pwa` package

## Questions?

- Contact: akrjohn@gmail.com