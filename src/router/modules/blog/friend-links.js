const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article/friend-links',
    component: Layout,
    redirect: '/article/friend-links/index',
    name: 'FriendLinks',
    meta: {title: '友链管理', icon: 'sidebar-friend-link'},
    children: [
        {
            path: 'index',
            name: 'FriendLinksIndex',
            component: () => import('@/views/blog/friend-links/index.vue'),
            meta: {title: '友链列表'}
        }
    ]
}
