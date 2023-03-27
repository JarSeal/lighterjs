import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: './LIGHTER/index.js',
      name: 'Lighter JS',
      fileName: 'index',
    },
    manifest: true,
    minify: true,
    reportCompressedSize: true,
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
