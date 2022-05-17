import { request } from '@/util/request'

export function login(data) {
    return request('post', 'user/login', data)
}

export function getInfo(data) {
    return request('get', 'user/getInfo', data)
}

export function getUser(data) {
    return request('get', 'user/query', data)
}

export function getUserList(data) {
    return request('get', 'user/userList', data)
}

export function updateUserInfo(data) {
    return request('post', 'user/updateUserInfo', data)
}
