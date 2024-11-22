import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

import eslintPlugin from 'vite-plugin-eslint' //导入包
import vueJsx from '@vitejs/plugin-vue-jsx'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, //注意，这一句是在less对象中，写在外边不起作用
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),

    vueJsx(), // 支持jsx
    eslintPlugin(),

    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: '[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),

    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    outDir: './h7',
  },
  base: '/h7',
  server: {
    host: '0.0.0.0',
    port: 8080, //启动端口
    open: true, // 运行是否自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://47.103.197.242:8098',
        // target: "http://192.168.1.101:8098",
        changeOrigin: true,
        // pathRewrite: {},
      },
    },
  },
})
