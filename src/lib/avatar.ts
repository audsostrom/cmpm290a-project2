import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

const cache = new Map<string, string>();

/** Illustrated, license-free avatar (DiceBear "Lorelei"), generated offline as a data URI. */
export function avatarUri(seed: string, background: string): string {
  const key = `${seed}:${background}`;
  let uri = cache.get(key);
  if (!uri) {
    uri = createAvatar(lorelei, { seed, backgroundColor: [background] }).toDataUri();
    cache.set(key, uri);
  }
  return uri;
}
