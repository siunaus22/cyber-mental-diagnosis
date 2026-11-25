import { useEffect, useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { QuizWindow } from './components/QuizWindow';
import { ThermalReceipt } from './components/ThermalReceipt';
import {
  DIAGNOSIS_TYPES,
  QUIZ_QUESTIONS,
  calculateDiagnosis,
  type DiagnosisResult,
  type QuizOption,
} from './data/diagnosisData';
import {
  loadDiagnosisFromCloud,
  reportAndFetchSharedStats,
  saveDiagnosisToCloud,
  type CloudDiagnosisRecord,
  type SharedDiagnosisStats,
} from './services/toySdk';
import './App.css';

type Stage = 'boot' | 'quiz' | 'result';

export function App() {
  const [stage, setStage] = useState<Stage>('boot');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(QuizOption | undefined)[]>(
    () => Array(QUIZ_QUESTIONS.length).fill(undefined)
  );
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previousSave, setPreviousSave] = useState<CloudDiagnosisRecord | null>(null);
  const [sharedStats, setSharedStats] = useState<SharedDiagnosisStats | null>(null);
  const [cloudStatusMsg, setCloudStatusMsg] = useState('正在连接诊断存档...');

  useEffect(() => {
    loadDiagnosisFromCloud().then((res) => {
      if (res.ok && res.data) {
        setPreviousSave(res.data);
      }
    });
  }, []);

  const handleStartQuiz = () => {
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(undefined));
    setCurrentIndex(0);
    setResult(null);
    setStage('quiz');
  };

  const handleViewPrevious = () => {
    if (!previousSave) return;
    const diagnosis = DIAGNOSIS_TYPES[previousSave.diagnosisId];
    if (!diagnosis) return;
    const buddy = DIAGNOSIS_TYPES[diagnosis.bestBuddyId];
    setResult({
      patientId: previousSave.patientId,
      diagnosedAt: previousSave.diagnosedAt,
      diagnosis,
      buddy,
      metrics: previousSave.metrics,
      answerIds: [],
    });
    setCloudStatusMsg('已从存档恢复上次诊断小票');
    setStage('result');
    reportAndFetchSharedStats(diagnosis.id).then((res) => {
      setSharedStats(res.data);
    });
  };

  const finalizeDiagnosis = async (finalOptions: QuizOption[]) => {
    const diagnosisResult = calculateDiagnosis(finalOptions);
    setResult(diagnosisResult);
    setStage('result');
    setCloudStatusMsg('正在同步云存档与全站病友数据...');

    const record: CloudDiagnosisRecord = {
      patientId: diagnosisResult.patientId,
      diagnosedAt: diagnosisResult.diagnosedAt,
      diagnosisId: diagnosisResult.diagnosis.id,
      diagnosisTitle: diagnosisResult.diagnosis.title,
      metrics: diagnosisResult.metrics,
    };

    const [saveRes, statsRes] = await Promise.all([
      saveDiagnosisToCloud(record),
      reportAndFetchSharedStats(diagnosisResult.diagnosis.id),
    ]);

    setPreviousSave(record);
    setSharedStats(statsRes.data);
    setCloudStatusMsg(
      statsRes.message || saveRes.message || '诊断档案已保存'
    );
  };

  const handleSelectOption = (option: QuizOption) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = option;
    setAnswers(nextAnswers);

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      const completed = nextAnswers.filter((a): a is QuizOption => Boolean(a));
      if (completed.length === QUIZ_QUESTIONS.length) {
        void finalizeDiagnosis(completed);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <div className="desktop-shell">
      <main className="desktop-container">
        {stage === 'boot' && (
          <BootScreen
            onStart={handleStartQuiz}
            previousSave={previousSave}
            onViewPrevious={handleViewPrevious}
          />
        )}

        {stage === 'quiz' && (
          <QuizWindow
            currentIndex={currentIndex}
            selectedOptionId={answers[currentIndex]?.id}
            onSelectOption={handleSelectOption}
            onPrev={handlePrev}
          />
        )}

        {stage === 'result' && result && (
          <ThermalReceipt
            result={result}
            sharedStats={sharedStats}
            cloudStatusMsg={cloudStatusMsg}
            onRetake={handleStartQuiz}
          />
        )}
      </main>

      <footer className="win98-taskbar" aria-label="系统任务栏">
        <button
          type="button"
          className="taskbar-start-btn"
          onClick={() => setStage('boot')}
        >
          <span className="start-logo">❖</span> 开始
        </button>
        <div className="taskbar-divider" />
        <div className="taskbar-active-app">
          🩺 电子精神状态诊断书 (2026)
        </div>
        <div className="taskbar-tray">2026</div>
      </footer>
    </div>
  );
}

export default App;
