import { request } from '@/util/request'

/* 获取文章 */
export function getArticle(data) {
    return request('get', 'article/query', data)
}

/* 增加编辑文章 */
export function setArticle(data) {
    return request('post', 'article/set', data)
}

/* 删除文章 */
export function delArticle(data) {
    return request('post', 'article/del', data)
}

/* 查看文章详情 */
export function detailArticle(data) {
    return request('get', 'article/detail', data)
}
