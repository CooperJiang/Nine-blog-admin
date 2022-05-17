export default [
    {
        url: '/mock/member/login',
        method: 'post',
        response: option => {
            return {
                error: '',
                status: 1,
                data: {
                    roles: option.body.roles,
                    token: '@string',
                    failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
                }
            }
        }
    },
    {
        url: '/mock/member/permission',
        method: 'get',
        response: option => {
            let permissions = []
            console.log(option.query.roles, '接口请求出的身份')
            if (option.query.roles == 'admin') {
                permissions = [
                    'permission.browse',
                    'permission.create',
                    'permission.edit',
                    'permission.remove'
                ]
            } else if (option.query.roles == 'test') {
                permissions = [
                    'permission.browse'
                ]
            }
            return {
                error: '',
                status: 1,
                data: {
                    permissions
                }
            }
        }
    }
]
