import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@/shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
            '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
            '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    query: ['@tanstack/react-query'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    ui: ['clsx', 'tailwind-merge', 'lucide-react', 'sonner'],
                    state: ['zustand'],
                },
            },
        },
    },
});
