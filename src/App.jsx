import { useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Step1Input    from './components/steps/Step1Input.jsx';
import Step2Analysis from './components/steps/Step2Analysis.jsx';
import Step3Questions from './components/steps/Step3Questions.jsx';
import Step4Templates from './components/steps/Step4Templates.jsx';
import Step5Request  from './components/steps/Step5Request.jsx';
import { analyzeWithAI, analyzeRuleBased } from './utils/ai.js';
import { generateRequest } from './utils/generate.js';

export default function App() {
  const [step, setStep]           = useState(1);
  const [useAI, setUseAI]         = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError]     = useState('');

  // Analysis result
  const [ctype, setCtype]   = useState('OTHER');
  const [secondary, setSec] = useState(null);
  const [ext, setExt]       = useState({});
  const [usedAI, setUsedAI] = useState(false);

  // Form state
  const [inputText, setInputText] = useState('');
  const [answers, setAnswers]     = useState({});

  // Generated output
  const [reqText, setReqText] = useState('');

  // ── Handlers ─────────────────────────────────────────

  const handleAnalyze = async (text) => {
    setInputText(text);
    setAnalyzing(true);
    setAiError('');

    let result;
    if (useAI) {
      result = await analyzeWithAI(text);
      if (result.error) setAiError(result.error);
    } else {
      result = analyzeRuleBased(text);
    }

    setCtype(result.type);
    setSec(result.secondary);
    setExt(result.ext);
    setUsedAI(result.usedAI);
    setAnswers({});
    setAnalyzing(false);
    setStep(2);
  };

  const handleManual = (type) => {
    setInputText('');
    setCtype(type);
    setSec(null);
    setExt({});
    setUsedAI(false);
    setAnswers({});
    setStep(2);
  };

  const handleChangeType = (type) => {
    setCtype(type);
    setAnswers({});
  };

  const handleAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = () => {
    const text = generateRequest({ type: ctype, inputText, ext, answers });
    setReqText(text);
    setStep(5);
  };

  const handleReset = () => {
    setStep(1);
    setInputText('');
    setCtype('OTHER');
    setSec(null);
    setExt({});
    setAnswers({});
    setReqText('');
    setAiError('');
    setUsedAI(false);
  };

  // ── Render ────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Header
        step={step}
        onStepClick={setStep}
        useAI={useAI}
        onToggleAI={() => setUseAI(u => !u)}
      />

      <main style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '1.5rem 1.25rem 3rem',
        display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
      }}>
        {/* Main wizard panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {step === 1 && (
            <Step1Input
              onAnalyze={handleAnalyze}
              onManual={handleManual}
              useAI={useAI}
              analyzing={analyzing}
              error={aiError}
            />
          )}
          {step === 2 && (
            <Step2Analysis
              ctype={ctype}
              secondary={secondary}
              ext={ext}
              usedAI={usedAI}
              onChangeType={handleChangeType}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Questions
              ctype={ctype}
              answers={answers}
              onAnswer={handleAnswer}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Step4Templates
              ctype={ctype}
              onBack={() => setStep(3)}
              onGenerate={handleGenerate}
            />
          )}
          {step === 5 && (
            <Step5Request
              reqText={reqText}
              ctype={ctype}
              inputText={inputText}
              ext={ext}
              answers={answers}
              onBack={() => setStep(4)}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Sidebar */}
        <Sidebar
          step={step}
          ctype={ctype}
          ext={ext}
          answers={answers}
        />
      </main>
    </div>
  );
}
