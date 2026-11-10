import { ACCOUNTS, AD_EVERY, ADS } from '../data/mock';
import type { Account } from '../data/types';
import {
  DEMO_USER_ID,
  flag,
  initialVariant,
  mean,
  newSessionId,
  persistVariant,
  type ExperimentEvent,
  type TraySession,
  type Variant,
} from './experiment';
import { buildPlaylist, type PlaylistItem } from './playlist';
import { TrayProgress, type ViewerSource } from './progress';
import { hasUnseen, trayOrder } from './tray';

function cloneAccounts(): Account[] {
  return ACCOUNTS.map((a) => ({ ...a, stories: [...a.stories] }));
}

export interface ViewerState {
  source: ViewerSource;
  playlist: PlaylistItem[];
  progress: TrayProgress;
  session: TraySession | null;
}

/** All app state in one place (Svelte 5 runes). */
class AppState {
  variant = $state<Variant>(initialVariant());
  readonly clean = flag('clean');
  readonly autoplay = !flag('paused');
  accounts = $state<Account[]>(cloneAccounts());
  viewer = $state<ViewerState | null>(null);
  events = $state<ExperimentEvent[]>([]);
  sessions = $state<TraySession[]>([]);
  #eventId = 0;

  readonly tray = $derived(trayOrder(this.accounts));

  readonly metrics = $derived.by(() => {
    const done = this.sessions.filter((s) => s.variant === this.variant);
    return {
      sessions: done.length,
      accountsPerSession: mean(done.map((s) => s.accountsViewed.length)),
    };
  });

  setVariant(variant: Variant): void {
    this.variant = variant;
    persistVariant(variant);
  }

  log(name: ExperimentEvent['name'], payload: ExperimentEvent['payload']): void {
    this.events = [
      { id: ++this.#eventId, name, at: new Date().toISOString().slice(11, 19), payload },
      ...this.events,
    ].slice(0, 50);
  }

  /** Open the viewer at `account`. Only tray opens are experiment sessions (triggering rule). */
  open(account: Account, source: ViewerSource): void {
    const unseenAtOpen = this.tray.filter(hasUnseen).map((a) => a.username);
    const progress = new TrayProgress(source === 'tray' ? unseenAtOpen : [], source);
    let session: TraySession | null = null;
    if (progress.eligible) {
      session = {
        id: newSessionId(),
        variant: this.variant,
        accountsViewed: [],
      };
      // Logged in both arms: in A it's the counterfactual exposure.
      this.log('story_progress_exposure', {
        user_id: DEMO_USER_ID,
        variant: this.variant,
        session_id: session.id,
        unseen_accounts_at_open: unseenAtOpen.length,
      });
    }
    const playlist =
      source === 'tray'
        ? buildPlaylist(this.tray, account, ADS, AD_EVERY)
        : [{ kind: 'account' as const, account, startStory: 0 }];
    this.viewer = { source, playlist, progress, session };
  }

  /** A story was shown: mark it seen and count its account toward the session's metric. */
  viewed(username: string, storyIndex: number): void {
    const account = this.accounts.find((a) => a.username === username);
    if (account && storyIndex + 1 > account.seenCount) account.seenCount = storyIndex + 1;
    const session = this.viewer?.session;
    if (session && !session.accountsViewed.includes(username)) session.accountsViewed.push(username);
  }

  close(): void {
    const session = this.viewer?.session;
    if (session) {
      this.sessions = [...this.sessions, session];
      this.log('tray_session_end', {
        session_id: session.id,
        variant: session.variant,
        accounts_viewed: session.accountsViewed.length,
      });
    }
    this.viewer = null;
  }

  /** Back to the demo's starting point (all stories unseen again, logs cleared). */
  reset(): void {
    this.viewer = null;
    this.accounts = cloneAccounts();
    this.events = [];
    this.sessions = [];
  }
}

export const app = new AppState();
