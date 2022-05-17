<template>
    <el-card class="box-card">
        <template #header>
            <span>用户列表</span>
        </template>
        <el-row class="m_t10 m_b10">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="用户权限:">
                        <el-select
                            v-model="params.role"
                            placeholder="请选择用户权限"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in roleList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户状态:">
                        <el-select
                            v-model="params.status"
                            placeholder="请选择用户状态"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in statusList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户名称:">
                        <el-input v-model="params.keyword" clearable placeholder="请输入用户名称、昵称、邮箱" @keyup.enter="queryUserList" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryUserList">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="table">
            <el-table :data="tableData" style="width: 100%;" border :row-class-name="tableRowClassName">
                <el-table-column prop="username" label="用户名称" align="center" width="150">
                    <template #default="scope">
                        <b class="username" :style="{color: roleBgMap[scope.row.role]}">{{ scope.row.username }}</b>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" align="center" width="50">
                    <template #default="scope">
                        <span>{{ scope.row.sex === 1 ? "男" : "女" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="50">
                    <template #default="scope">
                        <span>{{ scope.row.status === 1 ? "激活" : "冻结" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="用户昵称" align="center" width="150" />
                <el-table-column prop="email" label="邮箱" align="center" />
                <el-table-column prop="sign" label="签名" align="center" />
                <el-table-column prop="role" label="权限身份" align="center" width="150">
                    <template #default="scope">
                        <span :style="{background: roleBgMap[scope.row.role]}" class="role">{{ roleMap[scope.row.role] }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" />
                <el-table-column prop="address" label="操作" align="center">
                    <template #default="scope">
                        <div>
                            <el-button size="mini" @click="handlEdit(scope.row)">编辑</el-button>
                            <el-popconfirm
                                :title="`确定${scope.row.status === 0 ? '激活' : '冻结'}这个用户么？`"
                                confirm-button-text="确定"
                                cancel-button-text="取消"
                                icon="el-icon-info"
                                :icon-color="scope.row.status === 0 ? 'green' : 'red'"
                                @confirm="freezeUser(scope.row.id, scope.row.status === 0 ? 1 : 0)"
                            >
                                <template #reference>
                                    <el-button size="mini" :type="scope.row.status === 0 ? 'success' : 'danger'">
                                        {{ scope.row.status === 0 ? "激活" : "冻结" }}
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- dialog -->
        <el-dialog v-model="visible" title="编辑用户" width="700px" :close-on-click-modal="true" @close="formRef.resetFields()">
            <el-form ref="formRef" label-width="120px" inline :model="formData" :rules="rules" :label-position="right">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="formData.username" placeholder="请填写用户名称" />
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickname">
                    <el-input v-model="formData.nickname" placeholder="请填写用户地址链接" />
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请填写用户地址链接" />
                </el-form-item>
                <el-form-item label="用户性别" prop="sex">
                    <el-select v-model="formData.sex" placeholder="请选择用户类型">
                        <el-option
                            v-for="item in sexList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="用户权限" prop="role">
                    <el-select v-model="formData.role" placeholder="请选择用户权限">
                        <el-option
                            v-for="item in roleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="用户签名" prop="sign">
                    <el-input v-model="formData.sign" :rows="5" type="textarea" placeholder="请填写用户签名" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="handlerUpdateUser()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <div class="flex_center m_t15">
            <el-pagination background layout="prev, pager, next" :current-page="params.page" :page-size="params.pageSize" :total="total" @current-change="changePage" />
        </div>
    </el-card>
</template>

<script setup>
import { getUserList, updateUserInfo } from '@/api/blog/user'
import { formatTime } from '@/util/tools'
import { ElMessage } from 'element-plus'
import { reactive, ref, toRefs } from 'vue'
import { statusList, roleList, sexList, roleBgMap, roleMap } from '../constant'
const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: 0,
    visible: false,
    params: {
        keyword: '',
        status: '',
        role: '',
        page: 1,
        pageSize: 10
    },
    formData: {
        username: null,
        nickname: 1,
        sex: null,
        email: null,
        sign: null,
        role: null,
        id: null
    }
})
let {tableData, total, params, visible, formData} = {...toRefs(data)}
async function queryUserList() {
    const {rows, count} = await getUserList(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryUserList()

const freezeUser = async(id, status) => await updateUserInfo({id, status }) && ElMessage({message: `用户${status === 1 ? '激活' : '冻结'}成功`, type: 'success'}) && queryUserList()

const handlEdit = scope => {
    const {username, nickname, sex, role, email, sign, id} = scope
    Object.assign(data.formData, {username, nickname, sex, role, email, sign, id})
    data.visible = true
}
const handlerUpdateUser = async() => {
    const parmas = { ...data.formData}
    const res = await updateUserInfo(parmas)
    res.success && ElMessage({message: '修改用户信息完成！', type: 'success'})
    queryUserList()
    data.visible = false
}

function changePage(val) {
    data.params.page = val
    queryUserList()
}
function tableRowClassName({ row }) {
    const {role} = row
    return role
}
</script>

<style lang="scss">
.table{
  color: #fff;
}
.username{
  font-size: 15px;
  color: #fff;
}
.role{
  padding: 4px 10px;
  color: #fff;
  border-radius: 4px;
  display: inline-block;
}
.el-textarea,
.el-input,
.el-select {
  width: 178px !important;
}
.admin,
.super,
.guest,
.viewer{
  color: #fff;
}
.el-table .admin {
  color: #000;
}
.el-table .super {
  color: #3785df;
}
.el-table .guest {
  color: #701ec9;
}
.el-table .viewer {
  color: #3f3f3f;
}
</style>
