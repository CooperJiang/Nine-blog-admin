const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article/type',
    component: Layout,
    redirect: '/article/type/index',
    name: 'ArticleType',
    meta: {title: '分类管理', icon: 'menu-type'},
    children: [
        {
            path: 'index',
            name: 'ArticleTypeIndex',
            component: () => import('@/views/blog/type/index.vue'),
            meta: {title: '分类列表'}
        }
    ]
}
