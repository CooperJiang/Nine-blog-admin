<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>分类列表</span><el-button type="text" @click="addType">添加分类</el-button>
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="name" label="分类名称" align="center" />
                <el-table-column prop="desc" label="分类描述" align="center" />
                <el-table-column prop="value" label="简写路径" align="center" />
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
                <el-form-item label="英文简称" prop="value">
                    <el-input v-model="formData.value" />
                </el-form-item>
                <el-form-item label="分类描述" prop="desc">
                    <el-input v-model="formData.desc" @keyup.enter="submit" />
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
import { getType, setType, delType } from '@/api/blog/type'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'
const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    params: {
        page: 1,
        pageSize: 10
    },
    activeId: null,
    formData: {name: null, desc: null, value: null},
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入英文简称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
    }
})

let { tableData, total, formData, visible, params, rules, activeId } = {...toRefs(data)}
async function queryType() {
    const {rows, count} = await getType(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryType()

function addType() {
    data.type = 1
    data.activeId = null
    data.visible = true
}

async function submit() {
    formRef.value.validate(async valid => {
        if (valid) {
            let params = data.formData
            params.id && delete params.id
            data.type === 2 && (params.id = data.activeId)
            await setType(params)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            queryType()
        }
    })

}

function changePage(val) {
    data.params.page = val
    queryType()
}

function handleEdit(row) {
    const {name, desc, value, id} = row
    data.type = 2
    data.activeId = id
    Object.assign(data.formData, {name, desc, value})
    data.visible = true
}

async function deleteType(id) {
    await delType({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryType()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加分类' : '修改分类'
})
</script>

