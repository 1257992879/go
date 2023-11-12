<script lang="ts" setup>
import {ref, computed, onMounted} from 'vue'

import TitleBar from "@/components/TitleBar.vue";
import WebsiteItem from "@/components/WebsiteItem.vue";
import type {WebsiteList} from "@/types/WebsiteList";


defineProps<{
    websiteItemList: WebsiteList,
    networkEnv: string,
    websiteItemNum: number
}>()


const displayWidth = ref(0)
const itemWidth = ref(230)
const itemHeight = ref(130)


const fillElementNum = computed(() => {
    return (itemNumInAType: number) => {
        let aLineNumber = Math.floor(displayWidth.value / itemWidth.value) //Math.floor()向下取整
        if (aLineNumber === 0) {
            aLineNumber = 1
        }
        let lastLineNumber = itemNumInAType % aLineNumber
        let addNumber;
        if (lastLineNumber === 0) {
            lastLineNumber = aLineNumber
        }
        addNumber = aLineNumber - lastLineNumber
        return addNumber;
    }
})


onMounted(() => {
    //监听文档宽的变化
    const resizeObserver = new ResizeObserver(() => { //监听元素大小改变  回调函数包含ResizeObserverEntry[]
        displayWidth.value = document.documentElement.clientWidth
    });
    resizeObserver.observe(document.documentElement);
})


</script>


<template>

<div style="text-align: center">

    <span v-for="(aType,index1) in websiteItemList" :key="index1">
        <TitleBar
            :icon-class="aType.titleIconName"
            :title-name="aType.title"
            :id="'aTitle'+index1"/>

        <template v-for="(item,index2) in aType.list" :key="index2">
            <WebsiteItem
              :website-item="item"
              :network-env="networkEnv"
            />
        </template>


        <template v-for="i in fillElementNum(aType.list.length)" :key="i+'-hidden'">
            <WebsiteItem
              style="visibility: hidden"
              network-env="0"
              :website-item="{link: '',imageUrl: '',name: '',desc: '',accessWay: ''}"
            />
        </template>

    </span>
</div>


</template>



