const Layout = () => import('@/layout/index.vue')

export default {
    path: '/dashboard/user',
    component: Layout,
    redirect: '/dashboard/user/list',
    name: 'dashboardUser',
    meta: {title: '用户管理', icon: 'sidebar-user'},
    children: [
        {
            path: 'list',
            name: 'dashboardUserList',
            component: () => import('@/views/dashboard/user/index.vue'),
            meta: {title: '用户列表'}
        }
    ]
}
