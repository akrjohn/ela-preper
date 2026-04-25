'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Question, TestResult } from '@/types/questions';
import { formatTime } from '@/utils/questions';
import grade3Questions from '@/data/questions-grade3.json';
import grade4Questions from '@/data/questions-grade4.json';
import grade5Questions from '@/data/questions-grade5.json';
import mathGrade3Questions from '@/data/questions-math-grade3.json';

type TestState = 'setup' | 'testing' | 'results';
type ReviewMode = 'full' | 'missed';
type TestSubject = 'ela' | 'math';

const QUESTION_COUNT_OPTIONS = [5, 8, 10, 15];
const TIMER_OPTIONS = [
  { value: 0, label: 'No timer' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
];

export default function Home() {
  const [testState, setTestState] = useState<TestState>('setup');
  const [testSubject, setTestSubject] = useState<TestSubject>('ela');
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [questionCount, setQuestionCount] = useState<number>(8);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const submitTestRef = useRef<() => void>(() => {});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Map<string, number | number[]>>(new Map());
  const [partBAnswers, setPartBAnswers] = useState<Map<string, number>>(new Map());
  const [results, setResults] = useState<TestResult[]>([]);
  const [lastMissedQuestions, setLastMissedQuestions] = useState<Question[]>([]);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('full');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<{date: string; grade: number; score: number; total: number; percentage: number}[]>([]);

  const processSessionByStandard = useCallback(() => {
    const standardCounts: Record<string, {correct: number; total: number}> = {};
    
    filteredQuestions.forEach((q, index) => {
      const result = results[index];
      const standard = q.standard;
      
      if (!standardCounts[standard]) {
        standardCounts[standard] = { correct: 0, total: 0 };
      }
      
      standardCounts[standard].total += 1;
      if (result?.isCorrect) {
        standardCounts[standard].correct += 1;
      }
    });
    
    return standardCounts;
  }, [filteredQuestions, results]);

  const getWeakStandards = useCallback(() => {
    const standardCounts = processSessionByStandard();
    return Object.entries(standardCounts)
      .filter(([, data]) => data.total > 0 && data.correct / data.total < 0.7)
      .map(([standard]) => standard);
  }, [processSessionByStandard]);

  const processSessionByClaim = useCallback(() => {
    const claimCounts: Record<string, {correct: number; total: number}> = {};
    
    filteredQuestions.forEach((q, index) => {
      const result = results[index];
      const claim = q.claim || '1';
      
      if (!claimCounts[claim]) {
        claimCounts[claim] = { correct: 0, total: 0 };
      }
      
      claimCounts[claim].total += 1;
      if (result?.isCorrect) {
        claimCounts[claim].correct += 1;
      }
    });
    
    return claimCounts;
  }, [filteredQuestions, results]);

  const processSessionByDOK = useCallback(() => {
    const dokCounts: Record<string, {correct: number; total: number}> = {};
    
    filteredQuestions.forEach((q, index) => {
      const result = results[index];
      const dok = String(q.dok || 2);
      
      if (!dokCounts[dok]) {
        dokCounts[dok] = { correct: 0, total: 0 };
      }
      
      dokCounts[dok].total += 1;
      if (result?.isCorrect) {
        dokCounts[dok].correct += 1;
      }
    });
    
    return dokCounts;
  }, [filteredQuestions, results]);

  const getPerformanceLevel = (percentage: number): string => {
    if (percentage >= 80) return 'Advanced';
    if (percentage >= 60) return 'Proficient';
    if (percentage >= 40) return 'Developing';
    return 'Insufficient';
  };

  const claimLabels: Record<string, string> = {
    '1': 'Reading',
    '2': 'Writing',
    '3': 'Listening',
    '4': 'Research'
  };

  const saveProgress = useCallback((currentAnswers: Map<string, number | number[]>) => {
    const progressData = {
      grade: selectedGrade,
      answers: Array.from(currentAnswers.entries()),
      partBAnswers: Array.from(partBAnswers.entries()),
      questionCount,
      timerMinutes,
    };
    localStorage.setItem('ela-saved-progress', JSON.stringify(progressData));
  }, [selectedGrade, partBAnswers, questionCount, timerMinutes]);

  const loadQuestions = (grade: number, subject: TestSubject = 'ela'): Question[] => {
    if (subject === 'math') {
      return mathGrade3Questions as unknown as Question[];
    }
    
    let allQuestions: Question[] = [];
    switch (grade) {
      case 3:
        allQuestions = grade3Questions as unknown as Question[];
        break;
      case 4:
        allQuestions = grade4Questions as unknown as Question[];
        break;
      case 5:
        allQuestions = grade5Questions as unknown as Question[];
        break;
      default:
        allQuestions = grade3Questions as unknown as Question[];
    }
    return allQuestions;
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

  useEffect(() => {
    const saved = localStorage.getItem('ela-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'true' || (saved === null && prefersDark);
    requestAnimationFrame(() => setDarkMode(shouldBeDark));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ela-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ela-dark-mode', 'false');
    }
  }, [darkMode]);

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

    const missedQs = filteredQuestions.filter((q, i) => !testResults[i]?.isCorrect);
    setLastMissedQuestions(missedQs);
  };

  const startReviewMode = () => {
    const missed = lastMissedQuestions;
    if (missed.length === 0) return;
    
    const withShuffledOptions = missed.map(shuffleOptions);
    setFilteredQuestions(withShuffledOptions);
    setAnswers(new Map());
    setPartBAnswers(new Map());
    setCurrentQuestionIndex(0);
    setResults([]);
    setReviewMode('missed');
    setTestState('testing');
  };

  useEffect(() => {
    submitTestRef.current = submitTest;
  }, [submitTest]);

  useEffect(() => {
    if (testState === 'testing' && timerMinutes > 0 && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            submitTestRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, timerMinutes, timeRemaining]);

  useEffect(() => {
    if (testState !== 'testing') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentQuestionIndex < filteredQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
        }
      } else if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        const optionIndex = parseInt(e.key) - 1;
        if (currentQuestionIndex < filteredQuestions.length && 
            optionIndex < filteredQuestions[currentQuestionIndex]?.options.length) {
          setAnswers(prev => {
            const q = filteredQuestions[currentQuestionIndex];
            const updated = new Map(prev).set(q.id, optionIndex);
            saveProgress(updated);
            return updated;
          });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        submitTestRef.current();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testState, currentQuestionIndex, filteredQuestions.length]);

  const startTest = () => {
    const allQuestions = loadQuestions(selectedGrade, testSubject);
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, questionCount);
    const withShuffledOptions = selected.map(shuffleOptions);
    setFilteredQuestions(withShuffledOptions);
    setAnswers(new Map());
    setPartBAnswers(new Map());
    setCurrentQuestionIndex(0);
    setResults([]);
    setTimeRemaining(timerMinutes > 0 ? timerMinutes * 60 : 0);
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
      setAnswers(prev => {
        const updated = new Map(prev).set(question.id, newSelection);
        saveProgress(updated);
        return updated;
      });
    } else {
      setAnswers(prev => {
        const updated = new Map(prev).set(question.id, answerIndex);
        saveProgress(updated);
        return updated;
      });
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

  const restartTest = () => {
    setTestState('setup');
    setResults([]);
    setLastMissedQuestions([]);
    setReviewMode('full');
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
          <div className="absolute top-4 right-4">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try {
                    const saved = localStorage.getItem('ela-test-results');
                    if (saved) {
                      const data = JSON.parse(saved);
                      setSessionHistory([{
                        date: data.date,
                        grade: data.grade,
                        score: data.score,
                        total: data.total,
                        percentage: data.percentage,
                      }]);
                    }
                  } catch {}
                }
                setShowAnalytics(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
              aria-label="View Analytics"
            >
              View Past Scores
            </button>
          </div>
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2 text-center">
            {testSubject === 'math' ? 'Math' : 'ELA'} Practice Test
          </h1>
          <p className="text-zinc-600 mb-4">California State Standards aligned questions</p>
          
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Select Subject
          </label>
          <select
            value={testSubject}
            onChange={(e) => setTestSubject(e.target.value as TestSubject)}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-4 bg-white text-zinc-900"
          >
            <option value="ela">English Language Arts</option>
            <option value="math">Math</option>
          </select>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Select Grade Level
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value))}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-4 bg-white text-zinc-900"
          >
            <option value={3}>Grade 3</option>
            {testSubject === 'ela' && <option value={4}>Grade 4</option>}
            {testSubject === 'ela' && <option value={5}>Grade 5</option>}
          </select>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Number of Questions
          </label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-4 bg-white text-zinc-900"
          >
            {QUESTION_COUNT_OPTIONS.map(count => (
              <option key={count} value={count}>{count} questions</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Timer (optional)
          </label>
          <select
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(Number(e.target.value))}
            className="w-full p-3 border border-zinc-300 rounded-lg mb-6 bg-white text-zinc-900"
          >
            {TIMER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            {timerMinutes > 0 && (
              <span className={`font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-zinc-600'}`}>
                Time: {formatTime(timeRemaining)}
              </span>
            )}
            {timerMinutes === 0 && <span></span>}
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
                  <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 text-center leading-8 mr-3 font-medium">
                    {isMultiSelect ? (
                      <span className={isOptionSelected(index) ? 'text-emerald-600' : ''}>
                        {isOptionSelected(index) ? '✓' : String.fromCharCode(65 + index)}
                      </span>
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="text-zinc-900">{option}</span>
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
                      <span className="inline-block w-8 h-8 rounded-full bg-zinc-100 text-zinc-900 text-center leading-8 mr-3 font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-zinc-900">{option}</span>
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

  if (testState === 'results' || showAnalytics) {
    if (showAnalytics) {
      const standardData = processSessionByStandard();
      const weakStandards = getWeakStandards();
      const claimData = processSessionByClaim();
      const dokData = processSessionByDOK();
      const totalCorrect = Object.values(claimData).reduce((sum, d) => sum + d.correct, 0);
      const totalQuestions2 = Object.values(claimData).reduce((sum, d) => sum + d.total, 0);
      const percentage = totalQuestions2 > 0 ? Math.round((totalCorrect / totalQuestions2) * 100) : 0;
      
      console.log('DOK data:', dokData);
      
      return (
        <div className="min-h-screen bg-zinc-50 font-sans p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-800">Session Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-zinc-500 hover:text-zinc-700 text-xl"
                >
                  ✕
                </button>
              </div>
              
              {weakStandards.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2">Focus on these standards:</h3>
                  <div className="flex flex-wrap gap-2">
                    {weakStandards.map(standard => (
                      <span
                        key={standard}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        {standard.replace('CCSS.ELA-LITERACY.', '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Performance Level: {getPerformanceLevel(percentage)}
                </h3>
                <p className="text-sm text-blue-700">
                  {percentage >= 80 ? 'Excellent work!' : 
                   percentage >= 60 ? 'Good progress! Keep practicing.' : 
                   'Keep working on these areas.'}
                </p>
              </div>
              
              <h3 className="font-medium text-zinc-700 mb-2">By SBAC Claim</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(processSessionByClaim()).map(([claim, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={claim} className="p-3 bg-zinc-50 rounded-lg">
                      <div className="text-sm text-zinc-600">{claimLabels[claim] || `Claim ${claim}`}</div>
                      <div className="font-bold text-zinc-800">{data.correct}/{data.total}</div>
                      <div className={`text-xs ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="font-medium text-zinc-700 mb-2">By DOK Level</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.entries(processSessionByDOK()).map(([dok, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={dok} className="p-3 bg-zinc-50 rounded-lg">
                      <div className="text-sm text-zinc-600">DOK {dok}</div>
                      <div className="font-bold text-zinc-800">{data.correct}/{data.total}</div>
                      <div className={`text-xs ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="font-medium text-zinc-700 mb-4">Performance by Standard</h3>
              <div className="space-y-3">
                {Object.entries(standardData).map(([standard, data]) => {
                  const percentage = Math.round((data.correct / data.total) * 100);
                  const colorClass = percentage >= 70 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500';
                  
                  return (
                    <div key={standard}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700">{standard.replace('CCSS.ELA-LITERACY.', '')}</span>
                        <span className="text-zinc-600">{data.correct}/{data.total} ({percentage}%)</span>
                      </div>
                      <div className="h-3 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colorClass} rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {sessionHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <h3 className="font-medium text-zinc-700 mb-4">Session History</h3>
                  <div className="space-y-2">
                    {sessionHistory.map((session, index) => (
                      <div key={index} className="flex justify-between text-sm p-3 bg-zinc-50 rounded-lg">
                        <span className="text-zinc-600">
                          {new Date(session.date).toLocaleDateString()} - Grade {session.grade}
                        </span>
                        <span className="font-medium">
                          {session.score}/{session.total} ({session.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => {
                  localStorage.removeItem('ela-test-results');
                  setSessionHistory([]);
                  alert('History cleared');
                }}
                className="w-full mt-6 bg-zinc-200 text-zinc-700 py-2 px-4 rounded-lg font-medium hover:bg-zinc-300 transition-colors text-sm"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      );
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    const incorrectCount = totalQuestions - score;

    return (
      <div className="min-h-screen bg-zinc-50 font-sans p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">
              {reviewMode === 'missed' ? 'Review Mode' : 'Test Complete!'}
            </h2>
            
            <div className="text-5xl font-bold text-emerald-600 mb-2">{percentage}%</div>
            <p className="text-zinc-600 mb-6">
              {score} out of {totalQuestions} correct
            </p>
            
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{score}</div>
                <div className="text-sm text-zinc-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-sm text-zinc-500">Incorrect</div>
              </div>
            </div>
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

          <div className="space-y-3">
            <button
              onClick={restartTest}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Take Another Test
            </button>
            
            {lastMissedQuestions.length > 0 && (
              <button
                onClick={startReviewMode}
                className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                Review {lastMissedQuestions.length} Missed Question{lastMissedQuestions.length > 1 ? 's' : ''}
              </button>
            )}
            
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try {
                    const saved = localStorage.getItem('ela-test-results');
                    if (saved) {
                      const data = JSON.parse(saved);
                      setSessionHistory([{
                        date: data.date,
                        grade: data.grade,
                        score: data.score,
                        total: data.total,
                        percentage: data.percentage,
                      }]);
                    }
                  } catch {}
                }
                setShowAnalytics(true);
              }}
              className="w-full bg-zinc-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-zinc-700 transition-colors"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}