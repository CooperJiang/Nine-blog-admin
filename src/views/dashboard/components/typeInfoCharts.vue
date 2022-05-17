<template>
    <div id="typeInfo" class="typeInfo" />
</template>

<script setup>
import * as echarts from 'echarts'
import { queryStatisticsTypeInfo } from '@/api/blog/statistics'

const option = {
    title: {
        text: '文章分类数量统计',
        left: 'left'
    },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            name: '数量统计',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
}
async function queryTypeInfo() {
    const res = await queryStatisticsTypeInfo()
    option.series[0].data = res.map(t => {
        t.value = t.nums
        return t
    })
    let myChart = echarts.init(document.getElementById('typeInfo'))
    myChart.setOption(option)
    window.onresize = function() { 
        myChart.resize()
    }
}
queryTypeInfo()
</script>

<style lang='scss' scoped>
.typeInfo{
  width: 100%;
  height: 100%;
}
</style>