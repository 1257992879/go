<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue'
import {$axios, $version} from "@/global";
import TopView from "@/views/TopView.vue";
import ListView from "@/views/ListView.vue";
import EndView from "@/views/EndView.vue";

const websiteItemList = ref([])
const networkEnv = ref('')
const websiteItemNum = ref(-1)
const backgroundImgUrl = ref('https://api.lxc2.com:8/bingImg')
const newBackgroundImgUrl = ref('')
const newBGImgFlag = ref(false)
const loadStatus = ref<boolean>(false)
const version = ref($version)


const backgroundCoverStyle = ref<string>('backdrop-filter: blur(8px);-webkit-backdrop-filter: blur(8px);')
const backgroundImageStyle = ref<string>('transform: scale(1.1);')


const topViewEl = ref<HTMLDivElement>()


// --------------- 打开网站动画 ---------------
const openAnimation = ref<boolean>(false)
if (localStorage.getItem('openAnimation')==='true') {
    openAnimation.value = true
} else {
    openAnimation.value = false
    localStorage.setItem('openAnimation', 'false')
}
watch(openAnimation, (newVal)=>{
    if (newVal) {
        localStorage.setItem('openAnimation', 'true')
    } else {
        localStorage.setItem('openAnimation', 'false')
    }
})
function titleIconClick() {
    openAnimation.value = !openAnimation.value
}


onMounted(()=>{
    //获取列表数据
    $axios.get("./website-list.json")
        .then((resp:any)=>{
            const list = resp.data.websiteList
            websiteItemList.value = list
            websiteItemNum.value = 0
            list.forEach((aType:any)=>{ //一个种类
                aType.list.forEach(()=>{ //一个item
                    websiteItemNum.value++;
                })
            })
        })
        .catch((error:any) => {
            console.error(JSON.stringify(error))
            alert("获取列表失败")
        })

    //监听更新背景图事件
    document.addEventListener('documentRefreshBackgroundImage', ()=>{
        let newBGUrl = new URL(backgroundImgUrl.value)
        newBGUrl.searchParams.set('timestamp', Date.now().toString())
        newBackgroundImgUrl.value = newBGUrl.toString()

        newBGImgFlag.value = true
        setTimeout(()=>{
            backgroundImgUrl.value = newBGUrl.toString()
            newBGImgFlag.value = false
        },1000)
    })

    window.onload = ()=>{
        // setTimeout(()=>{
            loadStatus.value = true
        // }, 100)


        // 识别网络环境 (如果打开了)
        const autoSwitchNetworkEnvVal: string|null = localStorage.getItem('autoSwitchNetworkEnv')
        if (topViewEl.value) {
            if (autoSwitchNetworkEnvVal==='true') {
                // @ts-ignore
                topViewEl.value.switchNetworkEnv()
            } else if (autoSwitchNetworkEnvVal===null) {
                // @ts-ignore
                topViewEl.value.switchNetworkEnv()
                localStorage.setItem('autoSwitchNetworkEnv', 'true')
            }
        }
    }

})





</script>


<template>
    <div id="app">
        <img id="bg-image"
             :src="backgroundImgUrl"
             alt="backgroundImage"
             :style="loadStatus?'':backgroundImageStyle">
        <Transition name="el-fade-in-linear">
            <img id="bg-image"
                 class="transition-box"
                 v-show="newBGImgFlag"
                 :src="newBackgroundImgUrl"
                 alt="backgroundImage"
                 :style="loadStatus?'':backgroundImageStyle">
        </Transition>
        <div id="cover" :style="loadStatus?'':backgroundCoverStyle"></div>


        <TopView
            :website-item-list="websiteItemList"
            @networkEnvChange="networkEnv=$event"
            ref="topViewEl"
            :open-website-animation="openAnimation"
            @title-icon-click="titleIconClick"
        ></TopView>

        <ListView
            :website-item-list="websiteItemList"
            :network-env="networkEnv"
            :website-item-num="websiteItemNum"
            :open-website-animation="openAnimation"
        ></ListView>

        <EndView :version="'Version: ' + version"></EndView>
    </div>
</template>

<style>
body{
    margin: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    background-color: #72767b;
    /*background-image: url("./assets/bg.jpg");*/
    /*background-repeat: no-repeat;*/
    /*background-position: center;*/
    /*background-attachment: fixed;*/
    /*background-size: cover;*/
}
html{
    overflow: visible;
    scroll-behavior: smooth;
}
#bg-image{
    width: 100%;
    height: 100vh;
    position: fixed;
    z-index: -10;
    object-fit: cover;
    /*transition: .8s;*/
    /* 给 transform: scale(1.1); 添加动画 */
    transition: transform 0.8s;
}
#cover {
    z-index: -5;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0,0,0,0) 0,rgba(0,0,0,.5) 100%), radial-gradient(rgba(0,0,0,0) 33%,rgba(0,0,0,.3) 166%);
    transition: .8s;
}
</style>
