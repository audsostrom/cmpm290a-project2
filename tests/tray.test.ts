import { describe, expect, it } from 'vitest';
import { ACCOUNTS, ADS, DEMO_NOW } from '../src/data/mock';
import { buildPlaylist } from '../src/lib/playlist';
import { ageLabel, hasUnseen, trayOrder } from '../src/lib/tray';

const byName = (u: string) => ACCOUNTS.find((a) => a.username === u)!;

describe('ageLabel', () => {
  it.each([
    [10 * 60_000, '10m'],
    [45 * 60_000, '45m'],
    [20 * 3_600_000, '20h'],
    [49 * 3_600_000, '2d'],
    [0, '1m'],
  ])('%d ms ago → %s', (ago, label) => {
    expect(ageLabel(DEMO_NOW - ago, DEMO_NOW)).toBe(label);
  });
});

describe('mock data', () => {
  it('has 11 accounts with unseen stories, so the 4th reads "4 of 11"', () => {
    expect(ACCOUNTS.filter(hasUnseen)).toHaveLength(11);
    expect(trayOrder(ACCOUNTS).filter(hasUnseen)[3]!.username).toBe('kofi.k');
  });

  it('puts unseen accounts before fully seen ones', () => {
    const order = trayOrder(ACCOUNTS);
    const firstSeen = order.findIndex((a) => !hasUnseen(a));
    expect(order.slice(firstSeen).every((a) => !hasUnseen(a))).toBe(true);
  });
});

describe('buildPlaylist', () => {
  it('starts at the tapped account and inserts an ad after every 3 accounts', () => {
    const tray = trayOrder(ACCOUNTS);
    const items = buildPlaylist(tray, byName('kofi.k'), ADS, 3);
    expect(items[0]).toMatchObject({ kind: 'account', account: { username: 'kofi.k' } });
    expect(items.slice(0, 4).map((i) => i.kind)).toEqual(['account', 'account', 'account', 'ad']);
  });
});
