import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';

// @ts-ignore
import viteCompression from 'vite-plugin-compression';

const files = readdirSync(path.join(__dirname, 'server'));
const entries = {};
files.forEach((file) => {
  const name = file.match(/^([^\.]+)\./).pop();
  entries[name] = path.join(__dirname, `server/${file}`);
});

export default defineConfig(({ mode }) => {
  const { VITE_APP_WEB_URL } = loadEnv(mode, process.cwd());
  console.log('VITE_APP_WEB_URL ===>', VITE_APP_WEB_URL);
  return {
    base: VITE_APP_WEB_URL || './', // 打包路径
    plugins: [
      vue(),
      // gzip压缩 生产环境生成 .gz 文件
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      copy({
        targets: [{ src: 'dist/client/server/', dest: 'dist/' }],
        hook: 'writeBundle',
      }),
      del({ targets: 'dist/client/server', hook: 'closeBundle' }),
    ],
    // 配置别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/main.scss";',
        },
      },
      postcss: {
        plugins: [
          // 移除打包element时的@charset警告
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    // 启动服务配置
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: true,
      https: false,
      proxy: {
        '/api': {
          target: 'http://activity-erm.atguat.com.cn', // 赛事运营活动
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/motivate': {
          target: 'http://activity-erm.atguat.com.cn', // 激励任务
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/topicList': {
          target: 'http://live.atguat.com.cn', // 实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/topicList/, ''),
        },
        '/uplod': {
          target: 'http://etm.m.gomeuat.com.cn', // 图片上传
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/uplod/, ''),
        },
        '/baseurl': {
          target: 'http://activity-erm.gomeuat.com.cn/', // 实际请求地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/baseurl/, ''),
        },
        '/badgeapi': {
          // target: 'http://badge.gomeuat.com.cn', // 徽章活动
          target: 'http://badge.atguat.com.cn', // 徽章活动
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/badgeapi/, ''),
        },
      },
    },
    // 生产环境打包配置
    // 去除 console debugger
    build: {
      outDir: 'dist/client',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      assetsDir: '',
      rollupOptions: {
        input: entries,
      },
      minify: 'terser',
    },
  };
});
