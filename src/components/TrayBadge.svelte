<!--
  B treatment: how many stories an account has up and how old the newest is, as a red badge on the
  avatar's top-right (from the report's mock: "3 posts" over "20h").
-->
<script lang="ts">
  let { lines }: { lines: [string, string] } = $props();
</script>

<span class="badge" data-testid="tray-badge" aria-label="{lines[0]}, newest {lines[1]} ago">
  <span class="count">{lines[0]}</span>
  <span class="age">{lines[1]}</span>
</span>

<style>
  .badge {
    position: absolute;
    top: -6px;
    right: -10px;
    min-width: 40px;
    height: 40px;
    padding: 0 5px;
    box-sizing: border-box;
    border: 2.5px solid #000;
    border-radius: 20px;
    background: #ff3040;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font: 800 9.5px/1.08 -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
    letter-spacing: -0.1px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgb(0 0 0 / 0.35);
    animation: pop 260ms cubic-bezier(0.2, 0.9, 0.3, 1.3);
  }
  .age {
    font-weight: 700;
    opacity: 0.95;
  }
  @keyframes pop {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .badge {
      animation: none;
    }
  }
</style>
