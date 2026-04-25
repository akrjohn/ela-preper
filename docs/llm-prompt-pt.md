# LLM Prompt for Grade 3 ELA Performance Task

Generate one complete SBAC-aligned Grade 3 ELA Performance Task session.

## OUTPUT
Valid JSON object (not array).

## SCHEMA
```json
{
  "session": {
    "mode": "PT",
    "grade": 3,
    "subject": "ELA",
    "estimated_minutes": 75,
    "theme": "string"
  },
  "sources": [
    {
      "id": "source-1",
      "type": "informational|literary",
      "title": "string",
      "author": "string or 'Generated'",
      "text": "150-300 word passage",
      "source": "original"
    }
  ],
  "researchQuestions": [
    {
      "id": "rq-1",
      "question": "short answer prompt",
      "correctAnswer": "expected response outline",
      "points": 1
    }
  ],
  "writingPrompt": {
    "type": "informative|opinion|narrative",
    "task": "detailed writing prompt",
    "audience": "who the student writes for",
    "wordCountGuidance": "150-250 words"
  },
  "rubric": {
    "organization": {
      "score2": "description",
      "score1": "description", 
      "score0": "description"
    },
    "evidence": {
      "score2": "description",
      "score1": "description",
      "score0": "description"
    },
    "conventions": {
      "score2": "description",
      "score1": "description",
      "score0": "description"
    }
  }
}
```

## REQUIREMENTS

### Source Set
- 2-3 sources on a shared theme
- Mix: at least 1 informational, 1 literary
- Each source 150-300 words
- Thematic examples: animals helping each other, staying healthy, protecting the environment

### Research Questions
- 2 questions requiring specific details from sources
- Short answer format (1-3 sentences)
- 1 point each

### Writing Prompt
- Informational/explanatory OR opinion OR narrative
- Must reference sources
- Must specify audience

### Rubric
3 dimensions, each scored 0-2:
- Organization/Purpose
- Evidence/Elaboration  
- Conventions

Total: 0-6 points

## PROMPT COPY

```
Generate one Grade 3 ELA Performance Task session.

OUTPUT: Valid JSON object only - no intro text, no code blocks.

Theme: [ pick an age-appropriate theme like "how people help animals" or "staying safe during severe weather" ]

Create 2-3 thematically linked sources (150-300 words each):
- Source 1: Informational (science, social studies, how-to)
- Source 2: Literary (short story, poem)
- Source 3 (optional): Additional informational

Include 2 research questions that require students to cite specific details from sources.

Include 1 writing prompt that:
- References the sources
- Specifies an audience (e.g., "your class," "younger students")
- Specifies the type: informative/explanatory, opinion, or narrative

Include a 3-dimension rubric (Organization, Evidence, Conventions), each scored 0-2.

Output as single JSON object.
```