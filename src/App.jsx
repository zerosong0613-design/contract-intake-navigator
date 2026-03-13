import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import NavDrawer from './components/NavDrawer.jsx';
import SettingsModal, { loadApiKey } from './components/SettingsModal.jsx';
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
  const [navOpen, setNavOpen]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey]       = useState('');

  const [ctype, setCtype]   = useState('OTHER');
  const [secondary, setSec] = useState(null);
  const [ext, setExt]       = useState({});
  const [usedAI, setUsedAI] = useState(false);
  const [inputText, setInputText] = useState('');
  const [answers, setAnswers]     = useState({});
  const [reqText, setReqText]     = useState('');

  useEffect(() => {
    const saved = loadApiKey();
    if (saved) { setApiKey(saved); setUseAI(true); }
  }, []);

  const handleAnalyze = async (text) => {
    setInputText(text); setAnalyzing(true); setAiError('');
    let result;
    if (useAI) {
      result = await analyzeWithAI(text, apiKey);
      if (result.error) setAiError(result.error);
    } else {
      result = analyzeRuleBased(text);
    }
    setCtype(result.type); setSec(result.secondary);
    setExt(result.ext); setUsedAI(result.usedAI);
    setAnswers({}); setAnalyzing(false); setStep(2);
  };

  const handleManual = (type) => {
    setInputText(''); setCtype(type); setSec(null);
    setExt({}); setUsedAI(false); setAnswers({}); setStep(2);
  };

  const handleReset = () => {
    setStep(1); setInputText(''); setCtype('OTHER'); setSec(null);
    setExt({}); setAnswers({}); setReqText(''); setAiError(''); setUsedAI(false);
  };

  const handleApiKeySave = (key) => {
    setApiKey(key);
    setUseAI(!!key);
  };

  const handleToggleAI = () => {
    if (!useAI && !apiKey) { setSettingsOpen(true); return; }
    setUseAI(u => !u);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Header
        step={step} onStepClick={setStep}
        useAI={useAI} onToggleAI={handleToggleAI}
        onMenuClick={() => setNavOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        hasApiKey={!!apiKey}
      />

      <NavDrawer
        open={navOpen} onClose={() => setNavOpen(false)}
        onSelect={handleManual} onNew={handleReset}
      />

      <SettingsModal
        open={settingsOpen} onClose={() => setSettingsOpen(false)}
        onSave={handleApiKeySave}
      />

      <main style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '1.5rem 1.25rem 3rem',
        display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {step === 1 && <Step1Input onAnalyze={handleAnalyze} onManual={handleManual} useAI={useAI} analyzing={analyzing} error={aiError} />}
          {step === 2 && <Step2Analysis ctype={ctype} secondary={secondary} ext={ext} usedAI={usedAI} onChangeType={(t) => { setCtype(t); setAnswers({}); }} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
          {step === 3 && <Step3Questions ctype={ctype} answers={answers} onAnswer={(id,v) => setAnswers(p=>({...p,[id]:v}))} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
          {step === 4 && <Step4Templates ctype={ctype} onBack={() => setStep(3)} onGenerate={() => { setReqText(generateRequest({ type:ctype, inputText, ext, answers })); setStep(5); }} />}
          {step === 5 && <Step5Request reqText={reqText} ctype={ctype} inputText={inputText} ext={ext} answers={answers} onBack={() => setStep(4)} onReset={handleReset} />}
        </div>
        <Sidebar step={step} ctype={ctype} ext={ext} answers={answers} />
      </main>
    </div>
  );
}
