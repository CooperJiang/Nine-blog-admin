import { request } from '@/util/request'

/* 获取资源分类 */
export function getResourceType(data) {
    return request('get', 'resourceType/query', data)
}

/* 增加编辑资源分类 */
export function setResourceType(data) {
    return request('post', 'resourceType/set', data)
}

/* 删除资源分类 */
export function delResourceType(data) {
    return request('post', 'resourceType/del', data)
}
