const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    name: 'article',
    meta: {title: '文章管理', icon: 'menu-article'},
    children: [
        {
            path: 'index',
            name: 'articleIndex',
            component: () => import('@/views/blog/article/index.vue'),
            meta: {title: '文章列表'}
        },
        {
            path: 'add',
            name: 'articleAdd',
            component: () => import('@/views/blog/article/addArticle/index.vue'),
            meta: {title: '添加文章', activeMenu: '/article/index', sidebar: false}
        }
    ]
}
