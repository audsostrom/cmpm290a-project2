<!-- Stylized, illustrated story content: a gradient and a few shapes per scene, plus a caption. -->
<script lang="ts">
  import type { SceneKind } from '../data/types';
  let {
    scene,
    palette,
    caption,
  }: { scene: SceneKind; palette: readonly [string, string]; caption: string } = $props();

  /** Skyline: [x, height] per building. */
  const buildings: ReadonlyArray<readonly [number, number]> = [
    [20, 120],
    [60, 80],
    [105, 140],
    [150, 60],
    [200, 110],
    [245, 90],
  ];
</script>

<div class="scene" style:background="linear-gradient(160deg, {palette[0]}, {palette[1]})">
  <svg class="art" viewBox="0 0 300 300" aria-hidden="true">
    {#if scene === 'sunset' || scene === 'beach'}
      <circle cx="150" cy="170" r="70" fill="#ffe8a3" opacity=".9" />
      <rect x="0" y="190" width="300" height="110" fill="#000" opacity=".25" />
      <path d="M0 215 Q75 200 150 215 T300 215" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" />
      <path d="M0 240 Q75 225 150 240 T300 240" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" />
    {:else if scene === 'stage'}
      <polygon points="40,0 110,260 0,260" fill="#fff" opacity=".12" />
      <polygon points="260,0 300,260 190,260" fill="#fff" opacity=".12" />
      <polygon points="150,0 200,260 100,260" fill="#ffd166" opacity=".18" />
      {#each Array.from({ length: 14 }, (_, i) => i) as i (i)}
        <circle cx={10 + i * 21} cy={265 + (i % 3) * 6} r="16" fill="#000" opacity=".55" />
      {/each}
    {:else if scene === 'food'}
      <circle cx="150" cy="160" r="95" fill="#fff" opacity=".9" />
      <circle cx="150" cy="160" r="70" fill="#000" opacity=".08" />
      <circle cx="125" cy="145" r="18" fill="#f4a261" /><circle cx="170" cy="150" r="20" fill="#e9c46a" />
      <circle cx="148" cy="185" r="16" fill="#2a9d8f" />
    {:else if scene === 'pet'}
      <ellipse cx="150" cy="190" rx="90" ry="60" fill="#fff" opacity=".9" />
      <circle cx="150" cy="135" r="55" fill="#fff" />
      <circle cx="130" cy="130" r="6" fill="#333" /><circle cx="170" cy="130" r="6" fill="#333" />
      <path d="M140 150 q10 10 20 0" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round" />
      <polygon points="105,100 120,60 140,92" fill="#fff" /><polygon points="195,100 180,60 160,92" fill="#fff" />
    {:else if scene === 'mountain'}
      <polygon points="0,260 90,110 160,260" fill="#fff" opacity=".85" />
      <polygon points="90,260 200,70 300,260" fill="#fff" opacity=".95" />
      <polygon points="200,70 228,120 172,120" fill="#e0fbfc" />
      <circle cx="245" cy="55" r="22" fill="#fff6d5" />
    {:else if scene === 'city' || scene === 'film'}
      {#each buildings as [x, h] (x)}
        <rect x={x} y={260 - h * 1.4} width="38" height={h * 1.4} fill="#000" opacity=".45" />
        <rect x={x + 8} y={270 - h * 1.3} width="6" height="6" fill="#ffe066" opacity=".9" />
      {/each}
    {:else if scene === 'books'}
      {#each [0, 1, 2, 3, 4] as i (i)}
        <rect x={70 + i * 34} y={90 + (i % 2) * 14} width="28" height={160 - (i % 2) * 14} rx="3" fill="#fff" opacity={0.55 + i * 0.08} />
      {/each}
    {:else if scene === 'run'}
      <path d="M20 240 C 90 180, 150 260, 280 150" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="2 22" />
      <circle cx="280" cy="150" r="14" fill="#fff" />
    {:else if scene === 'art'}
      <circle cx="110" cy="130" r="60" fill="#fff" opacity=".8" />
      <rect x="130" y="140" width="110" height="110" rx="20" fill="#000" opacity=".2" />
      <path d="M60 230 q60 -60 120 0 t120 0" stroke="#fff" stroke-width="8" fill="none" />
    {:else if scene === 'code'}
      {#each [0, 1, 2, 3, 4, 5] as i (i)}
        <rect x={50 + (i % 3) * 18} y={80 + i * 26} width={90 + ((i * 37) % 110)} height="12" rx="6" fill={i % 2 ? '#22c55e' : '#fff'} opacity=".75" />
      {/each}
    {/if}
  </svg>
  <p class="caption">{caption}</p>
</div>

<style>
  .scene {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .art {
    width: 82%;
    max-height: 62%;
  }
  .caption {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 22%;
    margin: 0;
    padding: 8px 12px;
    text-align: center;
    font: 700 22px/1.25 -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
    color: #fff;
    text-shadow: 0 2px 10px rgb(0 0 0 / 0.45);
  }
</style>
