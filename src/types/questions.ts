export type QuestionType = 'reading' | 'vocabulary' | 'grammar' | 'writing';

export type QuestionFormat = 
  | 'single'        // Standard multiple-choice (1 correct answer)
  | 'two-part'      // Part A + Part B (evidence-based)
  | 'multi-select'  // Select all that apply (2+ correct)
  | 'inline'        // TEI: Dropdown in text
  | 'numeric_entry' // TEI: Number input
  | 'drag_order';   // TEI: Drag to reorder

export type SBACClaim = '1' | '2' | '3' | '4';  // Reading, Writing, Listening, Research

export type DOKLevel = 1 | 2 | 3;  // Depth of Knowledge

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
  claim: SBACClaim;
  target?: string;
  dok?: DOKLevel;
  question: string;
  passage?: ReadingPassage;
  options: string[];
  correctAnswer: number | number[];
  partBQuestion?: string;
  partBOptions?: string[];
  partBCorrectAnswer?: number;
  partBExplanation?: string;
  explanation: string;
  rubric?: QuestionRubric;
  
  // TEI Inline fields
  inlineOptions?: string[][];
  orderedItems?: string[];
}

export interface QuestionRubric {
  score2?: string;
  score1?: string;
  score0?: string;
  sampleResponse?: string;
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