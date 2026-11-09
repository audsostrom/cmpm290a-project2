<!-- iPhone-sized frame (390×844) with status bar, so recordings and mocks match the report's screenshot. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div class="device" data-testid="phone">
  <div class="screen">
    <div class="status" aria-hidden="true">
      <span class="time">9:27</span>
      <span class="island"></span>
      <span class="indicators">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" opacity=".35"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0Zm-4.2-4.3a6 6 0 0 1 8.4 0l1.4-1.4a8 8 0 0 0-11.2 0Zm-2.8-2.8a10 10 0 0 1 14 0L16.4 3a12 12 0 0 0-16.8 0Z" fill="currentColor"/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/><rect x="24" y="4" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".4"/></svg>
      </span>
    </div>
    <div class="content">{@render children()}</div>
  </div>
</div>

<style>
  .device {
    width: 390px;
    height: 844px;
    padding: 12px;
    border-radius: 64px;
    background: #1b1b1d;
    box-shadow:
      0 0 0 2px #3a3a3c inset,
      0 30px 80px rgb(0 0 0 / 0.45);
    flex-shrink: 0;
  }
  .screen {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 52px;
    overflow: hidden;
    background: #000;
    color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }
  .status {
    position: relative;
    z-index: 30;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 30px 0 40px;
    font: 600 16px/1 -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  }
  .island {
    position: absolute;
    left: 50%;
    top: 11px;
    width: 120px;
    height: 34px;
    margin-left: -60px;
    border-radius: 20px;
    background: #000;
  }
  .indicators {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .content {
    position: relative;
    flex: 1;
    min-height: 0;
  }
</style>
