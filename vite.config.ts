import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

// Deployed to Vercel, which serves the site from the domain root.
export default defineConfig({
  plugins: [svelte()],
  server: { port: 5190 },
  preview: { port: 5191 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
