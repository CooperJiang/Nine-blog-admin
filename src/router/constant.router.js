import store from '@/store'

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: {title: '登录'}
    },
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        redirect: '/dashboard/index',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/index.vue'),
                meta: {title: () => store.state.settings.dashboardTitle }
            },
            {
                path: 'personal/setting',
                name: 'personalSetting',
                component: () => import('@/views/personal/setting.vue'),
                meta: {
                    title: '个人设置',
                    breadcrumbNeste: [
                        { title: '个人设置', path: '/personal/setting' }
                    ]
                }
            },
            {
                path: 'personal/edit/password',
                name: 'personalEditPassword',
                component: () => import('@/views/personal/edit.password.vue'),
                meta: {
                    title: '修改密码',
                    breadcrumbNeste: [
                        { title: '修改密码', path: '/personal/edit/password' }
                    ]
                }
            },
            {
                path: 'reload',
                name: 'reload',
                component: () => import('@/views/reload.vue')
            }
        ]
    }
]

export const lastRoute = {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue'),
    meta: {
        title: '找不到页面'
    }
}
