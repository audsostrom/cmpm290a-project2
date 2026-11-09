export type SceneKind =
  | 'sunset'
  | 'stage'
  | 'food'
  | 'pet'
  | 'mountain'
  | 'city'
  | 'books'
  | 'run'
  | 'film'
  | 'art'
  | 'beach'
  | 'code';

export interface Story {
  id: string;
  /** Epoch ms. */
  postedAt: number;
  scene: SceneKind;
  caption: string;
  /** Two background colors for the slide's gradient. */
  palette: readonly [string, string];
}

export interface Account {
  username: string;
  displayName: string;
  avatarSeed: string;
  avatarBg: string;
  /** Oldest first, as Instagram plays them. */
  stories: Story[];
  /** How many of `stories` (from the oldest) the viewer has already watched. */
  seenCount: number;
  closeFriends?: boolean;
  verified?: boolean;
}

export interface StoryAd {
  id: string;
  brand: string;
  headline: string;
  cta: string;
  palette: readonly [string, string];
  avatarBg: string;
}
