<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{
                    item.name }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.name }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { ref, watch } from "vue"

const route = useRoute()
const router = useRouter()
const levelList = ref(null)

//判断是否是主页
const isDashboard = routes => {
    const name = routes && routes.name
    if (!name) {
        return false
    }
    //不是主页添加根节点
    return name.trim().toLocaleLowerCase() === "".toLocaleLowerCase()
}

const getBreadcrumb = () => {
    //获取所有路由信息
    let matched = route.matched.filter((item) => item.meta && item.name)
    //取出第一判断是否是根元素,不是根元素添加根元素
    const first = matched[0]
    if (!isDashboard(first)) {
        matched = [{ path: "/", meta: { title: "" } }].concat(matched)
    }
    levelList.value = matched.filter((item) => item.meta && item.name && item.meta.breadcrumb !== false)
}
//面包屑跳转
const handleLink = item => {
    const { path, redirect } = item
    if (redirect) {
        //判断是否是根标签
        router.push(redirect)
        return
    }
    router.replace(path)
}


watch(route, () => {
    getBreadcrumb()
})
getBreadcrumb()
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
