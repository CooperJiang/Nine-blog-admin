import { request } from '@/util/request'

/* 获取分类 */
export function getType(data) {
    return request('get', 'type/query', data)
}

/* 增加编辑分类 */
export function setType(data) {
    return request('post', 'type/set', data)
}

/* 删除分类 */
export function delType(data) {
    return request('post', 'type/del', data)
}