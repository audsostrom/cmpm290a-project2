<!--
  Researcher-facing panel (outside the phone): switch A/B, watch exposure logging (report §6) and the
  primary metric (report §3). Hidden in clean mode (?clean=1) for recordings.
-->
<script lang="ts">
  import { app } from '../lib/state.svelte';

  const fmt = (n: number | null) => (n === null ? '–' : n.toFixed(1));
  const live = $derived(app.viewer?.session ?? null);
</script>

<aside class="console" aria-label="Experiment console">
  <h1>Stories tray experiment</h1>
  <p class="sub">CMPM 290A · Project 2 prototype</p>

  <div class="switch" role="radiogroup" aria-label="Variant">
    {#each [['A', 'A · control'], ['B', 'B · treatment']] as const as [v, label] (v)}
      <button
        type="button"
        role="radio"
        aria-checked={app.variant === v}
        class:on={app.variant === v}
        onclick={() => app.setVariant(v)}
      >
        {label}
      </button>
    {/each}
  </div>
  <p class="hint">
    {#if app.variant === 'B'}
      The viewer shows “4 of 11” tray progress beside the username.
    {:else}
      Current experience: no tray progress.
    {/if}
  </p>

  <h2>Primary metric</h2>
  <dl class="metrics">
    <div><dt>Accounts viewed / tray session</dt><dd data-testid="metric-accounts">{fmt(app.metrics.accountsPerSession)}</dd></div>
    <div><dt>Tray sessions ({app.variant})</dt><dd>{app.metrics.sessions}</dd></div>
    {#if live}
      <div class="live"><dt>Current session</dt><dd>{live.accountsViewed.length} accounts</dd></div>
    {/if}
  </dl>

  <div class="footer">
    <button type="button" onclick={() => app.reset()}>Reset demo</button>
    <span>Keys: ← → stories · Shift+← → accounts · Space pause · Esc close. Add <code>?clean=1</code> to hide this panel.</span>
  </div>
</aside>

<style>
  .console {
    width: 360px;
    max-height: 844px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 22px;
    border-radius: 18px;
    background: #fff;
    color: #1c1c1e;
    box-shadow: 0 20px 60px rgb(0 0 0 / 0.12);
    font: 14px/1.45 -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }
  h1 {
    margin: 0;
    font-size: 19px;
  }
  h2 {
    margin: 14px 0 2px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6b6b70;
  }
  .sub,
  .hint {
    margin: 0;
    color: #6b6b70;
  }
  .switch {
    display: flex;
    margin-top: 12px;
    padding: 3px;
    border-radius: 10px;
    background: #f0f0f3;
  }
  .switch button {
    flex: 1;
    padding: 8px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    font: inherit;
    font-weight: 600;
    color: #6b6b70;
    cursor: pointer;
  }
  .switch button.on {
    background: #fff;
    color: #1c1c1e;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  }
  .metrics {
    margin: 0;
    display: grid;
    gap: 4px;
  }
  .metrics div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  dt {
    color: #3a3a3c;
  }
  dd {
    margin: 0;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .live dd {
    color: #d62976;
  }
  .log {
    flex: 1;
    min-height: 120px;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
    font-size: 12px;
  }
  .log li {
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f3;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 8px;
  }
  .time {
    color: #8e8e93;
    font-variant-numeric: tabular-nums;
  }
  .name {
    font-weight: 600;
    color: #4f5bd5;
  }
  .payload {
    grid-column: 1 / -1;
    color: #3a3a3c;
    word-break: break-all;
  }
  .empty {
    color: #8e8e93;
  }
  .footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
    color: #6b6b70;
  }
  .footer button {
    align-self: flex-start;
    padding: 7px 14px;
    border: 1px solid #d1d1d6;
    border-radius: 8px;
    background: #fff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
</style>
