import { request } from '@/util/request'

/* 获取资源分类 */
export function getToolsType(data) {
    return request('get', 'toolsType/query', data)
}

/* 增加编辑资源分类 */
export function setToolsType(data) {
    return request('post', 'toolsType/set', data)
}

/* 删除资源分类 */
export function delToolsType(data) {
    return request('post', 'toolsType/del', data)
}
