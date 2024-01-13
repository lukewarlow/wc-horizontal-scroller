import {defineConfig} from 'vite';
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [],
    build: {
        modulePreload: {
            polyfill: false,
        },
        target: 'esnext',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'index',
            fileName: 'index'
        },
    },
})
