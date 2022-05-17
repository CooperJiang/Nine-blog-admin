export const statusList = [
    {label: '冻结', value: 0 },
    {label: '激活', value: 1 }
]

/* 出于聊天室定义的几种角色，并无实际权限控制，只是在聊天室的显示可以多个标签，同时默认这些权限可以切歌 */
export const roleList = [
    {label: '普通权限', value: 'viewer'},
    {label: '超管', value: 'super'},
    {label: '嘉宾', value: 'guest'},
    {label: '超级管理员', value: 'admin'}
]

export const sexList = [
    {label: '男', value: 1},
    {label: '女', value: 2}
]
export const roleBgMap =  {
    admin: '#000',
    guest: '#701ec9',
    super: '#3785df',
    viewer: '#ccc'
}

export const roleMap =  {
    admin: '超级管理员',
    guest: '嘉宾',
    super: '超管',
    viewer: '普通权限'
}
