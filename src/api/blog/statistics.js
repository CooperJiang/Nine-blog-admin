import { request } from '@/util/request'

/* 获取各个分类数量 */
export function queryStatisticsTypeInfo(data) {
    return request('get', 'statistics/typeInfo', data)
}

/* 获取网站流量 */
export function querySiteVisit(data) {
    return request('get', 'statistics/visit', data)
}

/* 获取网站汇总数据 */
export function querySummaryData(data) {
    return request('get', 'statistics/summary', data)
}