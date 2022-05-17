<template>
  <div class="article_add">
    <el-alert title="添加文章" type="success" />
    <el-form
      ref="formRef"
      :model="articleForm"
      :rules="rules"
      label-width="80px"
      label-position="left"
      style="margin-top: 20px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="标题" prop="title" required>
            <el-input v-model="articleForm.title" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="布局" prop="layoutMode">
            <el-select
              v-model="articleForm.layoutMode"
              placeholder="请选择布局类型"
            >
              <el-option
                v-for="(item, index) in layoutList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="音乐" prop="bgMusic">
            <el-input v-model="articleForm.bgMusic" placeholder="请填写背景音乐链接地址" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自动播放" prop="autoPlay">
            <el-select
              v-model="articleForm.autoPlay"
              placeholder="是否自动播放"
            >
              <el-option
                v-for="(item, index) in autoPlayMap"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="desc">
            <el-input v-model="articleForm.desc" type="textarea" style="width: 100%" :rows="5" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="articleForm.status"
              placeholder="请选择文章状态"
            >
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户" prop="userId">
            <el-select v-model="articleForm.userId" placeholder="请选择操作人">
              <el-option
                v-for="(item, index) in adminData"
                :key="index"
                :label="item.nickname"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分类" prop="typeId">
            <el-select
              v-model="articleForm.typeId"
              placeholder="请选择文章分类"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="标签" prop="tagId">
            <el-select
              v-model="articleForm.tagId"
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
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="封面" prop="coverImg" required>
            <el-input
              v-model="articleForm.coverImg"
              placeholder="请填写封面图片链接或者上传一张图片作为封面"
            />
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="2">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="afterUpload"
          >
            <el-button type="text">上传封面图片</el-button>
          </el-upload>
        </el-col>

        <el-col :span="6" :offset="1">
          <el-form-item label="排序" prop="orderId">
            <el-input v-model="articleForm.orderId" placeholder="请填写排序id" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col
          :span="11"
          :style="{ paddingLeft: '60px', marginBottom: '20px' }"
        >
          <img v-if="showCoverImg" :src="articleForm.coverImg" class="cover" />
        </el-col>
      </el-row>

      <el-row>
        <el-col v-loading="loading" :span="24">
          <el-form-item label="内容" prop="content">
            <md-editor
              v-if="showEditor"
              :style="{ minHeight: '600px' }"
              :model-value="mdText"
              @change="mdChange"
              @onUploadImg="onUploadImg"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="submit"> 立即发布 </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, reactive, ref, toRefs, watch } from "vue";
import MdEditor from "md-editor-v3";
import { statusList, layoutList, autoPlayMap } from "../../constant";
import { ElMessage } from "element-plus";
import { getUser } from "@/api/blog/user";
import { getTag } from "@/api/blog/tag";
import { getType } from "@/api/blog/type";
import { setArticle, detailArticle } from "@/api/blog/article";
import { spiderArticle } from "@/api/blog/spider";
import { useRoute, useRouter } from "vue-router";

const uploadUrl = ref(import.meta.env.VITE_APP_UPLOAD_URL)

const formRef = ref(null);
const data = reactive({
  rules: {
    title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
    desc: [{ required: true, message: "请输入详细描述", trigger: "blur" }],
    coverImg: [
      { required: true, message: "请使用一张图片作为封面", trigger: "blur" },
    ],
    typeId: [{ required: true, message: "请选择文章分类", trigger: "change" }],
    tagId: [{ required: true, message: "请选择标签", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
    userId: [{ required: true, message: "请选择用户", trigger: "change" }],
    content: [{ required: true, message: "请填写文章内容", trigger: "blur" }],
    layoutMode: [{ required: true, message: "请选择布局类型", trigger: "change" }],
    autoPlay: [{ required: true, message: "请选择是否自动播放背景音乐", trigger: "change" }],
  },
  articleForm: {
    title: null,
    typeId: null,
    desc: null,
    status: null,
    userId: null,
    tagId: null,
    content: null,
    coverImg: null,
    bgMusic: null,
    orderId: null,
    layoutMode: null,
    autoPlay: null
  },
  adminData: [],
  typeList: [],
  tagList: [],
  showEditor: false,
  loading: false,
  mdText: "",
});
let {
  articleForm,
  rules,
  adminData,
  typeList,
  tagList,
  showEditor,
  loading,
  mdText,
  bgMusic,
  orderId
} = { ...toRefs(data) };

onMounted(() => (data.showEditor = true));
const $route = useRoute();
const $router = useRouter();
const queryId = $route.query.id;
data.adminData = (await getUser({role: ["admin","super"]}))["rows"];
data.tagList = (await getTag({pageSize: 100}))["rows"];
data.typeList = (await getType({pageSize: 100}))["rows"];

// const res = await spiderArticle()
// data.mdText = res
// console.log(res,'文章');

function mdChange(val) {
  data.mdText = val;
  data.articleForm.content = val;
}
function afterUpload(res) {
  console.log('上传接口返回信息 ', res);
  ElMessage({ message: "cover图上传完成", type: "success" });
  data.articleForm.coverImg = res.data[0].url;
}

function submit() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const params = JSON.parse(JSON.stringify(data.articleForm));
      queryId && (params.id = queryId);
      params.tagId = params.tagId.join(",");
      await setArticle(params);
      ElMessage({ message: "文章提交成功！", type: "success" });
      $router.push("/article/index");
    }
  });
}
queryId && queryArticleDetail(queryId);
async function queryArticleDetail(id) {
  const res = await detailArticle({ id });
  res.tagId = res.tagId.split(",").map((t) => Number(t));
  const { content, coverImg, title, desc, userId, typeId, tagId, status, bgMusic, orderId, layoutMode, autoPlay } = res;
  data.mdText = content;
  Object.assign(data.articleForm, {
    content,
    coverImg,
    title,
    desc,
    userId,
    typeId,
    tagId,
    status,
    bgMusic,
    orderId,
    layoutMode,
    autoPlay
  });
  console.log(data.articleForm.tagId);
}

const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    Array.from(files).map((file) => {
      return new Promise(async (resovle, reject) => {
        const form = new FormData();
        form.append("file", file);
        try {
          const res = await axios.post(uploadUrl.value, form, { headers: {"Content-Type": "multipart/form-data"} })
          console.log('上传接口返回信息 ', res);
          resovle(res.data.data.data[0].url)
        } catch (error) {
          reject(error)
        }
      });
    })
  );
  callback(res.map((item) => item));
  ElMessage({ message: "图片上传成功！", type: "success" });
};

const showCoverImg = computed(() => data.articleForm.coverImg);
</script>

<style lang="scss" scoped>
.article_add{
  background: #fff;
  padding: 15px;
}
.cover {
  width: 50%;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-left: 20px;
}
.el-input, .el-select{
  width: 80% !important;
}
</style>
