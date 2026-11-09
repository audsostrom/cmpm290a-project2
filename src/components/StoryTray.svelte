<script lang="ts">
  import { untrack } from 'svelte';
  import { SELF } from '../data/mock';
  import { app } from '../lib/state.svelte';
  import StoryAvatar from './StoryAvatar.svelte';

  const showBadges = $derived(app.variant === 'B');

  // Exposure for the badge treatment: logged whenever the Home tray comes into view (on load, after
  // closing the viewer, or when the variant changes), in both arms.
  $effect(() => {
    void app.variant;
    if (app.viewer !== null) return;
    untrack(() => app.logBadgeExposure(app.tray.length));
  });
</script>

<div class="tray" data-testid="story-tray" role="list" aria-label="Stories">
  <div role="listitem"><StoryAvatar account={SELF} isSelf showBadge={false} /></div>
  {#each app.tray as account (account.username)}
    <div role="listitem">
      <StoryAvatar {account} showBadge={showBadges} onopen={() => app.open(account, 'tray')} />
    </div>
  {/each}
</div>

<style>
  .tray {
    display: flex;
    gap: 4px;
    /* Room above for badges, which overlap the avatar's top edge. */
    padding: 10px 10px 12px;
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 0.5px solid #262626;
  }
  .tray::-webkit-scrollbar {
    display: none;
  }
</style>
