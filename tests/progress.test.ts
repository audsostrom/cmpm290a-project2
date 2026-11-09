import { describe, expect, it } from 'vitest';
import { TrayProgress } from '../src/lib/progress';

const unseen = ['a', 'b', 'c', 'd'];

describe('TrayProgress (A/B plan design rules)', () => {
  it('counts position among unseen accounts at open', () => {
    const p = new TrayProgress(unseen, 'tray');
    expect(p.at('a')).toEqual({ visible: true, index: 1, total: 4 });
    expect(p.at('c')).toEqual({ visible: true, index: 3, total: 4 }); // skipping b still advances
  });

  it('keeps the position while an ad plays (ads are not counted)', () => {
    const p = new TrayProgress(unseen, 'tray');
    p.at('b');
    expect(p.at(null)).toEqual({ visible: true, index: 2, total: 4 });
  });

  it('keeps the position for accounts outside the snapshot (already seen, or new mid-session)', () => {
    const p = new TrayProgress(unseen, 'tray');
    p.at('b');
    expect(p.at('seen.account')).toMatchObject({ index: 2, total: 4 });
  });

  it('fixes the total at open', () => {
    const order = [...unseen];
    const p = new TrayProgress(order, 'tray');
    order.push('new.arrival');
    expect(p.at('d').total).toBe(4);
  });

  it('is hidden and not an exposure when opened outside the tray', () => {
    const p = new TrayProgress(unseen, 'feed');
    expect(p.eligible).toBe(false);
    expect(p.at('a').visible).toBe(false);
  });

  it('is hidden and not an exposure with fewer than 2 unseen accounts ("1 of 1" says nothing)', () => {
    const p = new TrayProgress(['a'], 'tray');
    expect(p.eligible).toBe(false);
    expect(p.at('a').visible).toBe(false);
  });
});
