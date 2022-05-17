const Layout = () => import('@/layout/index.vue')

export default {
    path: '/tools/set',
    component: Layout,
    redirect: '/tools/type/set',
    name: 'toolsSet',
    meta: {title: '工具管理', icon: 'menu-article'},
    children: [
        {
            path: 'index',
            name: 'toolsSetIndex',
            component: () => import('@/views/tools/set/index.vue'),
            meta: {title: '工具列表'}
        }
    ]
}
