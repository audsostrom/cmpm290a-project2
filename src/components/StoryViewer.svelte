<script lang="ts">
  import { untrack } from 'svelte';
  import { DEMO_NOW } from '../data/mock';
  import { avatarUri } from '../lib/avatar';
  import { app, type ViewerState } from '../lib/state.svelte';
  import type { PlaylistItem } from '../lib/playlist';
  import { ageLabel } from '../lib/tray';
  import Icon from './Icon.svelte';
  import Scene from './Scene.svelte';

  let { viewer }: { viewer: ViewerState } = $props();

  const STORY_MS = 5000;
  const HOLD_MS = 220;

  let itemIndex = $state(0);
  // The viewer is re-created for every open ({#key} in App), so the initial playlist is all we need.
  const first = untrack(() => viewer.playlist[0]);
  let storyIndex = $state(first?.kind === 'account' ? first.startStory : 0);
  let elapsed = $state(0);
  let held = $state(false);
  let pausedByKey = $state(false);
  const paused = $derived(held || pausedByKey || !app.autoplay);

  const item = $derived<PlaylistItem | undefined>(viewer.playlist[itemIndex]);
  const account = $derived(item?.kind === 'account' ? item.account : null);
  const story = $derived(account?.stories[storyIndex] ?? null);
  const segments = $derived(account ? account.stories.length : 1);
  // B: "4 of 11". Position follows the account on screen; ads keep the last position.
  const progress = $derived(viewer.progress.at(account?.username ?? null));
  const showProgress = $derived(app.variant === 'B' && progress.visible);

  // Each newly shown story counts as viewed (and marks it seen in the tray).
  // Depends only on which story is on screen; the session counters it updates must not re-trigger it.
  $effect(() => {
    if (!account || !story) return;
    const username = account.username;
    const index = storyIndex;
    untrack(() => app.viewed(username, index));
  });

  // When the viewer closes, drop focus from the tray circle that opened it, so no focus ring is left
  // behind in recordings.
  $effect(() => () => (document.activeElement as HTMLElement | null)?.blur());

  // Auto-advance.
  $effect(() => {
    if (paused) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      elapsed += now - last;
      last = now;
      if (elapsed >= STORY_MS) next();
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  });

  function show(nextItem: number, nextStory: number) {
    itemIndex = nextItem;
    storyIndex = nextStory;
    elapsed = 0;
  }

  function startOf(i: number): number {
    const it = viewer.playlist[i];
    return it?.kind === 'account' ? it.startStory : 0;
  }

  function next() {
    if (account && storyIndex < account.stories.length - 1) return show(itemIndex, storyIndex + 1);
    skipAccount();
  }

  function prev() {
    if (account && storyIndex > 0) return show(itemIndex, storyIndex - 1);
    if (itemIndex > 0) show(itemIndex - 1, startOf(itemIndex - 1));
    else elapsed = 0;
  }

  /** Jump to the next account (or ad), like swiping left. */
  function skipAccount() {
    if (itemIndex < viewer.playlist.length - 1) show(itemIndex + 1, startOf(itemIndex + 1));
    else app.close();
  }

  function prevAccount() {
    if (itemIndex > 0) show(itemIndex - 1, startOf(itemIndex - 1));
  }

  // Tap left/right, hold to pause, swipe to skip accounts or close.
  let down: { x: number; y: number; at: number; timer: ReturnType<typeof setTimeout> } | null = null;

  function onPointerDown(e: PointerEvent) {
    const timer = setTimeout(() => (held = true), HOLD_MS);
    down = { x: e.clientX, y: e.clientY, at: Date.now(), timer };
  }

  function onPointerUp(e: PointerEvent) {
    if (!down) return;
    clearTimeout(down.timer);
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    const wasHold = held;
    held = false;
    down = null;
    if (dy > 90 && Math.abs(dx) < 60) return app.close();
    if (Math.abs(dx) > 60) return dx < 0 ? skipAccount() : prevAccount();
    if (wasHold) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 3) prev();
    else next();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') app.close();
    else if (e.key === 'ArrowRight') e.shiftKey ? skipAccount() : next();
    else if (e.key === 'ArrowLeft') e.shiftKey ? prevAccount() : prev();
    else if (e.key === ' ') {
      e.preventDefault();
      pausedByKey = !pausedByKey;
    } else return;
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="viewer" data-testid="viewer" role="dialog" aria-label="Stories viewer">
  <div class="stage">
    {#if item?.kind === 'ad'}
      <Scene scene="mountain" palette={item.ad.palette} caption={item.ad.headline} />
    {:else if story}
      <Scene scene={story.scene} palette={story.palette} caption={story.caption} />
    {/if}

    <!-- Gesture layer under the chrome: taps, holds, swipes. -->
    <div
      class="gestures"
      role="presentation"
      onpointerdown={onPointerDown}
      onpointerup={onPointerUp}
      onpointercancel={() => {
        held = false;
        down = null;
      }}
    ></div>

    <div class="chrome top">
      <div class="bars" aria-hidden="true">
        {#each Array.from({ length: segments }, (_, i) => i) as i (i)}
          <span class="bar">
            <span
              class="fill"
              style:width="{i < storyIndex
                ? 100
                : i === storyIndex
                  ? Math.min(100, (elapsed / STORY_MS) * 100)
                  : 0}%"
            ></span>
          </span>
        {/each}
      </div>
      <div class="header">
        {#if item?.kind === 'ad'}
          <img class="avatar" src={avatarUri(item.ad.brand, item.ad.avatarBg)} alt="" />
          <div class="who">
            <span class="name" data-testid="viewer-username">{item.ad.brand}</span>
            <span class="meta">Sponsored</span>
          </div>
        {:else if account && story}
          <img class="avatar" src={avatarUri(account.avatarSeed, account.avatarBg)} alt="" />
          <div class="who">
            <span class="name" data-testid="viewer-username">{account.username}</span>
            {#if account.verified}<Icon name="verified" size={14} />{/if}
            <span class="meta">{ageLabel(story.postedAt, DEMO_NOW)}</span>
          </div>
        {/if}
        {#if showProgress}
          <span class="progress" data-testid="tray-progress">{progress.index} of {progress.total}</span>
        {/if}
        <span class="spacer"></span>
        {#if paused && app.autoplay}<span class="paused" aria-live="polite">Paused</span>{/if}
        <Icon name="more" />
        <button class="icon-btn" type="button" aria-label="Close stories" onclick={() => app.close()}>
          <Icon name="close" size={26} />
        </button>
      </div>
    </div>

    <div class="chrome bottom">
      {#if item?.kind === 'ad'}
        <button class="cta" type="button">{item.ad.cta}</button>
      {:else}
        <span class="reply">Send message</span>
        <Icon name="heart" size={26} />
        <Icon name="send" size={26} />
      {/if}
    </div>
  </div>
</div>

<style>
  .viewer {
    position: absolute;
    inset: -50px 0 0;
    z-index: 20;
    background: #000;
    display: flex;
    flex-direction: column;
    padding-top: 50px;
    animation: open 220ms cubic-bezier(0.2, 0, 0, 1);
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  }
  .stage {
    position: relative;
    flex: 1;
    margin-bottom: 34px;
    border-radius: 10px;
    overflow: hidden;
  }
  .gestures {
    position: absolute;
    inset: 0;
    z-index: 1;
    touch-action: none;
    cursor: pointer;
  }
  .chrome {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    pointer-events: none;
  }
  .chrome :global(button) {
    pointer-events: auto;
  }
  .top {
    top: 0;
    padding: 8px 8px 0;
    background: linear-gradient(rgb(0 0 0 / 0.35), transparent);
  }
  .bars {
    display: flex;
    gap: 3px;
  }
  .bar {
    flex: 1;
    height: 2.5px;
    border-radius: 2px;
    background: rgb(255 255 255 / 0.35);
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    background: #fff;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 4px 0;
    color: #fff;
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  .who {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }
  .name {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }
  .meta {
    font-size: 14px;
    color: rgb(255 255 255 / 0.75);
  }
  /* B: same white as the segment bars so it doesn't compete with the story (plan's design rule). */
  .progress {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    padding: 2px 7px;
    border-radius: 10px;
    background: rgb(255 255 255 / 0.16);
    text-shadow: 0 1px 2px rgb(0 0 0 / 0.4);
  }
  .spacer {
    flex: 1;
  }
  .paused {
    font-size: 12px;
    opacity: 0.8;
  }
  .icon-btn {
    border: 0;
    background: none;
    color: inherit;
    padding: 0;
    display: grid;
    cursor: pointer;
  }
  .bottom {
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px 14px;
    color: #fff;
    background: linear-gradient(transparent, rgb(0 0 0 / 0.35));
  }
  .reply {
    flex: 1;
    padding: 11px 16px;
    border: 1px solid rgb(255 255 255 / 0.6);
    border-radius: 24px;
    font-size: 14px;
  }
  .cta {
    flex: 1;
    padding: 12px;
    border: 0;
    border-radius: 10px;
    background: #fff;
    color: #000;
    font: 600 15px/1 inherit;
  }
  @keyframes open {
    from {
      transform: scale(0.92);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .viewer {
      animation: none;
    }
  }
</style>
