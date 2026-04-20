export type QuestionType = 'reading' | 'vocabulary' | 'grammar' | 'writing';

export type QuestionFormat = 
  | 'single'        // Standard multiple-choice (1 correct answer)
  | 'two-part'      // Part A + Part B (evidence-based)
  | 'multi-select'; // Select all that apply (2+ correct)

export interface ReadingPassage {
  id: string;
  text: string;
  source: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  format: QuestionFormat;
  grade: number;
  standard: string;
  question: string;
  passage?: ReadingPassage;
  options: string[];
  correctAnswer: number | number[];  // single number or array for multi-select
  partBQuestion?: string;               // For two-part questions
  partBOptions?: string[];             // For two-part questions
  partBCorrectAnswer?: number;           // For two-part questions
  partBExplanation?: string;           // For two-part questions
  explanation: string;
}

export interface TestResult {
  questionId: string;
  selectedAnswer: number | number[] | null;  // support array for multi-select
  partBSelectedAnswer?: number | null;        // For two-part questions
  isCorrect: boolean;
  partBCorrect?: boolean;                     // For two-part questions
}

export interface ShortConstructedResponse {
  id: string;
  type: 'short-response';
  grade: number;
  standard: string;
  question: string;
  passage?: ReadingPassage;
  sampleAnswer?: string;
  rubric?: string;
}