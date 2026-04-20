---
name: development-workflow
description: >
  Follow Test-Driven Development (TDD) workflow for implementing features
  and fixes. Stages: triage, prepare, execute, finalize.
---

# Development Workflow

This skill follows a TDD workflow for implementing features and bug fixes.

## Stages

1. **TRIAGE** - Understand the issue
2. **PREPARE** - Set up and plan
3. **EXECUTE** - Implement with TDD
4. **FINALIZE** - Create PR

## How to Use

When asked to work on an issue:

1. Load the github-issue skill
2. Run TRIAGE to understand the issue
3. Prepare and implement
4. Create PR at the end

---

## Phase 0: TRIAGE

Understand what needs to be done:

1. **View Issue:** `gh issue view #<number>`
2. **Understand Requirements:** Read description, check checklist
3. **Explore Codebase:** Find relevant files using grep/glob
4. **Determine Approach:** Plan implementation

**Report back:**
- Confirm understanding
- Propose approach
- Ask if unclear

---

## Phase 1: PREPARE

Before writing code:

1. **Check Changes:** `git status` - clean or stash any uncommitted
2. **Create Branch:** `git checkout -b <type>/<issue>-<description>`
   - `feat/` for features
   - `fix/` for bugs
   - `chore/` for maintenance
3. **Run Tests:** Ensure clean baseline
4. **Plan Tasks:** Break into small, testable tasks

---

## Phase 2: EXECUTE

For each task (TDD cycle):

### RED - Write Failing Test
```bash
npm test
# Write/test new test - should FAIL
```

### GREEN - Write Minimal Code
```bash
# Write just enough code to pass
npm test
# Should PASS
```

### REFACTOR - Improve
```bash
# Improve code without changing behavior
npm test && npm run lint
```

### VERIFY - Confirm Complete
```bash
npm test && npm run lint && npm run build
```

### COMMIT - Save Progress
```bash
git add -A && git commit -m "<type>: description"
```

---

## Phase 3: FINALIZE

When all tasks complete:

1. **Final Verification:**
```bash
npm test && npm run lint && npm run build
```

2. **Push Branch:**
```bash
git push -u origin <branch>
```

3. **Create PR:**
```bash
gh pr create --title "<issue>: <title>" --base main --body-file /tmp/pr.md
```

4. **Wait for PR to Close:**
   - Do NOT close the issue until the PR is merged/closed
   - After PR merge, close the issue:
   ```bash
   gh issue close #<number> --comment "Completed in PR #<pr>"
   ```

---

## Commands Reference

```bash
# Run tests
npm test

# Run lint
npm run lint

# Build
npm run build

# Run all
npm test && npm run lint && npm run build
```

---

## Best Practices

- **Write tests first** - Red/Green cycle
- **Keep tests atomic** - One behavior per test
- **Commit frequently** - Small, working commits
- **Verify before commit** - Run lint + tests
- **Use descriptive titles** - Clear commit messages