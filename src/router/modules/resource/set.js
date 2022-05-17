const Layout = () => import('@/layout/index.vue')

export default {
    path: '/resource/set',
    component: Layout,
    redirect: '/resource/type/set',
    name: 'resourceSet',
    meta: {title: '资源管理', icon: 'menu-article'},
    children: [
        {
            path: 'index',
            name: 'resourceSetIndex',
            component: () => import('@/views/resource/set/index.vue'),
            meta: {title: '资源列表'}
        }
    ]
}
