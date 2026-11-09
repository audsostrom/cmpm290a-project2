import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

// Served from https://audsostrom.github.io/cmpm290a-project2/ when deployed to GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/cmpm290a-project2/' : '/',
  plugins: [svelte()],
  server: { port: 5190 },
  preview: { port: 5191 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
}));
