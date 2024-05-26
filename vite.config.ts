import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    base: "/webui",
    plugins: [vue()],
    server: {
        port: 8081,
        proxy: {
            '/api':{
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    },
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'./src')
        }
    }
})
