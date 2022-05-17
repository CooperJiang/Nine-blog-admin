import { request } from '@/util/request'

/* 获取资源 */
export function getResource(data) {
    return request('get', 'resource/query', data)
}

/* 增加编辑资源 */
export function setResource(data) {
    return request('post', 'resource/set', data)
}

/* 删除资源 */
export function delResource(data) {
    return request('post', 'resource/del', data)
}
