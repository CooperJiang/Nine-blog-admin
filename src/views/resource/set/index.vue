<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>前端资源列表</span><el-button type="text" @click="addType">添加前端资源</el-button>
            </div>
        </template>
        <!-- search -->
        <div class="m_t10 m_b10">
          <el-form ref="formRef" :model="params"  :inline="true">
            <el-form-item label="资源分类" label-width="90px" prop="resourceId">
                  <el-select v-model="params.resourceId" placeholder="请选择资源分类" @change="queryResource" clearable>
                    <el-option
                      v-for="item in resourceData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="资源名称" label-width="90px" prop="name">
                  <el-input v-model="params.name" placeholder="请填写资源分类名称" @keyup.enter="queryResource" />
              </el-form-item>
              <el-button @click="queryResource">搜索</el-button>
          </el-form>
        </div>

        <!-- table -->
        <div class="table" size='mini'>
            <el-table :data="tableData" style="width: 100%;" border>
                <el-table-column prop="orderId" label="排序Id" align="center" width="80" />
                <el-table-column prop="name" label="资源名称" align="center" width="120" />
                <el-table-column prop="logo" label="logo" align="center" width="100" >
                  <template #default="scope">
                      <img v-if="scope.row.logo" class="logo" :src="scope.row.logo" alt="标题图片">
                      <span v-else class="logo_text">{{scope.row.name.substr(0,1)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="url" label="地址" align="center" width="240" />
                <el-table-column prop="resourceName" label="资源分类" align="center" width="120" />
                <el-table-column prop="desc" label="资源简介" align="center"/>
                <el-table-column label="时间" align="center" width="170">
                  <template #default="scope">
                    <div>{{scope.row.createdAt}}</div>
                    <div>{{scope.row.updatedAt}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center"  width="160">
                    <template #default="scope">
                        <el-button size="mini"  type="primary" plain @click="handleEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这个资源么？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteResource(scope.row.id)"
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
              <el-form-item label="资源分类" label-width="90px" prop="resourceId">
                    <el-select class="form-select" v-model="formData.resourceId" placeholder="请选择资源分类">
                      <el-option
                        v-for="item in resourceData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源图标" prop="logo" label-width="90px">
                    <el-upload
                        v-if="!formData.logo"
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="afterUpload"
                    >
                        <el-button type="text">上传封面图片</el-button>
                    </el-upload>
                    <el-button  v-if="!formData.logo" type="text" @click="formData.logo = '请填写地址'">填写封面地址</el-button>
                    <el-input
                        v-else
                        v-model="formData.logo"
                        clearable
                        placeholder="请填写LOGO图片链接或者上传一张图片作为LOGO"
                    />
                </el-form-item>
                <el-form-item v-if="formData.logo" label="logo预览" label-width="90px">
                    <img v-if="formData.logo" :src="formData.logo" class="logo">
                </el-form-item>
                <el-form-item label="资源名称" label-width="90px" prop="name">
                    <el-input v-model="formData.name" placeholder="请填写资源分类名称" />
                </el-form-item>
                <el-form-item label="资源地址" label-width="90px" prop="url">
                    <el-input v-model="formData.url" placeholder="请填写链接地址" />
                </el-form-item>
                <el-form-item label="资源描述" label-width="90px" prop="desc">
                    <el-input v-model="formData.desc" :rows="3" type="textarea" placeholder="请填写资源描述" maxlength="260" />
                </el-form-item>
                <el-form-item label="排序定义" label-width="90px" prop="orderId">
                    <el-input v-model="formData.orderId" placeholder="请填写排序数字" />
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
import { getResourceType } from '@/api/resource/resource-type.js'
import { getResource, setResource, delResource } from '@/api/resource/type'
import { ElMessage } from 'element-plus'
import {formatTime} from '@/util/tools'

const uploadUrl = ref(import.meta.env.VITE_APP_UPLOAD_URL)

const formRef = ref(null)
const data = reactive({
    tableData: [],
    total: null,
    params: {
        page: 1,
        pageSize: 10,
        resourceId: null,
        name: null
    },
    activeId: null,
    formData: {name: null, orderId: null, logo: null, desc: null, url: null, resourceId: null},
    visible: false,
    type: 1,
    rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        resourceId: [{ required: true, message: '请选择资源分类', trigger: 'change' }],
        logo: [{ required: false, message: '请上传资源图标', trigger: 'blur' }],
        url: [{ required: true, message: '请输入资源地址', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入资源简介', trigger: 'blur' }],
    }
})

let { tableData, total, formData, visible, params, rules } = {...toRefs(data)}
const {rows: resourceData} = await getResourceType({pageSize:100})

async function queryResource() {
  const {rows,count} = await getResource(data.params)
  formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryResource()

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
            await setResource(param)
            ElMessage({message: '操作成功', type: 'success'})
            data.visible = false
            formRef.value.resetFields()
            data.formData = resetForm()
            queryResource()
        }
    })

}

function changePage(val) {
    data.params.page = val
    queryResource()
}

function handleEdit(row) {
    const {name, orderId, logo, desc, url, resourceId, id} = row
    data.activeId = id
    data.type = 2
    Object.assign(data.formData, {name, orderId, logo, desc, url, resourceId})
    data.visible = true
}

async function deleteResource(id) {
    await delResource({id})
    ElMessage({message: '删除成功', type: 'success'})
    queryResource()
}

const titleMsg = computed(() => {
    return data.type === 1 ? '添加分类' : '修改分类'
})

const resetForm = () => {
    return {name: null, orderId: null}
}

function afterUpload(res) {
    console.log('上传接口返回信息 ', res);
    ElMessage({message: 'cover图上传完成', type: 'success'})
    data.formData.logo = res.data[0].url
}

</script>

<style lang='scss' scoped>
.logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px splod #ccc;
}
.logo_text {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    border-radius: 50%;
    background: #ccc;
}
.form-select {
    width: 100%;
}
</style>
