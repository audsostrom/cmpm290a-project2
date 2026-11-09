<script lang="ts">
  import ExperimentConsole from './components/ExperimentConsole.svelte';
  import HomeFeed from './components/HomeFeed.svelte';
  import Phone from './components/Phone.svelte';
  import StoryViewer from './components/StoryViewer.svelte';
  import { app } from './lib/state.svelte';
</script>

<main class:clean={app.clean} data-variant={app.variant}>
  <Phone>
    <HomeFeed />
    {#if app.viewer}
      {#key app.viewer}
        <StoryViewer viewer={app.viewer} />
      {/key}
    {/if}
  </Phone>
  {#if !app.clean}<ExperimentConsole />{/if}
</main>

<style>
  :global(html, body) {
    margin: 0;
    min-height: 100%;
    background: #ececf1;
  }
  :global(*) {
    -webkit-font-smoothing: antialiased;
  }
  main {
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 32px 16px;
    box-sizing: border-box;
  }
  main.clean {
    background: #ececf1;
  }
</style>
