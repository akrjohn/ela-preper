---
name: github-issue
description: >
  Create and manage GitHub issues. Use when you need to create issues,
  list issues, add labels, or close issues. Follows best practices for
  issue creation with proper formatting.
---

# GitHub Issue Creator

This skill handles creating GitHub issues using best practices.

## Workflow

1. **Identify Issue Type**: Determine if bug, feature, enhancement, etc.
2. **Check for Templates**: Look for `.github/ISSUE_TEMPLATE/` directory
   - Use existing templates if available
   - If no template, create a well-structured issue
3. **Draft Content**: Prepare title and body
4. **Create Issue**: Use `gh` CLI with proper formatting
5. **Verify**: Confirm creation and provide link

## Principles

- **Clarity**: Descriptive titles following project conventions
- **Formatting**: Always use `--body-file` for multi-line content
- **Labels**: Add appropriate labels (enhancement, bug, etc.)

## Commands

```bash
# Create issue with body file
gh issue create --title "Title" --body-file /path/to/body.md --label "enhancement"

# List issues
gh issue list

# View issue
gh issue view 123

# Add label
gh issue edit 123 --add-label "enhancement"
```

## Best Practice

Always write the body to a temp file first, then use `--body-file`:

```bash
cat > /tmp/issue-body.md << 'EOF'
## Description
...

## Checklist
- [ ] ...
EOF

gh issue create --title "Feature: X" --body-file /tmp/issue-body.md --label "enhancement"
rm /tmp/issue-body.md
```