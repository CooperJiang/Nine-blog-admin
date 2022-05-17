<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>标签列表</span><el-button type="text" @click="addTag">添加标签</el-button>
            </div>
        </template>
        <div class="table">
            <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="name" label="标签名称" align="center" />
                <el-table-column prop="createdAt" label="创建时间" align="center" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" />
                <el-table-column prop="address" label="操作" align="center">
                    <template #default="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这个标签么？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteTag(scope.row.id)"
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
                <el-form-item label="标签名称" prop="name">
                    <el-input v-model="formData.name" @keyup.enter="submit" />
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
import { getTag, setTag, delTag } from '@/api/blog/tag'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'
const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    activeId: null,
    params: {
        page: 1,
        pageSize: 10
    },
    formData: {name: null},
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
    }
})

let { tableData, total, formData, visible, params, rules, activeId, type } = {...toRefs(data)}
async function queryTag() {
    const {rows, count} = await getTag(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryTag()
function addTag() {
    type.value = 1
    data.activeId = null
    data.visible = true
}

async function submit() {
    formRef.value.validate(async valid => {
        if (valid) {
            let param = data.formData
            param.id && delete param.id // param是响应式 必须把id删除否则新增变成修改了
            data.type === 2 && (param.id = data.activeId)
            await setTag(param)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            queryTag()
        }
    })

}

function changePage(val) {
    data.params.page = val
    queryTag()
}

function handleEdit(row) {
    const {name, id} = row
    data.activeId = id
    data.type = 2
    Object.assign(data.formData, {name})
    data.visible = true
}

async function deleteTag(id) {
    await delTag({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryTag()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加标签' : '修改标签'
})
</script>
