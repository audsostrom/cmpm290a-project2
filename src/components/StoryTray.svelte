<script lang="ts">
  import { SELF } from '../data/mock';
  import { app } from '../lib/state.svelte';
  import StoryAvatar from './StoryAvatar.svelte';
</script>

<div class="tray" data-testid="story-tray" role="list" aria-label="Stories">
  <div role="listitem"><StoryAvatar account={SELF} isSelf /></div>
  {#each app.tray as account (account.username)}
    <div role="listitem">
      <StoryAvatar {account} onopen={() => app.open(account, 'tray')} />
    </div>
  {/each}
</div>

<style>
  .tray {
    display: flex;
    gap: 4px;
    padding: 10px 10px 12px;
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 0.5px solid #262626;
  }
  .tray::-webkit-scrollbar {
    display: none;
  }
</style>
