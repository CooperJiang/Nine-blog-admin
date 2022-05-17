import { request } from '@/util/request'

/* 获取项目 */
export function getProject(data) {
    return request('get', 'project/query', data)
}

/* 增加编辑项目 */
export function setProject(data) {
    return request('post', 'project/set', data)
}

/* 删除项目 */
export function delProject(data) {
    return request('post', 'project/del', data)
}
