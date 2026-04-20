import {
  shuffleArray,
  shuffleOptions,
  selectRandomQuestions,
  gradeQuestions,
  checkAnswer,
  checkTwoPartAnswer,
  calculateScore,
} from './questions';
import { Question } from '@/types/questions';

const mockQuestion: Question = {
  id: 'q1',
  type: 'reading',
  format: 'single',
  grade: 3,
  standard: 'CCSS.ELA-LITERACY.RL.3.1',
  question: 'Test question?',
  passage: { id: 'p1', text: 'Test passage', source: 'original' },
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 2,
  explanation: 'Because',
};

const mockMultiSelect: Question = {
  id: 'q2',
  type: 'reading',
  format: 'multi-select',
  grade: 3,
  standard: 'CCSS.ELA-LITERACY.RI.3.1',
  question: 'Select TWO...',
  passage: { id: 'p2', text: 'Test passage', source: 'original' },
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: [0, 2],
  explanation: 'Because',
};

const mockTwoPart: Question = {
  id: 'q3',
  type: 'reading',
  format: 'two-part',
  grade: 3,
  standard: 'CCSS.ELA-LITERACY.RL.3.1',
  question: 'Part A question?',
  passage: { id: 'p3', text: 'Test passage', source: 'original' },
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 1,
  partBQuestion: 'Part B question?',
  partBOptions: ['sentence 1', 'sentence 2', 'sentence 3', 'sentence 4'],
  partBCorrectAnswer: 2,
  partBExplanation: 'Evidence',
  explanation: 'Because',
};

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result).toHaveLength(5);
  });

  it('should contain all same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result.sort()).toEqual(arr);
  });

  it('should not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });
});

describe('shuffleOptions', () => {
  it('should shuffle options for single format', () => {
    const result = shuffleOptions(mockQuestion);
    expect(result.options).toHaveLength(4);
    expect(result.options).toContain('A');
    expect(result.options).toContain('B');
    expect(result.options).toContain('C');
    expect(result.options).toContain('D');
  });

  it('should preserve correct answer after shuffle', () => {
    const result = shuffleOptions(mockQuestion);
    expect(result.options[result.correctAnswer]).toBe('C');
  });

  it('should handle multi-select questions', () => {
    const result = shuffleOptions(mockMultiSelect);
    expect(Array.isArray(result.correctAnswer)).toBe(true);
    const correctTexts = (mockMultiSelect.correctAnswer as number[]).map(
      i => mockMultiSelect.options[i]
    );
    const newCorrect = result.correctAnswer as number[];
    expect(newCorrect.map(i => result.options[i])).toEqual(correctTexts);
  });
});

describe('selectRandomQuestions', () => {
  const questions = Array.from({ length: 10 }, (_, i) => ({
    ...mockQuestion,
    id: `q${i}`,
  }));

  it('should return requested number of questions', () => {
    const result = selectRandomQuestions(questions, 5);
    expect(result).toHaveLength(5);
  });

  it('should not exceed available questions', () => {
    const result = selectRandomQuestions(questions, 20);
    expect(result).toHaveLength(10);
  });

  it('should shuffle options for each question', () => {
    const result = selectRandomQuestions(questions, 5);
    result.forEach(q => {
      expect(q.options).toBeDefined();
    });
  });
});

describe('gradeQuestions', () => {
  const questions: Question[] = [
    { ...mockQuestion, id: 'q1', grade: 3 },
    { ...mockQuestion, id: 'q2', grade: 4 },
    { ...mockQuestion, id: 'q3', grade: 3 },
  ];

  it('should filter questions by grade', () => {
    const result = gradeQuestions(questions, 3);
    expect(result).toHaveLength(2);
  });

  it('should return empty array for non-matching grade', () => {
    const result = gradeQuestions(questions, 5);
    expect(result).toHaveLength(0);
  });
});

describe('checkAnswer', () => {
  it('should return true for correct single answer', () => {
    expect(checkAnswer(mockQuestion, 2)).toBe(true);
  });

  it('should return false for incorrect single answer', () => {
    expect(checkAnswer(mockQuestion, 0)).toBe(false);
  });

  it('should return false for null answer', () => {
    expect(checkAnswer(mockQuestion, null)).toBe(false);
  });

  it('should handle multi-select correct answers', () => {
    expect(checkAnswer(mockMultiSelect, [0, 2])).toBe(true);
  });

  it('should reject partial multi-select answers', () => {
    expect(checkAnswer(mockMultiSelect, [0])).toBe(false);
  });

  it('should reject wrong multi-select answers', () => {
    expect(checkAnswer(mockMultiSelect, [1, 3])).toBe(false);
  });
});

describe('checkTwoPartAnswer', () => {
  it('should return correct for both parts correct', () => {
    const result = checkTwoPartAnswer(mockTwoPart, 1, 2);
    expect(result.partACorrect).toBe(true);
    expect(result.partBCorrect).toBe(true);
    expect(result.bothCorrect).toBe(true);
  });

  it('should return incorrect when only Part A correct', () => {
    const result = checkTwoPartAnswer(mockTwoPart, 1, 0);
    expect(result.partACorrect).toBe(true);
    expect(result.partBCorrect).toBe(false);
    expect(result.bothCorrect).toBe(false);
  });

  it('should return incorrect when only Part B correct', () => {
    const result = checkTwoPartAnswer(mockTwoPart, 0, 2);
    expect(result.partACorrect).toBe(false);
    expect(result.partBCorrect).toBe(true);
    expect(result.bothCorrect).toBe(false);
  });
});

describe('calculateScore', () => {
  const questions = [mockQuestion, mockMultiSelect, mockTwoPart];

  it('should calculate correct score for single questions', () => {
    const answers = new Map([['q1', 2]]);
    const result = calculateScore(questions, answers);
    expect(result.correct).toBe(1); // q1 correct
    expect(result.total).toBe(3);
    expect(result.percentage).toBe(33);
  });

  it('should calculate correct score for multi-select', () => {
    const answers = new Map([
      ['q1', 2],
      ['q2', [0, 2]],
    ]);
    const result = calculateScore(questions, answers);
    expect(result.correct).toBe(2); // q1 and q2 correct
    expect(result.percentage).toBe(67);
  });

  it('should handle two-part questions (requires both parts correct)', () => {
    const answers = new Map([
      ['q1', 2],
      ['q2', [0, 2]],
    ]);
    const partBAnswers = new Map([['q3', 2]]);
    const result = calculateScore(questions, answers, partBAnswers);
    // q1 correct, q2 correct, q3 only Part B correct (not both) = 2
    expect(result.correct).toBe(2);
    expect(result.percentage).toBe(67);
  });

  it('should give full score when both parts of two-part are correct', () => {
    const answers = new Map([
      ['q1', 2],
      ['q2', [0, 2]],
      ['q3', 1], // Part A correct
    ]);
    const partBAnswers = new Map([['q3', 2]]); // Part B correct
    const result = calculateScore(questions, answers, partBAnswers);
    expect(result.correct).toBe(3);
    expect(result.percentage).toBe(100);
  });

  it('should calculate 0 percentage for no correct', () => {
    const answers = new Map([
      ['q1', 0],
      ['q2', [1, 3]],
    ]);
    const result = calculateScore(questions, answers);
    expect(result.percentage).toBe(0);
  });
});