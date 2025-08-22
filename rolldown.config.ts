import { defineConfig } from 'rolldown';

// tiny helper to keep paths tidy
const out = (file: string) => file;

export default defineConfig({
  input: {
    // entry points
    'content/index': 'src/content/index.ts',
    'background/worker': 'src/background/worker.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
  // Rolldown auto-handles TS via esbuild under the hood.
  // If you import CSS, you'll need a plugin; easier: copy CSS (see step 4).
  treeshake: true,
});