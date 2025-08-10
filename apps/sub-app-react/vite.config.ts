import {defineConfig} from 'vite'
import qiankun from "vite-plugin-qiankun";

// https://vite.dev/config/
export default defineConfig({
    plugins: [qiankun('sub-app-react', {
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