import type { Account, StoryAd } from '../data/types';
import { hasUnseen } from './tray';

export type PlaylistItem =
  | { kind: 'account'; account: Account; startStory: number }
  | { kind: 'ad'; ad: StoryAd };

/**
 * What the viewer plays after tapping `start` in the tray: that account and every later one in tray
 * order, resuming each at its first unseen story, with a story ad after every `adEvery` accounts.
 */
export function buildPlaylist(
  tray: readonly Account[],
  start: Account,
  ads: readonly StoryAd[],
  adEvery: number,
): PlaylistItem[] {
  const from = Math.max(0, tray.indexOf(start));
  const items: PlaylistItem[] = [];
  let adIndex = 0;
  tray.slice(from).forEach((account, i) => {
    items.push({
      kind: 'account',
      account,
      startStory: hasUnseen(account) ? account.seenCount : 0,
    });
    const ad = ads[adIndex % Math.max(1, ads.length)];
    if (ad && (i + 1) % adEvery === 0 && i < tray.length - from - 1) {
      items.push({ kind: 'ad', ad });
      adIndex++;
    }
  });
  return items;
}
