export type Variant = 'A' | 'B';

const STORAGE_KEY = 'cmpm290a:variant';
export const DEMO_USER_ID = 'demo_user_001';

function storedVariant(): Variant | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'A' || v === 'B' ? v : null;
  } catch {
    return null;
  }
}

/** URL (?variant=A|B) wins, then the last choice in this browser, then B (the treatment). */
export function initialVariant(search: string = location.search): Variant {
  const fromUrl = new URLSearchParams(search).get('variant')?.toUpperCase();
  if (fromUrl === 'A' || fromUrl === 'B') return fromUrl;
  return storedVariant() ?? 'B';
}

export function persistVariant(variant: Variant): void {
  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // storage unavailable: the choice just won't persist
  }
  const url = new URL(location.href);
  url.searchParams.set('variant', variant);
  history.replaceState(null, '', url);
}

export function flag(name: string, search: string = location.search): boolean {
  const v = new URLSearchParams(search).get(name);
  return v === '1' || v === 'true';
}

export interface ExperimentEvent {
  id: number;
  name: 'story_progress_exposure' | 'story_badge_exposure' | 'tray_session_end';
  at: string;
  payload: Record<string, string | number | boolean>;
}

export interface TraySession {
  id: string;
  variant: Variant;
  /** Unique usernames viewed (an array so Svelte state tracks it). */
  accountsViewed: string[];
  storiesViewed: number;
}

let sessionCounter = 0;
export function newSessionId(): string {
  sessionCounter += 1;
  return `sess_${String(sessionCounter).padStart(3, '0')}`;
}

export function mean(values: readonly number[]): number | null {
  return values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length;
}
