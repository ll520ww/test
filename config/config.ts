import {defineConfig} from '@umijs/max';
import routes from "./routes"
import proxy from "./proxy"

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    dva: {
        immer: {}
    },
    initialState: {},
    request: {},
    layout: {
        title: '@umijs/max',
    },
    proxy: proxy["dev"],
    routes: routes,
    npmClient: 'pnpm',
    define: {
        ENV: 'test',
    },
    alias: {
        '@a': '@/assets/',
        '@c': '@/components/',
        '@v': '@/pages/',
        '@l': '@/less/',
        '@u': '@/utils/',
        '@s': '@/services/',
    },
    // 忽略moment的locale文件 用于减少尺寸
    ignoreMomentLocale: true,
    // 配置是否生成额外用于描述产物的manifest文件，默认会生成asset-manifest.json
    manifest: {
        basePath: '/',
    },
    fastRefresh: true,
    // 配置主题
    theme: {
        '@primary-color': '#3180F5',
        '@font-size-base': '14px',
        '@line-height-base': '1.2',
    },
    // links 配置额外的link标签
    links: [],
    // <head>里额外的脚本
    headScripts: [],
    favicons: ["https://domain.com/favicon.ico"]
});

