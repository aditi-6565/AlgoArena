import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions.js';
import { recordQuizScore } from '../../core/storage/progressStorage.js';
import { Trophy, CheckCircle, XCircle, RotateCcw, ArrowRight, Sparkles, Filter } from 'lucide-react';

export function PracticeQuizModule({ onProgressUpdated }) {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const topics = ['All', 'Sorting', 'Searching', 'Data Structures', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuestions = QUIZ_QUESTIONS.filter(q => {
    const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchTopic && matchDiff;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.answerIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    } else {
      setWrongQuestions(prev => [...prev, currentQ]);
    }
    setAnsweredCount(c => c + 1);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizComplete(true);
      const finalScore = score + (selectedOption === currentQ.answerIndex ? 0 : 0);
      recordQuizScore(selectedTopic, score, filteredQuestions.length);
      if (onProgressUpdated) onProgressUpdated();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setAnsweredCount(0);
    setWrongQuestions([]);
    setIsQuizComplete(false);
  };

  if (!currentQ || filteredQuestions.length === 0) {
    return (
      <div className="panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p>No questions found matching topic <b>{selectedTopic}</b> and difficulty <b>{selectedDifficulty}</b>.</p>
        <button className="reset-btn" onClick={() => { setSelectedTopic('All'); setSelectedDifficulty('All'); }}>
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="practice-quiz-view">
      <div className="quiz-header-panel">
        <div className="quiz-filters">
          <div className="filter-group">
            <span className="field-label"><Filter size={12} /> TOPIC</span>
            <div className="preset-row">
              {topics.map(t => (
                <button
                  key={t}
                  className={selectedTopic === t ? 'active-preset' : ''}
                  onClick={() => { setSelectedTopic(t); handleRestart(); }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: '8px' }}>
            <span className="field-label">DIFFICULTY</span>
            <div className="preset-row">
              {difficulties.map(d => (
                <button
                  key={d}
                  className={selectedDifficulty === d ? 'active-preset' : ''}
                  onClick={() => { setSelectedDifficulty(d); handleRestart(); }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="quiz-score-pill">
          <Trophy size={16} className="text-orange" />
          <span>Score: <b>{score}</b> / {answeredCount}</span>
        </div>
      </div>

      {!isQuizComplete ? (
        <div className="panel question-card-panel">
          <div className="question-meta-row">
            <span className="q-badge topic">{currentQ.topic}</span>
            <span className={`q-badge diff-${currentQ.difficulty.toLowerCase()}`}>
              {currentQ.difficulty}
            </span>
            <span className="q-counter">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          <h3 className="question-text">{currentQ.question}</h3>

          <div className="options-list">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.answerIndex;
              let optClass = 'option-choice';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) optClass += ' correct';
                else if (isSelected && !isCorrectAnswer) optClass += ' wrong';
              } else if (isSelected) {
                optClass += ' selected';
              }

              return (
                <div
                  key={idx}
                  className={optClass}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt}</span>
                  {isAnswerSubmitted && isCorrectAnswer && <CheckCircle size={16} className="text-green" />}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && <XCircle size={16} className="text-orange" />}
                </div>
              );
            })}
          </div>

          {isAnswerSubmitted && (
            <div className="explanation-box">
              <div className="explanation-title">
                {selectedOption === currentQ.answerIndex ? (
                  <span className="text-green"><CheckCircle size={15} /> Correct!</span>
                ) : (
                  <span className="text-orange"><XCircle size={15} /> Incorrect.</span>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          <div className="quiz-actions-row">
            {!isAnswerSubmitted ? (
              <button
                className="run-btn primary"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
            ) : (
              <button className="run-btn primary" onClick={handleNext}>
                {currentIndex < filteredQuestions.length - 1 ? 'Next Question →' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="panel quiz-complete-panel">
          <div className="complete-hero">
            <Sparkles size={36} className="sparkle" />
            <h2>Quiz Complete!</h2>
            <p>You scored <b>{score}</b> out of <b>{filteredQuestions.length}</b> ({Math.round((score / filteredQuestions.length) * 100)}%).</p>
          </div>

          <div className="quiz-result-stats">
            <div className="metric">
              <CheckCircle size={16} className="text-green" />
              <div>
                <small>Correct</small>
                <strong>{score}</strong>
              </div>
            </div>
            <div className="metric">
              <XCircle size={16} className="text-orange" />
              <div>
                <small>Incorrect</small>
                <strong>{filteredQuestions.length - score}</strong>
              </div>
            </div>
          </div>

          <div className="quiz-actions-row" style={{ marginTop: '20px' }}>
            <button className="run-btn primary" onClick={handleRestart}>
              <RotateCcw size={15} /> Retry This Topic
            </button>
            <button
              className="reset-btn"
              onClick={() => { setSelectedTopic('All'); setSelectedDifficulty('All'); handleRestart(); }}
            >
              Practice All Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
