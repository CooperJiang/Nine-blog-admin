import { request } from '@/util/request'

/* 获取友链 */
export function getFriendLinks(data) {
    return request('get', 'friend-links/query', data)
}

/* 增加编辑友链 */
export function setFriendLinks(data) {
    return request('post', 'friend-links/set', data)
}

/* 删除友链 */
export function delFriendLinks(data) {
    return request('post', 'friend-links/del', data)
}
