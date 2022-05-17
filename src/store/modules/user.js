import api from '@/util/request'
import {login, getInfo} from '@/api/blog/user'

const state = () => ({
    // roles: localStorage.roles || 'admin',
    token: localStorage.token || '',
    failure_time: localStorage.failure_time || '',
    permissions: [],
    nickname: null,
    username: null,
    role: null,
    avatar: null
})

const getters = {
    /* 个人接口里面登录接口只返回token，其他信息从getinfo获取 */
    isLogin: state => {
        return state.token
        let ret = false
        if (state.token) {
            let unix = Date.parse(new Date())
            if (unix < state.failure_time * 1000) {
                ret = true
            }
        }
        return ret
    }
}

const actions = {
    login({commit}, data) {
        return new Promise((resolve, reject) => {
            login(data).then(res => {
                commit('setToken', res.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    getInfo({commit}) {
        return new Promise((resolve, reject) => {
            getInfo().then(res => {
                commit('setUserInfo', res)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    logout({commit}) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, {root: true})
        commit('tabbar/clean', null, {root: true})
        commit('menu/removeRoutes', null, {root: true})
    },
    
    /* 获取权限信息 */
    getPermissions({state, commit}) {
        return new Promise(resolve => {
            // 通过 mock 获取权限
            api.get('member/permission', {
                baseURL: '/mock/',
                params: {
                    roles: state.roles
                }
            }).then(res => {
                commit('setPermissions', res.data.permissions)
                resolve(res.data.permissions)
            })
        })
    }
}

const mutations = {
    setToken(state, token) {
        localStorage.setItem('token', token)
        state.token = token
    },
    setUserInfo(state, data) {
        const { userInfo, failure_time } = data
        const {username, nickname, avatar, role} = userInfo
        state.failure_time = failure_time
        state.username = username
        state.nickname = nickname
        state.avatar = avatar
        state.role = role
        localStorage.role = role
    },
    removeUserData(state) {
        localStorage.removeItem('roles')
        localStorage.removeItem('token')
        localStorage.removeItem('failure_time')
        state.roles = ''
        state.token = ''
        state.failure_time = ''
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
