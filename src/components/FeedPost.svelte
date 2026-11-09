<script lang="ts">
  import type { Account, Story } from '../data/types';
  import { avatarUri } from '../lib/avatar';
  import { app } from '../lib/state.svelte';
  import { hasUnseen } from '../lib/tray';
  import Icon from './Icon.svelte';
  import Scene from './Scene.svelte';

  let { account, story, likes }: { account: Account; story: Story; likes: number } = $props();
  const unseen = $derived(hasUnseen(account));
</script>

<article class="post">
  <header>
    <!-- Opening stories from a post's avatar is NOT a tray session: no exposure, no progress label. -->
    <button
      class="avatar"
      class:ring={unseen}
      type="button"
      aria-label="View {account.username}'s story from post"
      data-testid="post-avatar-{account.username}"
      onclick={() => app.open(account, 'feed')}
    >
      <img src={avatarUri(account.avatarSeed, account.avatarBg)} alt="" />
    </button>
    <span class="user">{account.username}</span>
    {#if account.verified}<Icon name="verified" size={14} />{/if}
    <span class="spacer"></span>
    <Icon name="more" size={20} />
  </header>
  <div class="media"><Scene scene={story.scene} palette={story.palette} caption="" /></div>
  <div class="actions">
    <Icon name="heart" /><Icon name="comment" /><Icon name="send" />
    <span class="spacer"></span><Icon name="bookmark" />
  </div>
  <p class="likes">{likes.toLocaleString('en-US')} likes</p>
  <p class="text"><b>{account.username}</b> {story.caption}</p>
</article>

<style>
  .post {
    padding-bottom: 14px;
    font: 14px/1.35 -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  }
  header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
  }
  .avatar {
    width: 34px;
    height: 34px;
    padding: 2px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
  }
  .avatar.ring {
    background: conic-gradient(from 200deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75);
  }
  .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #000;
    box-sizing: border-box;
  }
  .user {
    font-weight: 600;
  }
  .spacer {
    flex: 1;
  }
  .media {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
  }
  .actions {
    display: flex;
    gap: 16px;
    padding: 10px 12px 6px;
  }
  .likes,
  .text {
    margin: 0 12px 4px;
  }
  .likes {
    font-weight: 600;
  }
</style>
