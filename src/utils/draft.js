const KEY = 'cin_draft_v1';
const TTL = 24 * 60 * 60 * 1000; // 24시간

export function saveDraft(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, savedAt: Date.now() }));
  } catch (_) {}
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.savedAt > TTL) { clearDraft(); return null; }
    return data;
  } catch (_) { return null; }
}

export function clearDraft() {
  try { localStorage.removeItem(KEY); } catch (_) {}
}
