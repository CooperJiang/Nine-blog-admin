const Layout = () => import('@/layout/index.vue')

export default {
    path: '/tools/type',
    component: Layout,
    redirect: '/tools/type/index',
    name: 'toolsType',
    meta: {title: '分类管理', icon: 'menu-type'},
    children: [
        {
            path: 'index',
            name: 'toolsTypeIndex',
            component: () => import('@/views/tools/type/index.vue'),
            meta: {title: '工具分类'}
        }
    ]
}
