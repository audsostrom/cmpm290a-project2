<!-- Outline icons (24px grid) for the mock UI. Drawn here so no icon font or brand assets are needed. -->
<script module lang="ts">
  export type IconName =
    | 'plus'
    | 'chevron-down'
    | 'heart'
    | 'comment'
    | 'send'
    | 'bookmark'
    | 'home'
    | 'search'
    | 'reels'
    | 'shop'
    | 'more'
    | 'close'
    | 'verified';
</script>

<script lang="ts">
  let { name, size = 24, filled = false }: { name: IconName; size?: number; filled?: boolean } =
    $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.9"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'plus'}
    <path d="M12 5v14M5 12h14" />
  {:else if name === 'chevron-down'}
    <path d="m6 9 6 6 6-6" />
  {:else if name === 'heart'}
    <path
      fill={filled ? 'currentColor' : 'none'}
      d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.7 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.2 4.4 6.7-1.7 4.7-9.2 9.3-9.2 9.3Z"
    />
  {:else if name === 'comment'}
    <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5Z" />
  {:else if name === 'send'}
    <path d="M21.5 3 10.2 14.3M21.5 3l-7 18-4.3-6.7L3.5 10Z" />
  {:else if name === 'bookmark'}
    <path d="M18.5 21 12 15.5 5.5 21V4.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1Z" />
  {:else if name === 'home'}
    <path fill={filled ? 'currentColor' : 'none'} d="M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1Z" />
  {:else if name === 'search'}
    <circle cx="10.5" cy="10.5" r="7" /><path d="m20.5 20.5-5-5" />
  {:else if name === 'reels'}
    <rect x="3" y="3" width="18" height="18" rx="5" /><path d="M3 8h18M8.5 3l3 5M14.5 3l3 5M10 11.5v6l5-3Z" />
  {:else if name === 'shop'}
    <path d="M5 7.5h14l-1.2 12.1a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4ZM9 7.5V6a3 3 0 0 1 6 0v1.5" />
  {:else if name === 'more'}
    <circle cx="5" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="19" cy="12" r="1.3" fill="currentColor" />
  {:else if name === 'close'}
    <path d="M6 6l12 12M18 6 6 18" />
  {:else if name === 'verified'}
    <path fill="#3897f0" stroke="none" d="m12 2 2.4 1.8 3-.2.9 2.8 2.5 1.7-1 2.9 1 2.9-2.5 1.7-.9 2.8-3-.2L12 22l-2.4-1.8-3 .2-.9-2.8-2.5-1.7 1-2.9-1-2.9 2.5-1.7.9-2.8 3 .2Z" />
    <path stroke="#fff" stroke-width="2" d="m8.5 12 2.3 2.3 4.7-4.6" />
  {/if}
</svg>
