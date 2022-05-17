<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>项目列表</span><el-button type="text" @click="addEditFriendLinks">添加项目</el-button>
            </div>
        </template>

        <div class="table">
            <el-table :data="tableData" style="width: 100%;" border show-overflow-tooltip stripe>
                <el-table-column prop="orderId" label="排序Id" align="center" width="100" />
                <el-table-column prop="name" label="项目名称" align="center" width="150" />
                <el-table-column prop="tag" label="标签" align="center" width="150" />
                <el-table-column prop="desc" :formatter="formatterDesc" label="简介描述" width="200" align="center" />
                <el-table-column prop="url" label="项目地址" align="center">
                    <template #default="scope">
                        <a :href="scope.row.git" target="_blank">查看项目</a>
                    </template>
                </el-table-column>
                <el-table-column prop="link" label="案例地址" align="center">
                    <template #default="scope">
                        <a :href="scope.row.link" target="_blank">查看案例</a>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="项目类型" align="center">
                    <template #default="scope">
                        {{ `${scope.row.type == 1 ? '外部项目': "站内项目"}` }}
                    </template>
                </el-table-column>
                <el-table-column prop="hot" label="是否推荐" align="center">
                    <template #default="scope">
                        {{ `${scope.row.hot == 1 ? '是': "否"}` }}
                    </template>
                </el-table-column>

                <el-table-column prop="status" :formatter="formatterStatus" label="状态" width="120" align="center" />

                <el-table-column prop="createdAt" label="创建时间" align="center" width="160" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" width="160" />
                <el-table-column prop="address" label="操作" align="center" width="150">
                    <template #default="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这个项目么？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteType(scope.row.id)"
                        >
                            <template #reference>
                                <el-button size="mini" type="danger"> 删除 </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- dialog -->
        <el-dialog v-model="visible" :title="titleMsg" width="700px" :close-on-click-modal="false" @close="formRef.resetFields()">
            <el-form ref="formRef" label-width="120px" inline :model="formData" :rules="rules" :label-position="right">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请填写项目名称" />
                </el-form-item>
                <el-form-item label="项目标签" prop="tag">
                    <el-input v-model="formData.tag" placeholder="请填写项目地址链接" />
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker v-model="formData.startTime" style="width: 178px" class="t" type="date" placeholder="项目开始时间" />
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker v-model="formData.endTime" style="width: 178px" class="t" type="date" placeholder="项目结束时间" />
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                    <el-select v-model="formData.type" placeholder="请选择项目类型">
                        <el-option
                            v-for="item in projectMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="是否推荐" prop="hot">
                    <el-select v-model="formData.hot" placeholder="是否推荐项目">
                        <el-option
                            v-for="item in whetherMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目地址" prop="git">
                    <el-input v-model="formData.git" placeholder="项目Git地址链接" />
                </el-form-item>
                <el-form-item label="预览地址" prop="link">
                    <el-input v-model="formData.link" :rows="3" placeholder="项目预览地址" />
                </el-form-item>
                <el-form-item label="本站路径" prop="path">
                    <el-input v-model="formData.path" :rows="3" placeholder="项目跳转路径" />
                </el-form-item>
                <el-form-item label="排序定义" prop="orderId">
                    <el-input v-model="formData.orderId" placeholder="排序数字[不填写系统自动赋予]" />
                </el-form-item>
                <el-form-item label="项目状态" prop="status">
                    <el-select v-model="formData.status" placeholder="请选择项目状态">
                        <el-option
                            v-for="item in statusMap"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="背景图片" prop="bgImage">
                    <el-input
                        v-model="formData.bgImage"
                        clearable
                        placeholder="填写链接或者上传图片"
                    />
                    <el-upload
                        v-if="!formData.bgImage"
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="afterUpload"
                    >
                        <el-button type="text">上传封面图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="项目描述" prop="desc">
                    <el-input v-model="formData.desc" :rows="5" type="textarea" placeholder="请填写项目简介介绍" />
                </el-form-item>
                <el-form-item v-if="formData.bgImage" label="背景预览">
                    <img :src="formData.bgImage" class="preImg">
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
import { getProject, setProject, delProject } from '@/api/blog/project'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'
import { statusMap, whetherMap, projectMap } from '../constant'

const uploadUrl = ref(import.meta.env.VITE_APP_UPLOAD_URL)

const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    params: {
        page: 1,
        pageSize: 10
    },
    activeId: null,
    formData: {
        name: null,
        status: 1,
        orderId: null,
        desc: null,
        bgImage: null,
        tag: null,
        startTime: null,
        endTime: null,
        git: null,
        link: null,
        type: 1,
        path: null,
        hot: -1
    },
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请填写项目描述', trigger: 'blur' }],
        bgImage: [{ required: true, message: '请填写或上传卡片背景图片', trigger: 'blur' }],
        tag: [{ required: true, message: '请填写标签名称[多个中间用,分割]', trigger: 'blur' }],
        startTime: [{ required: true, message: '请选择项目开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择项目结束时间', trigger: 'change' }],
        type: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
        hot: [{ required: true, message: '请选择项目推荐状态', trigger: 'change' }],
        status: [{ required: true, message: '请填写项目状态', trigger: 'change' }]
    }
})

let { tableData, total, formData, visible, params, rules } = {...toRefs(data)}

/* 查询项目列表 */
async function queryFriendLinks() {
    const {rows, count} = await getProject(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryFriendLinks()

/* 添加或者修改项目 */
function addEditFriendLinks() {
    data.type = 1
    data.visible = true
}

async function submit() {
    formRef.value.validate(async valid => {
        if (valid) {
            let param = {}
            param.data = JSON.parse(JSON.stringify(data.formData))
            param.id && delete params.id
            data.type === 2 && (param.id = data.activeId)
            await setProject(param)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            data.formData = resetForm()
            queryFriendLinks()
        }
    })
}

function afterUpload(res) {
    ElMessage({ message: '图片上传完成', type: 'success' })
    data.formData.bgImage = res.data[0].url
}

function handleEdit(row) {
    const {name, status, orderId, desc, url, bgImage, tag, startTime, endTime, git, link, type, path, hot, id} = row
    data.activeId = id
    data.type = 2
    Object.assign(data.formData, {name, status, orderId, desc, url, bgImage, tag, startTime, endTime, git, link, type, path, hot})
    data.visible = true
}

async function deleteType(id) {
    await delProject({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryFriendLinks()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加项目' : '修改项目'
})

const resetForm = () => {
    return {name: null, status: 1, orderId: null}
}

function formatterStatus(row) {
    return row.status == 1 ? '激活' : '冻结'
}

function formatterDesc(row) {
    return row.desc.length > 16 ? row.desc.substr(0, 16) + '...' : row.desc
}
</script>

<style lang="scss" scoped>
.el-textarea,
.el-input,
.el-select {
  width: 178px !important;
}

.avatar{
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.preImg{
  width: 178px;
}
</style>
