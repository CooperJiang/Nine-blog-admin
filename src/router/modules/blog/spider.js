const Layout = () => import('@/layout/index.vue')

export default {
    path: '/article/spider',
    component: Layout,
    redirect: '/article/spider/add',
    name: 'ArticleSpider',
    meta: {title: '爬虫管理', icon: 'menu-spider'},
    children: [
        {
            path: 'add',
            name: 'ArticleSpiderAdd',
            component: () => import('@/views/blog/spider/index.vue'),
            meta: {title: '添加爬虫'}
        }
    ]
}
