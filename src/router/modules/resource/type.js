const Layout = () => import('@/layout/index.vue')

export default {
    path: '/resource/type',
    component: Layout,
    redirect: '/resource/type/index',
    name: 'resourceType',
    meta: {title: '分类管理', icon: 'menu-type'},
    children: [
        {
            path: 'index',
            name: 'resourceTypeIndex',
            component: () => import('@/views/resource/type/index.vue'),
            meta: {title: '资源列表'}
        }
    ]
}
