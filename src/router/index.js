import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import path from 'path-browserify'
import {constantRoutes, lastRoute} from './constant.router'

import Dashboard from './modules/dashboard/index'
import BlogRoute from './modules/blog/index'
import ResourceRoute from './modules/resource/index'
import ToolsRoute from './modules/tools/index'

// 动态路由（异步路由、导航栏路由）
export const asyncRoutes = [
    {
        meta: {title: '主页', icon: 'sidebar-dashboard'},
        children: Dashboard
    },
    {
        meta: {title: '博客', icon: 'sidebar-blog'},
        children: BlogRoute
    },
    {
        meta: {title: '资源', icon: 'sidebar-resource'},
        children: ResourceRoute
    },
    {
        meta: {title: '工具', icon: 'sidebar-tools'},
        children: ToolsRoute
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})

router.beforeEach(async(to, from, next) => {
    store.state.settings.enableProgress && NProgress.start()
    // 已经登录，但还没根据权限动态生成并挂载路由
    if (store.getters['user/isLogin'] && !store.state.menu.isGenerate) {
        let accessRoutes = []
        store.dispatch('user/getInfo')
        /* 没有开启后端拿权限的时候就走本地生成 */
        if (!store.state.settings.enableBackendReturnRoute) {
            log.primary('生成了本地菜单')
            accessRoutes = await store.dispatch('menu/generateRoutesAtFront', {
                asyncRoutes,
                currentPath: to.path
            })
        } else {
            log.primary('生成了服务端获取的菜单')
            accessRoutes = await store.dispatch('menu/generateRoutesAtBack', {
                currentPath: to.path
            })
        }
        accessRoutes.push(lastRoute)
        let removeRoutes = []
        accessRoutes.forEach(route => {
            removeRoutes.push(router.addRoute(route))
        })
        // 记录的 accessRoutes 路由数据，在登出时会使用到，不使用 router.removeRoute 是考虑配置的路由可能不一定有设置 name ，则通过调用 router.addRoute() 返回的回调进行删除
        store.commit('menu/setCurrentRemoveRoutes', removeRoutes)
        next({ ...to, replace: true })
    } else {
        if (store.state.menu.isGenerate && store.state.settings.menuMode !== 'single') {
            store.commit('menu/setHeaderActived', to.path)
        }
        if (store.getters['user/isLogin']) {
            if (to.name) {
                if (to.matched.length !== 0) {
                    // 如果已登录状态下，进入登录页会强制跳转到控制台页面
                    if (to.name == 'login') {
                        next({
                            name: 'dashboard',
                            replace: true
                        })
                    } else if (!store.state.settings.enableDashboard && to.name == 'dashboard') {
                        // 如果未开启控制台页面，则默认进入侧边栏导航第一个模块
                        if (store.getters['menu/sidebarRoutes'].length > 0) {
                            // 此处没有使用 store.getters['menu/sidebarRoutes'][0].path 直接进行跳转是因为会有个隐性 bug ，即当父级路由如果设置了 redirect ，而 redirect 对应的嵌套子路由由于没有权限导致没有被注册，此时则会无限进入 404 页面
                            let getDeepestPath = (routes, rootPath = '') => {
                                let retnPath
                                if (routes.children) {
                                    if (
                                        routes.children.some(item => {
                                            return item.meta.sidebar != false
                                        })
                                    ) {
                                        for (let i = 0; i < routes.children.length; i++) {
                                            if (routes.children[i].meta.sidebar != false) {
                                                retnPath = getDeepestPath(routes.children[i], path.resolve(rootPath, routes.path))
                                                break
                                            }
                                        }
                                    } else {
                                        retnPath = getDeepestPath(routes.children[0], path.resolve(rootPath, routes.path))
                                    }
                                } else {
                                    retnPath = path.resolve(rootPath, routes.path)
                                }
                                return retnPath
                            }
                            next({
                                path: getDeepestPath(store.getters['menu/sidebarRoutes'][0]),
                                replace: true
                            })
                        } else {
                            next()
                        }
                    } else {
                        next()
                    }
                } else {
                    // 如果是通过 name 跳转，并且 name 对应的路由没有权限时，需要做这步处理，手动指向到 404 页面
                    next({
                        path: '/404'
                    })
                }
            } else {
                next()
            }
        } else {
            if (to.name != 'login') {
                next({
                    name: 'login',
                    query: {
                        redirect: to.fullPath
                    }
                })
            } else {
                next()
            }
        }
    }
})

router.afterEach((to, from) => {
    store.state.settings.enableProgress && NProgress.done()
    // 设置页面 title
    to.meta.title && store.commit('settings/setTitle', typeof to.meta.title === 'function' ? to.meta.title() : to.meta.title)
    // 判断当前页面是否开启缓存，如果开启，则将当前页面的 name 信息存入 keep-alive 全局状态
    if (to.meta.cache) {
        let componentName = to.matched[to.matched.length - 1].components.default.name
        if (componentName) {
            to.matched.forEach(item => {
                if (item.components.default.name && item.components.default.name != 'Layout') {
                    store.commit('keepAlive/add', item.components.default.name)
                }
            })
        } else {
            console.warn('该页面组件未设置组件名，会导致缓存失效，请检查')
        }
    }
    // 判断离开页面是否开启缓存，如果开启，则根据缓存规则判断是否需要清空 keep-alive 全局状态里离开页面的 name 信息
    if (from.meta.cache) {
        let componentName = from.matched[from.matched.length - 1].components.default.name
        // 通过 meta.cache 判断针对哪些页面进行缓存
        switch (typeof from.meta.cache) {
            case 'string':
                if (from.meta.cache != to.name) {
                    store.commit('keepAlive/remove', componentName)
                }
                break
            case 'object':
                if (!from.meta.cache.includes(to.name)) {
                    store.commit('keepAlive/remove', componentName)
                }
                break
        }
        // 如果进入的是 reload 页面，则也将离开页面的缓存清空
        if (to.name == 'reload') {
            store.commit('keepAlive/remove', componentName)
        }
    }
})

export default router
