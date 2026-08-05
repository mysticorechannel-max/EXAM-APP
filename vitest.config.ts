import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
            '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
            '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
    },
});
