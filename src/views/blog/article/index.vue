<template>
    <el-card class="box-card">
        <template #header>
            <div class="flex_between">
                <span>文章列表</span><el-button type="text" @click="$router.push('/article/add')">添加文章</el-button>
            </div>
        </template>
        <el-row class="m_t10 m_b10">
            <el-col :span="24">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="文章分类:">
                        <el-select
                            v-model="params.typeId"
                            placeholder="请选择文章分类"
                            clearable
                        >
                            <el-option
                                v-for="(item, index) in typeList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章标签">
            <el-select
              v-model="params.tagId"
              multiple
              collapse-tags
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="(item, index) in tagList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
                    <el-form-item label="文章状态:">
                        <el-select
                            v-model="params.status"
                            placeholder="请选择文章状态"
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
                    <el-form-item label="文章标题:">
                        <el-input clearable v-model="params.keyword" @keyup.enter="queryArticle" placeholder="请输入文章标题关键字" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryArticle">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div class="table">
            <el-table :data="tableData" style="width: 100%;">
                <!-- <el-table-column prop="title" label="文章封面" align="center">
                        <template #default="scope"          >
                            <img :style="{width:'100px'}" :src="scope.row.coverImg" alt="标题图片">
                        </template>
                    </el-table-column> -->
                <el-table-column prop="title" label="文章名称" align="left" />
                <el-table-column prop="orderId" label="排序ID" align="left" />
                <el-table-column prop="typeName" label="文章分类" align="left" />
                <el-table-column label="标签" align="center">
                    <template #default="scope">
                        <div class="tag_content">
                            <span v-for="(t,i) in scope.row.tagArr" :key="i" class="tag">{{ t.name }}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="createdAt" label="创建时间" align="center" />
                <el-table-column prop="updatedAt" label="更新时间" align="center" />
                <el-table-column prop="address" label="操作" align="center">
                    <template #default="scope">
                        <el-button size="mini" @click="handleEdit(scope.row.id)">
                            编辑
                        </el-button>
                        <el-popconfirm
                            title="确定删除这篇文章么？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm="deleteArticle(scope.row.id)"
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
        <div class="flex_center m_t15">
            <el-pagination background layout="prev, pager, next" :current-page="params.page" :page-size="params.pageSize" :total="total" @current-change="changePage" />
        </div>
    </el-card>
</template>

<script setup>
import {getArticle, delArticle} from '@/api/blog/article'
import { formatTime } from '@/util/tools'
import { ElMessage } from 'element-plus'
import { reactive, toRefs } from 'vue'
import {useRouter} from 'vue-router'
import { statusList } from '../constant'
import { getType } from "@/api/blog/type";
import { getTag } from "@/api/blog/tag";

const $router = useRouter()
const data = reactive({
    tableData: [],
    total: 0,
    typeList: [],
    tagList: [],
    params: {
        tagId: [],
        keyword: '',
        status: '',
        typeId: '',
        page: 1,
        pageSize: 10
    }
})
let {tableData, total, params, typeList, tagList} = {...toRefs(data)}

data.typeList = (await getType())["rows"];
data.tagList = (await getTag())["rows"];
async function queryArticle() {
    const {rows, count} = await getArticle(data.params)
    formatTime(rows)
    data.tableData = rows
    data.total = count
}

queryArticle()

const handleEdit = id => $router.push({path: '/article/add', query: {id}})
const deleteArticle = async id => await delArticle({id}) && ElMessage({message: '文章删除成功！', type: 'success'}) && queryArticle()

function changePage(val) {
    data.params.page = val
    queryArticle()
}
</script>

<style lang="scss">
.tag_content{
    display: flex;
    flex-wrap: nowrap;
    height: 30px;
}
.tag {
    padding: 0 4px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 3px;
    flex-wrap: nowrap;
}
</style>
