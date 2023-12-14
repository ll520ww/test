export default [
    {
        name: '不展示全局布局',
        layout: false,
        routes: [
            {path: '/*', component: '@/pages/StatusPages/404.tsx'},
            {path: '/500', component: '@/pages/StatusPages/500.tsx'},
        ],
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        name: '首页',
        path: '/home',
        component: './Home',
    },
    {
        name: '权限演示',
        path: '/access',
        component: './Access',
    },
    {
        name: ' CRUD 示例',
        path: '/table',
        component: './Table',
    },
];
