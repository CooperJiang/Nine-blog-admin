<template>
    <div id="visit" class="visit" />
</template>

<script setup>
import * as echarts from 'echarts'
import { querySiteVisit } from '@/api/blog/statistics'
import { watch, reactive, toRefs, defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
    date: {
        type: Number,
        default: () => 7
    }
})

const data = reactive({
    visitChart: null
})

let { visitChart } = {...toRefs(data)}
const option = {
    title: {
        text: '网站访问量统计'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['pv', 'uv', 'ip']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'pv',
            type: 'line',
            data: []
        },
        {
            name: 'uv',
            type: 'line',
            data: []
        },
        {
            name: 'ip',
            type: 'line',
            data: []
        }
    ]
}
async function queryVisitInfo() {
    const res = await querySiteVisit({date: props.date})
    const data = res.result
    option.xAxis.data = data.items[0].map(t => t[0])
    option.series.forEach((item, index) => {
        item.data = data.items[1].map(t => t[index])
    })
    visitChart = echarts.init(document.getElementById('visit'))
    visitChart.setOption(option)
    window.onresize = function() { 
        visitChart.resize()
    }
    
}
queryVisitInfo()

const store = useStore()
watch(() => store.state.settings.sidebarCollapse, () => {
    setTimeout(() => visitChart.resize(), 200)
})
watch(() => props.date, () => {
    queryVisitInfo()
})
</script>

<style lang='scss' scoped>
.visit{
  width: 100%;
  height: 100%;
}
</style>