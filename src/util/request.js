import axios from 'axios'
// import Qs from 'qs'
import router from '@/router/index'
import store from '@/store/index'
import { ElMessage } from 'element-plus'

const toLogin = () => {
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

const instance = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_APP_API_BASEURL,
    timeout: 10000,
    responseType: 'json'
})

instance.interceptors.request.use(
    request => {
        /**
         * 全局拦截请求发送前提交的参数
         * 以下代码为示例，在登录状态下，分别对 post 和 get 请求加上 token 参数
         */
        request.headers.token = localStorage.token
        // if (request.method == 'post') {
        //     if (request.data instanceof FormData) {
        //         if (store.getters['token/isLogin']) {
        //             // 如果是 FormData 类型（上传图片）
        //             request.data.append('token', store.state.token.token)
        //         }
        //     } else {
        //         // 带上 token
        //         if (request.data == undefined) {
        //             request.data = {}
        //         }
        //         if (store.getters['token/isLogin']) {
        //             request.data.token = store.state.token.token
        //         }
        //         // request.data = Qs.stringify(request.data)
        //     }
        // } else {
        //     // 带上 token
        //     if (request.params == undefined) {
        //         request.params = {}
        //     }
        //     if (store.getters['token/isLogin']) {
        //         request.params.token = store.state.token.token
        //     }
        // }
        // store.getters.token.token && (request.headers.Authorization = store.getters.token.token)
        return request
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        /**
         * 全局拦截请求发送后返回的数据，如果数据有报错则在这做全局的错误提示
         * 假设返回数据格式为：{ status: 1, error: '', data: '' }
         * 规则是当 status 为 200 时表示请求成功，为 401 时表示接口需要登录或者登录状态失效，需要重新登录
         * 请求出错时 error 会返回错误信息
         */
        const {success, message, data} = response.data
        if (success) {
            return Promise.resolve(data)
        } else {
            ElMessage({message, type: 'error'})
            return Promise.reject(message)
        }
        // if (response.data.status === 200) {
        //     if (response.data.error === '') {
        //         // 请求成功并且没有报错
        //         return Promise.resolve(response.data)
        //     } else {
        //         // 这里做错误提示
        //         // ElMessage.error(options)
        //         return Promise.reject(response.data)
        //     }
        // } else {
        //     toLogin()
        // }
    },
    error => {
        const {response} = error
        const {message, code} = response.data
        // if (message == 'Network Error') {
        //     message = '后端网络故障'
        // } else if (message.includes('timeout')) {
        //     message = '接口请求超时'
        // } else if (message.includes('Request failed with status code')) {
        //     message = '接口' + message.substr(message.length - 3) + '异常'
        // }
        if (code == 401) {
            store.dispatch('user/logout').then(() => {
                router.push({name: 'login'})
            })
        }
        ElMessage({message, type: 'error'})

        return Promise.reject(error)
    }
)

export function request(method, url, data = {}, headers = {}) {
    const dataType = method.toLocaleLowerCase() == 'get' ? 'params' : 'data'
    const options = { url, method,
        [dataType]: data,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...headers
        }
    }
    return instance(options)
}

export default instance
