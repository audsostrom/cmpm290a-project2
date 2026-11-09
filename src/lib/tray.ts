import type { Account } from '../data/types';

export function hasUnseen(account: Account): boolean {
  return account.seenCount < account.stories.length;
}

export function newestStoryAt(account: Account): number | null {
  return account.stories.at(-1)?.postedAt ?? null;
}

/** "45m", "20h", "2d" (Instagram-style relative age). */
export function ageLabel(postedAt: number, now: number): string {
  const minutes = Math.max(1, Math.floor((now - postedAt) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`;
}

/** Badge text for B: ["3 posts", "20h"]. Null for accounts without stories. */
export function badgeLines(account: Account, now: number): [string, string] | null {
  const newest = newestStoryAt(account);
  if (newest === null) return null;
  const n = account.stories.length;
  return [`${n} ${n === 1 ? 'post' : 'posts'}`, ageLabel(newest, now)];
}

/** Tray order: accounts with unseen stories first (in ranking order), then fully seen ones. */
export function trayOrder(accounts: readonly Account[]): Account[] {
  return [...accounts.filter(hasUnseen), ...accounts.filter((a) => !hasUnseen(a))];
}
