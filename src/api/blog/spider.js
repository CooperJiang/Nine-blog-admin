
import { request } from '@/util/request'

/* 爬取文章 */
export function spiderArticle(data) {
    return request('get', '/spider/md', data)
}
