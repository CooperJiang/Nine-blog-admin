<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>友链列表</span><el-button type="text" @click="addEditFriendLinks">添加友链</el-button>
            </div>
        </template>

        <div class="table">
            <el-table :data="tableData" style="width: 100%;" border show-overflow-tooltip stripe>
                <el-table-column prop="orderId" label="排序Id" align="center" width="100" />
                <el-table-column prop="avatar" label="友链Logo" align="center" width="100">
                    <template #default="scope">
                        <a :href="scope.row.url" target="_blank">
                            <img :src="scope.row.avatar" class="avatar">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="友链名称" align="center" width="150" />
                <el-table-column prop="status" :formatter="formatterStatus" label="状态" width="120" align="center" />
                <el-table-column prop="desc" :formatter="formatterDesc" label="简介描述" align="center" />
                <el-table-column prop="url" label="友链地址" align="center">
                    <template #default="scope">
                        <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" align="center" width="160" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" width="160" />
                <el-table-column prop="address" label="操作" align="center" width="150">
                    <template #default="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这个友链么？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteType(scope.row.id)"
                        >
                            <template #reference>
                                <el-button size="mini" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- dialog -->
        <el-dialog v-model="visible" :title="titleMsg" width="400px">
            <el-form ref="formRef" :model="formData" :rules="rules">
                <el-form-item label="友链名称" prop="name" label-width="90px">
                    <el-input v-model="formData.name" placeholder="请填写友链名称" />
                </el-form-item>
                <el-form-item label="友链logo" prop="avatar" label-width="90px">
                    <el-input v-model="formData.avatar" placeholder="请填写友链logo图片地址" />
                </el-form-item>
                <el-form-item label="友链地址" prop="url" label-width="90px">
                    <el-input v-model="formData.url" placeholder="请填写友链地址链接" />
                </el-form-item>
                <el-form-item label="友链简述" prop="desc" label-width="90px">
                    <el-input v-model="formData.desc" :rows="3" type="textarea" placeholder="请填写友链简述说明" />
                </el-form-item>
                <el-form-item label="友链状态" prop="status" label-width="90px">
                    <el-select v-model="formData.status" placeholder="请选择友链状态">
                        <el-option
                            v-for="item in statusMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序定义" label-width="90px" prop="orderId">
                    <el-input v-model="formData.orderId" placeholder="填写排序数字[不填写系统自动赋予]" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 分页 -->
        <div class="flex_center m_t15">
            <el-pagination
                :current-page="params.page"
                :page-size="params.pageSize"
                layout="total, prev, pager, next"
                :total="total"
                hide-on-single-page
                @current-change="changePage"
            />
        </div>
    </el-card>
</template>

<script setup>
import { reactive, toRefs, ref, computed } from 'vue'
import { getFriendLinks, setFriendLinks, delFriendLinks } from '@/api/blog/friend-links'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'
import { statusMap } from '../constant'

const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    params: {
        page: 1,
        pageSize: 10
    },
    activeId: null,
    formData: {name: null, status: 1, orderId: null, desc: null, url: null, avatar: null},
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请填写友链名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请填写友链描述', trigger: 'blur' }],
        url: [{ required: true, message: '请填写友链地址', trigger: 'blur' }],
        avatar: [{ required: true, message: '请填写友链logo地址', trigger: 'blur' }],
        status: [{ required: true, message: '请选择友链状态', trigger: 'blur' }]
    }
})

let { tableData, total, formData, visible, params, rules } = {...toRefs(data)}

/* 查询友链列表 */
async function queryFriendLinks() {
    const {rows, count} = await getFriendLinks(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryFriendLinks()

/* 添加或者修改友链 */
function addEditFriendLinks() {
    data.type = 1
    data.visible = true
}

async function submit() {
    formRef.value.validate(async valid => {
        if (valid) {
            let param = JSON.parse(JSON.stringify(data.formData))
            param.id && delete params.id
            data.type === 2 && (param.id = data.activeId)
            await setFriendLinks(param)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            data.formData = resetForm()
            queryFriendLinks()
        }
    })

}

function changePage(val) {
    data.params.page = val
    queryFriendLinks()
}

function handleEdit(row) {
    const {name, status, orderId, desc, url, avatar, id} = row
    data.activeId = id
    data.type = 2
    Object.assign(data.formData, {name, status, orderId, desc, url, avatar})
    data.visible = true
}

async function deleteType(id) {
    await delFriendLinks({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryFriendLinks()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加友链' : '修改友链'
})

const resetForm = () => {
    return {name: null, status: 1, orderId: null}
}

function formatterStatus(row) {
    return row.status == 1 ? '激活' : '禁止'
}

function formatterDesc(row) {
    return row.desc.length > 16 ? row.desc.substr(0, 16) + '...' : row.desc
}
</script>

<style lang="scss" scoped>
.el-select {
    width: 100%;
}
.avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
