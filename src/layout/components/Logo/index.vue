<template>
    <router-link :to="to" :class="{
        'title': true,
        'is-link': $store.state.settings.enableDashboard
    }" :title="title"
    >
        <img v-if="showLogo" :src="logo" class="logo">
        <span v-if="showTitle" @click.stop="toBlog">{{ title }}</span>
    </router-link>
</template>

<script>
// import imgLogo from '@/assets/images/logo.jpeg'

export default {
    name: 'Logo',
    props: {
        showLogo: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            title: import.meta.env.VITE_APP_TITLE,
            logo: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2F2021%2Fedpic_source%2Fa9%2F3a%2Fb0%2Fa93ab0786b9c8c524fec92a434de9ff3_15.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1646997051&t=301eb9f5989474f6940e1281306548f7'
        }
    },
    computed: {
        to() {
            let rtn = {}
            if (this.$store.state.settings.enableDashboard) {
                rtn.name = 'dashboard'
            }
            return rtn
        }
    },
    methods: {
        toBlog() {
            window.open('https://www.jiangly.com')
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    position: fixed;
    z-index: 1000;
    top: 0;
    width: inherit;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $g-sidebar-logo-height;
    text-align: center;
    overflow: hidden;
    text-decoration: none;
    &.is-link {
        cursor: pointer;
    }
    .logo {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
        & + span {
            margin-left: 10px;
        }
    }
    span {
        display: block;
        font-weight: bold;
        color: #fff;
        @include text-overflow;
    }
}
</style>
