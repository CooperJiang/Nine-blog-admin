import { request } from '@/util/request'

/* 获取工具分类 */
export function getTools(data) {
    return request('get', 'tools/query', data)
}

/* 增加编辑工具分类 */
export function setTools(data) {
    return request('post', 'tools/set', data)
}

/* 删除工具分类 */
export function delTools(data) {
    return request('post', 'tools/del', data)
}
