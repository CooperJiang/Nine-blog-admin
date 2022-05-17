const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article/tag',
    component: Layout,
    redirect: '/article/tag/index',
    name: 'ArticleTag',
    meta: {title: '标签管理', icon: 'menu-tag'},
    children: [
        {
            path: 'index',
            name: 'ArticleTagIndex',
            component: () => import('@/views/blog/tag/index.vue'),
            meta: {title: '标签列表'}
        }
    ]
}
