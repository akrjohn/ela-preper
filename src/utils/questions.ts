import { Question } from '@/types/questions';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffleOptions = (question: Question): Question => {
  const format = question.format || 'single';
  
  if (format === 'multi-select' && Array.isArray(question.correctAnswer)) {
    const correctTexts = question.correctAnswer.map(i => question.options[i]);
    const shuffledOps = shuffleArray(question.options);
    const newCorrectIndices = correctTexts.map(text => shuffledOps.indexOf(text));
    return { ...question, options: shuffledOps, correctAnswer: newCorrectIndices };
  }
  
  const correctAnswerText = question.options[question.correctAnswer as number];
  const shuffledOps = shuffleArray(question.options);
  const newCorrectIndex = shuffledOps.indexOf(correctAnswerText);
  return { ...question, options: shuffledOps, correctAnswer: newCorrectIndex };
};

export const selectRandomQuestions = (
  questions: Question[],
  count: number
): Question[] => {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count).map(shuffleOptions);
};

export const gradeQuestions = (
  questions: Question[],
  grade: number
): Question[] => {
  return questions.filter(q => q.grade === grade);
};

export const checkAnswer = (
  question: Question,
  selectedAnswer: number | number[] | null
): boolean => {
  if (selectedAnswer === null) return false;
  
  const format = question.format || 'single';
  
  if (format === 'multi-select') {
    const correct = question.correctAnswer as number[];
    const selected = (selectedAnswer as number[]) || [];
    return correct.length === selected.length && 
      correct.every(c => selected.includes(c));
  }
  
  return selectedAnswer === question.correctAnswer;
};

export const checkTwoPartAnswer = (
  question: Question,
  partAAnswer: number | null,
  partBAnswer: number | null
): { partACorrect: boolean; partBCorrect: boolean; bothCorrect: boolean } => {
  const partACorrect = partAAnswer === question.correctAnswer;
  const partBCorrect = partBAnswer === question.partBCorrectAnswer;
  
  return {
    partACorrect,
    partBCorrect,
    bothCorrect: partACorrect && partBCorrect,
  };
};

export const calculateScore = (
  questions: Question[],
  answers: Map<string, number | number[]>,
  partBAnswers?: Map<string, number>
): { correct: number; total: number; percentage: number } => {
  let correct = 0;
  
  questions.forEach(q => {
    const answer = answers.get(q.id) ?? null;
    const format = q.format || 'single';
    
    if (format === 'two-part') {
      const partACorrect = answer === q.correctAnswer;
      const partBCorrect = partBAnswers?.get(q.id) === q.partBCorrectAnswer;
      if (partACorrect && partBCorrect) correct++;
    } else if (checkAnswer(q, answer)) {
      correct++;
    }
  });
  
  const total = questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return { correct, total, percentage };
};