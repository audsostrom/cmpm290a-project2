/**
 * Tray progress ("4 of 11") for the B variant, following the A/B plan's design rules:
 * - the total is fixed when the viewer opens (new stories mid-session don't change it);
 * - only accounts with unseen stories count; story ads never count (position is kept during an ad);
 * - skipping an account still advances the count (position follows the account on screen);
 * - hidden when the viewer wasn't opened from the Home tray, or fewer than 2 accounts are unseen.
 * Same rules as GenProbe's StoriesTracker (generative-probe-sdk, adapter-instagram).
 */
export type ViewerSource = 'tray' | 'feed' | 'profile';

export interface ProgressState {
  visible: boolean;
  /** 1-based; 0 before the first counted account. */
  index: number;
  total: number;
}

export class TrayProgress {
  readonly total: number;
  readonly #order: readonly string[];
  readonly #fromTray: boolean;
  #index = 0;

  /** `unseenAtOpen`: usernames with unseen stories, in tray order, when the viewer opened. */
  constructor(unseenAtOpen: readonly string[], source: ViewerSource) {
    this.#order = [...unseenAtOpen];
    this.#fromTray = source === 'tray';
    this.total = this.#order.length;
  }

  /** Whether this session counts as an exposure (the plan's triggering rule). */
  get eligible(): boolean {
    return this.#fromTray && this.total >= 2;
  }

  /** State while `username` is on screen; pass null while an ad plays. */
  at(username: string | null): ProgressState {
    const position = username === null ? -1 : this.#order.indexOf(username);
    if (position >= 0) this.#index = position + 1;
    return { visible: this.eligible && this.#index > 0, index: this.#index, total: this.total };
  }
}
