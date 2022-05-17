<template>
    <div class="dashboard">
        <div class="dashboard-hd ">
            <div class="welcome hBox">
                <img class="welcome-avatar" :src="$store.state.user.avatar" alt="头像">
                <div class="welcome-text">
                    <h1>{{ timeMsg }}、<span class="name">{{ $store.state.user.nickname }}</span></h1>
                    <span>{{ randomSc }} ---- {{ author }} </span>
                </div>
            </div>
            <div class="ip hBox">
                <b class="ip-time">{{ currentDate }}</b>
                <span class="ip-address">IP地址: {{ ip }}</span>
            </div>
            <div class="other hBox">
                虚位以待
            </div>
        </div>
        <div class="dashboard-md">
            <div v-for="(item,key) in basicInfo" :key="key" class="statictis hBox">
                <span class="title">{{ keyMap[key] }}</span>
                <span class="value">{{ item }}</span>
            </div>
        </div>
        <div class="dashboard-bt">
            <div class="articleCharts">
                <typeInfoCharts />
            </div>
            <div class="visitCharts">
                <div class="date-btn">
                    <el-button type="success" plain size="small" @click="changeDate(7)">最近七天</el-button>
                    <el-button type="success" plain size="small" @click="changeDate(15)">最近15天</el-button>
                    <el-button type="success" plain size="small" @click="changeDate(30)">最近30天</el-button>
                </div>
                <siteVisit :date="date" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {  reactive, toRefs } from 'vue'
import typeInfoCharts from '../components/typeInfoCharts.vue'
import siteVisit from '../components/siteVisit.vue'
import { querySummaryData } from '@/api/blog/statistics'
import axios from 'axios'
import dayjs from 'dayjs'
const data = reactive({
    basicInfo: {
        articleNum: 0,
        draftNum: 0,
        leaveMsgNum: 0,
        friendLinkNum: 0,
        userNum: 0
    },
    keyMap: {
        articleNum: '文章数量',
        draftNum: '草稿数量',
        leaveMsgNum: '留言数量',
        friendLinkNum: '友链数量',
        userNum: '用户数量'
    },
    date: 7,
    randomSc: null,
    author: null,
    ip: null,
    timeMsg: null,
    currentDate: null
})
let {basicInfo, keyMap, date, randomSc, author, ip, timeMsg, currentDate} = {...toRefs(data)}

function changeDate(date) {
    data.date = date
}

(async function getRandomSc() {
    const res = await axios.get('https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=punDVMaDr%2BMgu%2BAPl13p00d6RGh4x%2B7b')
    const result  = res.data.data
    const { content, origin } = result
    data.randomSc = content
    data.author = origin.author
    data.ip = res.data.ipAddress
})()

async function querySummaryInfo() {
    const res = await querySummaryData()
    data.basicInfo  = res
}
querySummaryInfo()

var t = new Date().getHours()
if (t > 0 && t <= 6) {
    data.timeMsg = '凌晨好'
}
if (t > 6 && t <= 10) {
    data.timeMsg = '上午好'
}
if (t > 10 && t <= 14) {
    data.timeMsg = '中午好'
}
if (t > 14 && t <= 20) {
    data.timeMsg = '下午好'
}
if (t > 20 && t <= 24) {
    data.timeMsg = '晚上好'
}

data.currentDate = dayjs(new Date()).format('YYYY-MM-DD')
</script>

<style lang='scss' scoped>
.dashboard{
    background: #f0f2f5;
    user-select: none;
    .hBox{
        border-radius: 5px;
        &:hover{
                box-shadow: 0 0 10px rgb(0 0 0 / 40%);
        }
    }
    &-hd{
        height: 140px;
        display: flex;
        .welcome{
            display: flex;
            align-items: center;
            padding: 0 60px 0 20px;
            background: #fff;
            transition: all .2s;
            &-avatar{
                width: 120px;
                height: 120px;
                border-radius: 50%;
            }
            &-text{
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                justify-content: center;
                margin-left: 20px;
                .name{
                    color: #1890ff;
                }
            }
        }
        .ip{
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding:0 40px;
            background: #fff;
            &-time{
                font-size: 36px;
            }
            &-address{
                font-size: 20px;
            }
        }

        .other{
          flex: 1;
          background: #fff;
          margin-left: 20px;
          padding: 15px;
        }
    }

    &-md{
        display: flex;
        margin-top: 20px;
        .statictis{
            flex: 1;
            margin-left: 20px;
            display: flex;
            justify-content: center;
            background: #fff;
            transition: all .2s;
            .title{
                font-size: 20px;
                margin-top: 18px;
            }
            .value{
                font-size: 80px;
                margin-left: 15px;
                color: #1890ff;
                margin-top: 10px;
            }
            &:first-child{
                margin-left: 0;
            }
        }
    }

    &-bt{
        max-width: 100%;
        overflow: hidden;
        margin-top: 20px;
        display: flex;
        height: 500px;
        .articleCharts{
            padding: 20px;
            width: 500px;
            background: #fff;
        }
        .visitCharts{
            margin-left: 20px;
            flex: 1;
            height: 100%;
            background: #fff;
            padding: 20px;
            position: relative;
            .date-btn{
                position: absolute;
                right: 30px;
                top: 10px;
                z-index: 999;
            }
        }
    }
}
</style>
