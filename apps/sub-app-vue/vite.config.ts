import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), qiankun('sub-app-vue', {
        useDevMode: true,
    })],

    base: '/',
    server: {
        port: 7101,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    build: {
        target: 'esnext',
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                format: 'umd',
                name: 'subAppReact',
            }
        }
    }
})
