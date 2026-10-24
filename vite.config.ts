import { defineConfig } from 'vite';

// Relativa sökvägar gör att dist/ fungerar var den än kopieras, även i en undermapp.
export default defineConfig({
  base: './',
});
