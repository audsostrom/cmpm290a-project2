<script lang="ts">
  import { app } from '../lib/state.svelte';
  import FeedPost from './FeedPost.svelte';
  import Icon from './Icon.svelte';
  import StoryTray from './StoryTray.svelte';

  const byName = (u: string) => app.accounts.find((a) => a.username === u)!;
  const posts = $derived([
    { account: byName('lune.studio'), likes: 2841 },
    { account: byName('ari_in_the_alps'), likes: 512 },
    { account: byName('sam.cooks'), likes: 1290 },
  ]);
</script>

<div class="home">
  <header class="top">
    <Icon name="plus" size={26} />
    <!-- Text wordmark only (no brand asset): this is a course prototype. -->
    <span class="wordmark">Instagram <Icon name="chevron-down" size={16} /></span>
    <Icon name="heart" size={26} />
  </header>
  <div class="scroll">
    <StoryTray />
    {#each posts as post (post.account.username)}
      <FeedPost account={post.account} story={post.account.stories[0]!} likes={post.likes} />
    {/each}
  </div>
  <nav class="tabs" aria-label="Tabs">
    <Icon name="home" size={26} filled /><Icon name="search" size={26} /><Icon name="reels" size={26} />
    <Icon name="shop" size={26} />
    <span class="me"></span>
  </nav>
</div>

<style>
  .home {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px 8px;
  }
  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font: 400 32px/1 'Grand Hotel', cursive;
  }
  .scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .scroll::-webkit-scrollbar {
    display: none;
  }
  .tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0 30px;
    border-top: 0.5px solid #262626;
    background: #000;
  }
  .me {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 35%, #f4d6c9 35%, #c9a28f 36%);
  }
</style>
