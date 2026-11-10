<script lang="ts">
  import type { Account } from '../data/types';
  import { avatarUri } from '../lib/avatar';
  import { hasUnseen } from '../lib/tray';

  let {
    account,
    isSelf = false,
    onopen,
  }: { account: Account; isSelf?: boolean; onopen?: () => void } = $props();

  const unseen = $derived(hasUnseen(account));
</script>

<button
  class="item"
  type="button"
  aria-label={isSelf ? 'Your story' : `Story by ${account.username}, ${unseen ? 'not seen' : 'seen'}`}
  data-testid={isSelf ? 'tray-self' : `tray-${account.username}`}
  onclick={() => onopen?.()}
>
  <span
    class="ring"
    class:unseen={unseen && !isSelf}
    class:seen={!unseen && !isSelf}
    class:close-friends={account.closeFriends && unseen}
  >
    <img src={avatarUri(account.avatarSeed, account.avatarBg)} alt="" draggable="false" />
    {#if isSelf}
      <span class="add" aria-hidden="true">+</span>
    {/if}
  </span>
  <span class="name">{isSelf ? 'Your story' : account.username}</span>
</button>

<style>
  .item {
    flex-shrink: 0;
    width: 84px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .ring {
    position: relative;
    width: 76px;
    height: 76px;
    border-radius: 50%;
    padding: 3px;
    box-sizing: border-box;
    display: grid;
    place-items: center;
  }
  .ring.unseen {
    background: conic-gradient(from 200deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75);
  }
  .ring.close-friends {
    background: #1db954;
  }
  .ring.seen {
    background: #363636;
    padding: 2px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid #000;
    box-sizing: border-box;
    background: #222;
  }
  .add {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid #000;
    background: #fff;
    color: #000;
    display: grid;
    place-items: center;
    font: 700 17px/1 system-ui, sans-serif;
  }
  .name {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 400 12px/1.2 -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
    color: #f5f5f5;
  }
  .item:focus {
    outline: none;
  }
  .item:focus-visible .ring {
    outline: 2px solid #4f5bd5;
    outline-offset: 2px;
  }
</style>
