import dayjs from 'dayjs'

export const formatTime = rows => {
    if (!rows.length) return
    rows.forEach(item => {
        item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        item.updatedAt = dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    })
}
