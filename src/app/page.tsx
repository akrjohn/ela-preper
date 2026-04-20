'use client';

import { useState, useEffect } from 'react';
import { Question, TestResult } from '@/types/questions';
import grade3Questions from '@/data/questions-grade3.json';

type TestState = 'setup' | 'testing' | 'results';

const QUESTION_COUNT_OPTIONS = [5, 8, 10, 15];

export default function Home() {
  const [testState, setTestState] = useState<TestState>('setup');
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Map<string, number | number[]>>(new Map());
  const [partBAnswers, setPartBAnswers] = useState<Map<string, number>>(new Map());
  const [results, setResults] = useState<TestResult[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  const loadQuestions = (grade: number): Question[] => {
    const allQuestions = grade3Questions as unknown as Question[];
    return allQuestions.filter(q => q.grade === grade);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleOptions = (question: Question): Question => {
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

  useEffect(() => {
    const saved = localStorage.getItem('ela-test-results');
    if (saved) {
      console.log('Found saved test results');
    }
  }, []);

  const startTest = () => {
    const allQuestions = loadQuestions(selectedGrade);
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, questionCount);
    const withShuffledOptions = selected.map(shuffleOptions);
    setFilteredQuestions(withShuffledOptions);
    setAnswers(new Map());
    setPartBAnswers(new Map());
    setCurrentQuestionIndex(0);
    setResults([]);
    setTestState('testing');
  };

  const selectAnswer = (answerIndex: number) => {
    if (testState !== 'testing') return;
    const question = filteredQuestions[currentQuestionIndex];
    const format = question.format || 'single';
    
    if (format === 'multi-select') {
      const current = (answers.get(question.id) as number[]) || [];
      const newSelection = current.includes(answerIndex)
        ? current.filter(i => i !== answerIndex)
        : [...current, answerIndex];
      setAnswers(prev => new Map(prev).set(question.id, newSelection));
    } else {
      setAnswers(prev => new Map(prev).set(question.id, answerIndex));
    }
  };

  const selectPartBAnswer = (answerIndex: number) => {
    if (testState !== 'testing') return;
    const question = filteredQuestions[currentQuestionIndex];
    setPartBAnswers(prev => new Map(prev).set(question.id, answerIndex));
  };

  const isOptionSelected = (answerIndex: number): boolean => {
    const question = filteredQuestions[currentQuestionIndex];
    const format = question.format || 'single';
    const answer = answers.get(question.id) ?? null;
    
    if (format === 'multi-select') {
      return (answer as number[])?.includes(answerIndex) || false;
    }
    return answer === answerIndex;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTest = () => {
    const testResults: TestResult[] = filteredQuestions.map(q => {
      const selectedAnswer = answers.get(q.id) ?? null;
      const format = q.format || 'single';
      
      let isCorrect = false;
      if (format === 'multi-select') {
        const correct = q.correctAnswer as number[];
        const selected = (selectedAnswer as number[]) || [];
        isCorrect = correct.length === selected.length && 
          correct.every(c => selected.includes(c));
      } else {
        isCorrect = selectedAnswer === q.correctAnswer;
      }
      
      let partBCorrect: boolean | undefined;
      let partBSelectedAnswerVal: number | null;
      if (format === 'two-part') {
        partBSelectedAnswerVal = partBAnswers.get(q.id) ?? null;
        partBCorrect = partBSelectedAnswerVal === q.partBCorrectAnswer;
        isCorrect = isCorrect && partBCorrect;
      } else {
        partBSelectedAnswerVal = null;
      }
      
      return {
        questionId: q.id,
        selectedAnswer,
        partBSelectedAnswer: partBSelectedAnswerVal,
        isCorrect,
        partBCorrect,
      };
    });
    setResults(testResults);

    const score = testResults.filter(r => r.isCorrect).length;
    const total = testResults.length;
    const percentage = Math.round((score / total) * 100);

    localStorage.setItem('ela-test-results', JSON.stringify({
      date: new Date().toISOString(),
      grade: selectedGrade,
      score,
      total,
      percentage,
      results: testResults,
    }));

    setTestState('results');
  };

  const restartTest = () => {
    setTestState('setup');
    setResults([]);
    setAnswers(new Map());
    setPartBAnswers(new Map());
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const partBSelectedAnswer = currentQuestion ? (partBAnswers.get(currentQuestion.id) ?? null) : null;
  const answeredCount = answers.size;
  const totalQuestions = filteredQuestions.length;
  const score = results.filter(r => r.isCorrect).length;
  const format = currentQuestion?.format || 'single';

  if (testState === 'setup') {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="ELA Prep Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-800 mb-2 text-center">ELA Practice Test</h1>
          <p className="text-zinc-600 mb-6">California State Standards aligned questions</p>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Select Grade Level
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value))}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-4 bg-white"
          >
            <option value={3}>Grade 3</option>
            <option value={4} disabled>Grade 4 (coming soon)</option>
            <option value={5} disabled>Grade 5 (coming soon)</option>
          </select>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Number of Questions
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-6 bg-white"
          >
            {QUESTION_COUNT_OPTIONS.map(count => (
              <option key={count} value={count}>{count} questions</option>
            ))}
          </select>

          <button
            onClick={startTest}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Start Test
          </button>

          <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
            <p className="text-sm text-zinc-500 mb-2">Have questions or feedback?</p>
            <a
              href="mailto:akrjohn@gmail.com?subject=ELA%20Practice%20Feedback"
              className="text-emerald-600 hover:text-emerald-700 text-sm underline"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (testState === 'testing' && currentQuestion) {
    const isMultiSelect = format === 'multi-select';
    
    return (
      <div className="min-h-screen bg-zinc-50 font-sans p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-zinc-600">
              {answeredCount} answered
            </span>
          </div>

          <div className="w-full bg-zinc-200 rounded-full h-2 mb-6">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            {currentQuestion.passage && currentQuestion.passage.text !== 'N/A' && (
              <div className="mb-4 p-4 bg-zinc-50 rounded-lg">
                <p className="text-sm text-zinc-500 mb-2">Reading Passage</p>
                <p className="text-zinc-800 leading-relaxed">{currentQuestion.passage.text}</p>
              </div>
            )}

            <div className="mb-2 flex gap-2">
              <span className="text-xs uppercase tracking-wide text-emerald-600 font-medium">
                {currentQuestion.type}
              </span>
              {isMultiSelect && (
                <span className="text-xs uppercase tracking-wide text-blue-600 font-medium">
                  Select all that apply
                </span>
              )}
              {format === 'two-part' && (
                <span className="text-xs uppercase tracking-wide text-purple-600 font-medium">
                  Two-Part
                </span>
              )}
              <span className="text-xs text-zinc-400">Grade {currentQuestion.grade}</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-800 mb-4">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isOptionSelected(index)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-center leading-8 mr-3 font-medium">
                    {isMultiSelect ? (
                      <span className={isOptionSelected(index) ? 'text-emerald-600' : ''}>
                        {isOptionSelected(index) ? '✓' : String.fromCharCode(65 + index)}
                      </span>
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {format === 'two-part' && currentQuestion.partBQuestion && (
              <div className="mt-6 pt-6 border-t border-zinc-200">
                <p className="text-sm text-zinc-500 mb-2">Part B: Evidence-Based</p>
                <h3 className="text-lg font-medium text-zinc-800 mb-3">{currentQuestion.partBQuestion}</h3>
                <div className="space-y-3">
                  {currentQuestion.partBOptions?.map((option, index) => (
                    <button
                      key={`partb-${index}`}
                      onClick={() => selectPartBAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        partBSelectedAnswer === index
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-700 text-center leading-8 mr-3 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border border-zinc-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
            >
              Previous
            </button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={submitTest}
                disabled={answeredCount < totalQuestions}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (testState === 'results') {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-zinc-50 font-sans p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">Test Complete!</h2>
            <div className="text-5xl font-bold text-emerald-600 mb-2">{percentage}%</div>
            <p className="text-zinc-600">
              You got {score} out of {totalQuestions} questions correct
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {filteredQuestions.map((q, index) => {
              const result = results[index];
              const userAnswer = result?.selectedAnswer;
              const format = q.format || 'single';
              const isMultiSelect = format === 'multi-select';

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
                    result?.isCorrect ? 'border-emerald-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-2xl ${result?.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                      {result?.isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-zinc-800 mb-2">{q.question}</p>

                      {userAnswer !== undefined && userAnswer !== null && (
                        <p className="text-sm mb-1">
                          <span className="text-zinc-500">Your answer: </span>
                          <span className={result?.isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                            {isMultiSelect 
                              ? (userAnswer as number[]).map(i => q.options[i]).join(', ')
                              : q.options[userAnswer as number]
                            }
                          </span>
                        </p>
                      )}

                      {!result?.isCorrect && (
                        <p className="text-sm text-emerald-600">
                          <span className="text-zinc-500">Correct answer: </span>
                          {isMultiSelect 
                            ? (q.correctAnswer as number[]).map(i => q.options[i]).join(', ')
                            : q.options[q.correctAnswer as number]
                          }
                        </p>
                      )}

                      {format === 'two-part' && (
                        <>
                          <p className="text-sm mt-2">
                            <span className="text-zinc-500">Part B: </span>
                            <span className={result?.partBCorrect ? 'text-emerald-600' : 'text-red-600'}>
                              {q.partBOptions?.[result?.partBSelectedAnswer as number]}
                            </span>
                          </p>
                          {!result?.partBCorrect && (
                            <p className="text-sm text-emerald-600">
                              <span className="text-zinc-500">Correct Part B: </span>
                              {q.partBOptions?.[q.partBCorrectAnswer as number]}
                            </p>
                          )}
                        </>
                      )}

                      <div className="mt-3 p-3 bg-zinc-50 rounded-lg">
                        <p className="text-sm text-zinc-600">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={restartTest}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  return null;
}