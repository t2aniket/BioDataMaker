import { BiodataFormValues } from './validations';

const LOCAL_STORAGE_KEY = 'free_biodata_maker_draft';
const TOKEN_KEY = 'free_biodata_maker_token';

export interface DraftState {
  language: string;
  templateId: string;
  formData: Record<string, any>;
  photoUrl?: string;
  symbol?: string;
}

// Save draft locally
export function saveDraftLocal(state: DraftState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

// Load draft locally
export function loadDraftLocal(): DraftState | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Clear local draft
export function clearDraftLocal() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

// Get or create a draft token
export function getDraftToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setDraftToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

// Sync draft with server
export async function syncDraftToServer(state: DraftState): Promise<string> {
  const token = getDraftToken();
  const res = await fetch('/api/drafts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      draftToken: token || undefined,
      selectedLanguage: state.language,
      selectedTemplateId: state.templateId,
      formData: state.formData,
      photoUrl: state.photoUrl,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to sync draft with server');
  }

  const data = await res.json();
  if (data.draftToken) {
    setDraftToken(data.draftToken);
  }
  return data.draftToken;
}

// Fetch draft from server
export async function fetchDraftFromServer(token: string): Promise<DraftState> {
  const res = await fetch(`/api/drafts?token=${token}`);
  if (!res.ok) {
    throw new Error('Failed to fetch draft from server');
  }
  const data = await res.json();
  return {
    language: data.selectedLanguage,
    templateId: data.selectedTemplateId,
    formData: data.formData,
    photoUrl: data.photoUrl || undefined,
  };
}
