<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>分类列表</span><el-button type="text" @click="addType">添加资源分类</el-button>
            </div>
        </template>

        <div class="table">
            <el-table :data="tableData" style="width: 100%;" border>
                <el-table-column prop="name" label="分类名称" align="center" width="150" />
                <el-table-column prop="resource_num" label="分类数量" align="center" width="150" />
                <el-table-column prop="status" :formatter="formatterStatus" label="分类状态" width="120" align="center" />
                <el-table-column prop="orderId" label="排序Id" align="center" width="100" />
                <el-table-column prop="createdAt" label="创建时间" align="center" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" />
                <el-table-column prop="address" label="操作" align="center">
                    <template #default="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这个分类么？"
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
                <el-form-item label="分类名称" prop="name" label-width="90px">
                    <el-input v-model="formData.name" placeholder="请填写资源分类名称" />
                </el-form-item>
                <el-form-item label="分类状态" prop="status" label-width="90px">
                    <el-select v-model="formData.status" placeholder="请填写资源分类名称">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序定义" label-width="90px" prop="orderId">
                    <el-input v-model="formData.orderId" placeholder="填写排序数字" />
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
import { getResourceType, setResourceType, delResourceType } from '@/api/resource/resource-type.js'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'
import {statusList} from '../constant'
const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    params: {
        page: 1,
        pageSize: 10
    },
    activeId: null,
    formData: {name: null, status: 1, orderId: null},
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择分类状态', trigger: 'blur' }]
    }
})

let { tableData, total, formData, visible, params, rules } = {...toRefs(data)}
async function queryType() {
    const {rows, count} = await getResourceType(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryType()

function addType() {
    data.type = 1
    data.visible = true
}

async function submit() {
    formRef.value.validate(async valid => {
        if (valid) {
            let param = JSON.parse(JSON.stringify(data.formData))
            param.id && delete params.id
            data.type === 2 && (param.id = data.activeId)
            await setResourceType(param)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            data.formData = resetForm()
            queryType()
        }
    })

}

function changePage(val) {
    data.params.page = val
    queryType()
}

function handleEdit(row) {
    const {name, status, orderId, id} = row
    data.activeId = id
    data.type = 2
    Object.assign(data.formData, {name, status, orderId})
    data.visible = true
}

async function deleteType(id) {
    await delResourceType({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryType()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加分类' : '修改分类'
})

const resetForm = () => {
    return {name: null, status: 1, orderId: null}
}

function formatterStatus(row) {
    return row.status == 1 ? '激活' : '禁止'
}
</script>

<style lang="scss" scoped>
.el-select {
    width: 100%;
}
</style>
