import banner from 'vite-plugin-banner'

export default function createBanner() {
    return banner(`
/**
 * name: admin
 * homepage: https://hooray.gitee.io/admin/
 */
    `)
}
