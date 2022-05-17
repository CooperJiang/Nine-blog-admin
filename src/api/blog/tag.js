import { request } from '@/util/request'

/* 获取标签 */
export function getTag(data) {
    return request('get', 'tag/query', data)
}

/* 增加编辑标签 */
export function setTag(data) {
    return request('post', 'tag/set', data)
}

/* 删除标签 */
export function delTag(data) {
    return request('post', 'tag/del', data)
}
