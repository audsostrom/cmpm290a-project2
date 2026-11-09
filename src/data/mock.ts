import type { Account, SceneKind, Story, StoryAd } from './types';

/**
 * Fixed demo clock (matches the 9:27 status bar in the report's screenshot), so ages like "20h" are
 * stable in recordings and mocks. All people and brands below are fictional.
 */
export const DEMO_NOW = new Date(2026, 10, 6, 9, 27).getTime();

const MIN = 60_000;
const HOUR = 60 * MIN;

let storyId = 0;
/** `count` stories, the newest posted `newestAgo` ms before DEMO_NOW, spaced `gap` apart. */
function stories(
  count: number,
  newestAgo: number,
  scene: SceneKind,
  palette: readonly [string, string],
  captions: readonly string[],
  gap = 25 * MIN,
): Story[] {
  return Array.from({ length: count }, (_, i) => {
    const fromNewest = count - 1 - i;
    return {
      id: `s${++storyId}`,
      postedAt: DEMO_NOW - newestAgo - fromNewest * gap,
      scene,
      caption: captions[i % captions.length] ?? '',
      palette,
    };
  });
}

export const SELF: Account = {
  username: 'you',
  displayName: 'Your story',
  avatarSeed: 'self-demo',
  avatarBg: 'f4d6c9',
  stories: [],
  seenCount: 0,
};

/**
 * Tray ranking order (Instagram's ranking isn't purely by recency). 11 accounts have unseen stories,
 * 3 are fully seen, so opening the 4th unseen account shows "4 of 11" (the plan's example).
 */
export const ACCOUNTS: Account[] = [
  {
    username: 'jules.rivera',
    displayName: 'Jules Rivera',
    avatarSeed: 'jules',
    avatarBg: 'ffd5dc',
    stories: stories(3, 20 * HOUR, 'sunset', ['#ff8a5c', '#7b2ff7'], [
      'golden hour hits different',
      'one more because the sky said so',
      'ok last one I promise',
    ]),
    seenCount: 0,
    closeFriends: true,
  },
  {
    username: 'tide.and.tofu',
    displayName: 'Tide & Tofu',
    avatarSeed: 'tofu',
    avatarBg: 'c0f0e0',
    stories: stories(1, 45 * MIN, 'food', ['#ffd166', '#ef476f'], ['new menu drops friday']),
    seenCount: 0,
  },
  {
    username: 'bassline.bea',
    displayName: 'Bea',
    avatarSeed: 'bea',
    avatarBg: 'd1d4ff',
    // The report's motivating case: a long run of concert clips.
    stories: stories(
      18,
      2 * HOUR,
      'stage',
      ['#1a1a2e', '#e94560'],
      ['THEY OPENED WITH IT', 'the bass in my chest', 'crowd shot', 'encore?? ENCORE', 'still here'],
      4 * MIN,
    ),
    seenCount: 0,
  },
  {
    username: 'kofi.k',
    displayName: 'Kofi',
    avatarSeed: 'kofi',
    avatarBg: 'ffe3b3',
    stories: stories(2, 5 * HOUR, 'run', ['#06d6a0', '#118ab2'], ['10k before coffee', 'new PR']),
    seenCount: 0,
  },
  {
    username: 'lune.studio',
    displayName: 'Lune Studio',
    avatarSeed: 'lune',
    avatarBg: 'e5d4ff',
    stories: stories(4, 9 * HOUR, 'art', ['#f72585', '#4361ee'], [
      'studio day',
      'glaze test #3',
      'kiln opening tomorrow',
      'sneak peek',
    ]),
    seenCount: 0,
    verified: true,
  },
  {
    username: 'pato.paints',
    displayName: 'Pato',
    avatarSeed: 'pato',
    avatarBg: 'c9f2c7',
    stories: stories(1, 23 * HOUR, 'art', ['#ffbe0b', '#fb5607'], ['wip, be nice']),
    seenCount: 0,
  },
  {
    username: 'ari_in_the_alps',
    displayName: 'Ari',
    avatarSeed: 'ari',
    avatarBg: 'cde7ff',
    stories: stories(6, 12 * HOUR, 'mountain', ['#a8dadc', '#1d3557'], [
      'day 3 of the hut-to-hut',
      'the view from breakfast',
      'cows have the right of way',
      'my knees: no',
      'worth it',
      'goodnight from 2,400 m',
    ]),
    seenCount: 0,
  },
  {
    username: 'sam.cooks',
    displayName: 'Sam',
    avatarSeed: 'sam',
    avatarBg: 'ffd6a5',
    stories: stories(2, 3 * HOUR, 'food', ['#ff9f1c', '#2ec4b6'], ['dumpling sunday', 'fold count: 64']),
    seenCount: 0,
  },
  {
    username: 'nell.reads',
    displayName: 'Nell',
    avatarSeed: 'nell',
    avatarBg: 'f1e3d3',
    stories: stories(1, 16 * HOUR, 'books', ['#bc6c25', '#283618'], ['currently: can’t put it down']),
    seenCount: 0,
  },
  {
    username: 'dev.dani',
    displayName: 'Dani',
    avatarSeed: 'dani',
    avatarBg: 'd8f3dc',
    stories: stories(3, 7 * HOUR, 'code', ['#0f172a', '#22c55e'], [
      'it works on my machine',
      'it does not work on prod',
      'it works on prod (do not ask)',
    ]),
    seenCount: 0,
  },
  {
    username: 'rosa.runs',
    displayName: 'Rosa',
    avatarSeed: 'rosa',
    avatarBg: 'ffc8dd',
    stories: stories(2, 1 * HOUR, 'beach', ['#00b4d8', '#ffd6a5'], ['beach loop', 'reward: churros']),
    seenCount: 0,
  },
  {
    username: 'theo.film',
    displayName: 'Theo',
    avatarSeed: 'theo',
    avatarBg: 'e2e2e2',
    stories: stories(5, 18 * HOUR, 'film', ['#232526', '#bdc3c7'], ['shot on 35mm', 'roll 12', 'light leak', 'contact sheet', 'favorite frame']),
    seenCount: 5,
  },
  {
    username: 'miko.mochi',
    displayName: 'Miko',
    avatarSeed: 'miko',
    avatarBg: 'fde2e4',
    stories: stories(2, 4 * HOUR, 'pet', ['#ffafcc', '#a2d2ff'], ['mochi has opinions', 'nap #4']),
    seenCount: 2,
  },
  {
    username: 'quinn.q',
    displayName: 'Quinn',
    avatarSeed: 'quinn',
    avatarBg: 'cfe1b9',
    stories: stories(1, 22 * HOUR, 'city', ['#3a0ca3', '#f72585'], ['city lights']),
    seenCount: 1,
  },
];

/** Story ads the viewer inserts between accounts. Ads never count toward tray progress. */
export const ADS: StoryAd[] = [
  {
    id: 'ad1',
    brand: 'Ferncrest Outfitters',
    headline: 'Trail-ready layers, 20% off this week',
    cta: 'Shop now',
    palette: ['#2d6a4f', '#95d5b2'],
    avatarBg: 'b7e4c7',
  },
  {
    id: 'ad2',
    brand: 'Brightside Coffee',
    headline: 'Your new morning ritual',
    cta: 'Learn more',
    palette: ['#6f4518', '#ffe8d6'],
    avatarBg: 'ffe8d6',
  },
];

/** Insert an ad after every this many accounts in the viewer. */
export const AD_EVERY = 3;
