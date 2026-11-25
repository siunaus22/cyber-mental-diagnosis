import { QUIZ_QUESTIONS, type QuizOption } from '../data/diagnosisData';

interface QuizWindowProps {
  currentIndex: number;
  selectedOptionId?: string;
  onSelectOption: (option: QuizOption) => void;
  onPrev: () => void;
}

export function QuizWindow({
  currentIndex,
  selectedOptionId,
  onSelectOption,
  onPrev,
}: QuizWindowProps) {
  const question = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="win98-window quiz-window">
      <div className="win98-titlebar">
        <div className="win98-titlebar-left">
          <span className="win98-title-icon">📋</span>
          <span>精神状态问诊台 - {question.code}</span>
        </div>
        <div className="win98-titlebar-controls" aria-hidden="true">
          <span className="win98-ctrl-btn">_</span>
          <span className="win98-ctrl-btn">□</span>
          <span className="win98-ctrl-btn">×</span>
        </div>
      </div>

      <div className="win98-body">
        <div className="quiz-meta-bar">
          <span className="quiz-category-tag">[{question.category}]</span>
          <span className="quiz-counter">
            进度 {String(currentIndex + 1).padStart(2, '0')} / {total}
          </span>
        </div>

        <div className="win98-progress-track" aria-label={`进度 ${progressPct}%`}>
          <div
            className="win98-progress-blocks"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="quiz-question-box">
          <p className="quiz-question-text">{question.question}</p>
        </div>

        <div className="quiz-options-list">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`win98-option-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectOption(opt)}
              >
                <span className="option-key">{opt.label}</span>
                <span className="option-text">{opt.text}</span>
              </button>
            );
          })}
        </div>

        <div className="quiz-footer-bar">
          <button
            type="button"
            className="win98-btn"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            ◀ 上一题
          </button>
          <span className="quiz-hint">点击任意选项自动进入下一项</span>
        </div>
      </div>

      <div className="win98-statusbar">
        <span>患者问诊中...</span>
        <span>ITEM {currentIndex + 1}/{total}</span>
      </div>
    </div>
  );
}
