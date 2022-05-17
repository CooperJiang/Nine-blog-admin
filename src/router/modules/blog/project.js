const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article/project',
    component: Layout,
    redirect: '/article/project/index',
    name: 'Project',
    meta: {title: '项目管理', icon: 'sidebar-project'},
    children: [
        {
            path: 'index',
            name: 'ProjectIndex',
            component: () => import('@/views/blog/project/index.vue'),
            meta: {title: '项目列表'}
        }
    ]
}
