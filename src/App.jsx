import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import SummaryBar from './components/SummaryBar.jsx';
import NavDrawer from './components/NavDrawer.jsx';
import SettingsModal, { loadApiKey } from './components/SettingsModal.jsx';
import Step1Input     from './components/steps/Step1Input.jsx';
import Step2Analysis  from './components/steps/Step2Analysis.jsx';
import Step3Questions from './components/steps/Step3Questions.jsx';
import Step4Templates from './components/steps/Step4Templates.jsx';
import Step5Request   from './components/steps/Step5Request.jsx';
import { analyzeWithAI, analyzeRuleBased } from './utils/ai.js';
import { generateRequest } from './utils/generate.js';
import { useWindowSize } from './utils/useWindowSize.js';
import { saveDraft, loadDraft, clearDraft } from './utils/draft.js';
import { detectContractType } from './utils/detect.js';

export default function App() {
  const { isMobile } = useWindowSize();

  // UI
  const [step, setStep]                 = useState(1);
  const [navOpen, setNavOpen]           = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftBanner, setDraftBanner]   = useState(false);
  const [savedDraft, setSavedDraft]     = useState(null);

  // AI
  const [useAI, setUseAI]         = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError]     = useState('');
  const [apiKey, setApiKey]       = useState('');

  // Analysis result
  const [ctype, setCtype]       = useState('OTHER');
  const [secondary, setSec]     = useState(null);
  const [companion, setCompanion] = useState(null);  // 복합 유형
  const [ext, setExt]           = useState({});
  const [usedAI, setUsedAI]     = useState(false);

  // Form
  const [inputText, setInputText] = useState('');
  const [answers, setAnswers]     = useState({});
  const [reqText, setReqText]     = useState('');

  // ── 초기화: API 키 + 임시저장 불러오기 ──────────────────────
  useEffect(() => {
    const key = loadApiKey();
    if (key) { setApiKey(key); setUseAI(true); }

    const draft = loadDraft();
    if (draft && draft.step > 1) {
      setSavedDraft(draft);
      setDraftBanner(true);
    }
  }, []);

  // ── 자동 임시저장: 주요 상태 변경 시 ───────────────────────
  useEffect(() => {
    if (step === 1 && !inputText) return; // 빈 초기 상태는 저장하지 않음
    saveDraft({ step, ctype, secondary, companion, ext, inputText, answers });
  }, [step, ctype, ext, inputText, answers]);

  // ── Handlers ────────────────────────────────────────────────
  const handleAnalyze = async (text) => {
    setAnalyzing(true); setAiError('');
    let result;
    if (useAI) {
      result = await analyzeWithAI(text, apiKey);
      if (result.error) setAiError(result.error);
    } else {
      result = analyzeRuleBased(text);
    }
    setCtype(result.type); setSec(result.secondary);
    // AI 경로는 companion을 서버에서 반환하지 않으므로 rule-based로 후처리
    const companionVal = result.companion ?? detectContractType(text).companion ?? null;
    setCompanion(companionVal);
    setExt(result.ext); setUsedAI(result.usedAI);
    setAnswers({}); setAnalyzing(false); setStep(2);
  };

  const handleManual = (type) => {
    setCtype(type); setSec(null); setCompanion(null);
    setExt({}); setUsedAI(false); setAnswers({}); setStep(2);
  };

  const handleReset = () => {
    setStep(1); setInputText(''); setCtype('OTHER'); setSec(null); setCompanion(null);
    setExt({}); setAnswers({}); setReqText(''); setAiError(''); setUsedAI(false);
    clearDraft();
  };

  const handleRestoreDraft = () => {
    if (!savedDraft) return;
    setStep(savedDraft.step);
    setCtype(savedDraft.ctype || 'OTHER');
    setSec(savedDraft.secondary || null);
    setCompanion(savedDraft.companion || null);
    setExt(savedDraft.ext || {});
    setInputText(savedDraft.inputText || '');
    setAnswers(savedDraft.answers || {});
    setDraftBanner(false);
  };

  const handleApiKeySave = (key) => {
    setApiKey(key); setUseAI(!!key);
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

      {/* 임시저장 복원 배너 */}
      {draftBanner && savedDraft && (
        <div style={{
          background: 'var(--info-bg)', borderBottom: '0.5px solid var(--info-border)',
          padding: '10px 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--info-text)',
        }}>
          <span>
            이전에 작성 중인 내용이 있습니다.
            (저장 시점: {new Date(savedDraft.savedAt).toLocaleString('ko-KR', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })})
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleRestoreDraft} style={{
              padding: '5px 14px', borderRadius: 'var(--radius-md)',
              background: 'var(--info-text)', color: 'var(--bg-surface)',
              border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            }}>불러오기</button>
            <button onClick={() => { setDraftBanner(false); clearDraft(); }} style={{
              padding: '5px 12px', borderRadius: 'var(--radius-md)',
              background: 'transparent', color: 'var(--info-text)',
              border: '0.5px solid var(--info-border)', cursor: 'pointer', fontSize: '12px',
            }}>무시</button>
          </div>
        </div>
      )}

      <NavDrawer open={navOpen} onClose={() => setNavOpen(false)} onSelect={handleManual} onNew={handleReset} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={handleApiKeySave} />

      <main style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: isMobile ? '1rem 0.875rem 5rem' : '1.5rem 1.25rem 3rem',
        display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {step === 1 && (
            <Step1Input
              value={inputText} onChange={setInputText}
              onAnalyze={handleAnalyze} onManual={handleManual}
              useAI={useAI} analyzing={analyzing} error={aiError}
            />
          )}
          {step === 2 && (
            <Step2Analysis
              ctype={ctype} secondary={secondary} companion={companion}
              ext={ext} usedAI={usedAI}
              onChangeType={(t) => { setCtype(t); setCompanion(null); setAnswers({}); }}
              onBack={() => setStep(1)} onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <Step3Questions
              ctype={ctype} companion={companion} answers={answers}
              onAnswer={(id, v) => setAnswers(p => ({ ...p, [id]: v }))}
              onBack={() => setStep(2)} onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <Step4Templates
              ctype={ctype} companion={companion}
              onBack={() => setStep(3)}
              onGenerate={() => setStep(5)}
            />
          )}
          {step === 5 && (
            <Step5Request
              ctype={ctype} inputText={inputText}
              ext={ext} answers={answers}
              onBack={() => setStep(4)} onReset={handleReset}
            />
          )}
        </div>

        <Sidebar
          step={step} ctype={ctype} ext={ext} answers={answers}
          hasInputText={!!inputText}
          hidden={isMobile}
        />
      </main>

      {isMobile && (
        <SummaryBar step={step} ctype={ctype} ext={ext} answers={answers} hasInputText={!!inputText} />
      )}
    </div>
  );
}
