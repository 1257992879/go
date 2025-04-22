<script lang="ts" setup>

import {ref, watch} from 'vue'
import type {WebsiteItem} from "@/types/WebsiteList";
import {hideSlider, showSlider} from "@/utils/DocumentUtils";


const props = defineProps<{
    networkEnv: string,
    websiteItem: WebsiteItem,
    openAnimation?: boolean
}>()



// a 标签元素
const websiteEl = ref<HTMLDivElement>()

// 要跳转的链接
const link = ref(  (props.networkEnv==='1'&&props.websiteItem.accessWay==='VPN') ? props.websiteItem.vpnLink : props.websiteItem.link  )
watch(()=>props.networkEnv, (newVal)=>{
    link.value = (props.networkEnv==='1'&&props.websiteItem.accessWay==='VPN') ?
        props.websiteItem.vpnLink :
        props.websiteItem.link
})




function openWebsiteWithoutAnimation() {
    window.open(link.value)
}


// --------------- 动画相关 ---------------
// 判断元素是否已经处于动画中
const animationElClickable = ref<boolean>(true)
// 原来 a 标签的样式
const elementStyle = ref('')
// 动画 a 标签的样式
const openAnimationStyle = ref('')
// 网站照片的样式
const imageStyle = ref('')
// 网站标题的样式
const titleStyle = ref('')
// 网站标题元素
const titleEl = ref<HTMLSpanElement>()
// 需要消失的元素的样式
const opacityZeroStyle = ref('')


function openWebsiteWithAnimation() {
    // 如果websiteEl不存在 或者 处于动画中  则直接结束
    if (!websiteEl.value || !animationElClickable.value) return
    animationElClickable.value = false

    // 隐藏滑动条 body设为不可滑动
    hideSlider()

    // 800ms 后打开页面
    setTimeout(()=>{
        window.open(link.value)
    }, 800)

    // 点击的元素透明度设为0
    elementStyle.value = 'opacity: 0;'

    // 显示动画的元素覆盖上去
    // @ts-ignore
    openAnimationStyle.value = 'position:absolute; top:0px; left:0px;'

    // 留个缓冲时间
    setTimeout(()=>{
        // 展开到全屏
        openAnimationStyle.value = 'position:absolute; width:calc(100vw - 2px); height:calc(100vh - 2px); top:calc(-'+websiteEl.value?.parentElement?.style.top+' + '+document.documentElement.scrollTop+'px); left:-'+websiteEl.value?.parentElement?.style.left+'; margin:0; padding:0;'

        // 照片移动到中间
        // @ts-ignore
        imageStyle.value = 'transition:transform 0.3s; width:74.25px; height:74.25px; transform:translateX(calc(50vw - 37.125px)) translateY(35vh);'

        // 标题移动到中间
        // @ts-ignore
        titleStyle.value = 'transition:transform 0.3s, color 0.3s; transform:translateX(calc(-37.5vw - 8px + 50vw - '+titleEl.value?.clientWidth / 2+'px)) translateY(50vh);'

        // 其他信息消失
        opacityZeroStyle.value = 'opacity: 0;'

        // 200ms 后 背景变色
        setTimeout(()=>{
            openAnimationStyle.value += ' background-color:var(--browser-background); border: 1px solid var(--browser-background);'
            titleStyle.value += 'color:var(--color-text)'
        }, 200)

        // 1.5s 后 关闭动画
        setTimeout(()=>{
            stopOpenWebsiteAnimation()
        }, 1500)
    }, 50)
}
function stopOpenWebsiteAnimation() {

    openAnimationStyle.value += ' opacity: 0;'
    setTimeout(()=>{
        openAnimationStyle.value = ''
        opacityZeroStyle.value = ''
        imageStyle.value = ''
        titleStyle.value = ''
        animationElClickable.value = true
        showSlider()
    }, 350)

    elementStyle.value = ''

}




</script>


<template>
<div style="display: inline-block">
    <a id="item" :href="link" target="_blank" @click.prevent="openAnimation ? openWebsiteWithAnimation() : openWebsiteWithoutAnimation()" :style="elementStyle" ref="websiteEl">
        <el-row>
            <el-col :span="9">
                <img id="imageIcon" :src="websiteItem.imageUrl" :alt="websiteItem.name">
                <div style="text-align:center">
                    <span id="accessWay" v-if="websiteItem.accessWay==='仅内网'" style="background-color: rgb(245, 108, 108)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else-if="websiteItem.accessWay==='VPN'" style="background-color: rgb(103, 194, 58)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else-if="websiteItem.accessWay==='公网'" style="background-color: rgb(64, 158, 255)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else>{{ websiteItem.accessWay }}</span>
                </div>
            </el-col>

            <el-col :span="15">
                <div style="margin-left: 8px">
                    <span id="itemName" ref="titleEl">{{ websiteItem.name }}</span>
                    <br>
                    <span id="itemDesc">{{ websiteItem.desc }}</span>
                </div>
            </el-col>
        </el-row>
    </a>

    <!-- 动画元素 -->
    <a v-if="openAnimationStyle!==''" id="item" target="_blank" :style="openAnimationStyle" class="animationEl">
        <el-row>
            <el-col :span="9">
                <img id="imageIcon" :src="websiteItem.imageUrl" :alt="websiteItem.name" :style="imageStyle">
                <div style="text-align:center" class="animationEl" :style="opacityZeroStyle">
                    <span id="accessWay" v-if="websiteItem.accessWay==='仅内网'" style="background-color: rgb(245, 108, 108)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else-if="websiteItem.accessWay==='VPN'" style="background-color: rgb(103, 194, 58)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else-if="websiteItem.accessWay==='公网'" style="background-color: rgb(64, 158, 255)">{{ websiteItem.accessWay }}</span>
                    <span id="accessWay" v-else>{{ websiteItem.accessWay }}</span>
                </div>
            </el-col>

            <el-col :span="15">
                <div style="margin-left: 8px">
                    <span id="itemName" :style="titleStyle">{{ websiteItem.name }}</span>
                    <br>
                    <span id="itemDesc" class="animationEl" :style="opacityZeroStyle">{{ websiteItem.desc }}</span>
                </div>
            </el-col>
        </el-row>
    </a>
</div>
</template>


<style scoped>
#item {
    width: 198px;
    height: 98px;
    /*margin: 10px;*/

    background-color: rgba(240, 240, 240, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    text-align: left;
    border: 1px solid rgba(215, 218, 226, 0.65);
    border-radius: 8px;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
    box-shadow: rgba(0, 0, 0, 0.2) 3px 3px 10px;
    display: inline-block;
    padding: 5px;
    color: black;
    overflow: hidden;
}
.animationEl {
    z-index:10;
    transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, background-color 0.3s, opacity 0.3s, color 0.3s;
}

#imageIcon {
    width: 100%;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.4) 2px 2px 10px;
}

#itemName {
    display: inline-block;
    font-size: 18px;
    white-space: nowrap;
}

#itemDesc {
    font-size: 13px;
    color: rgb(80, 80, 80);
}

#accessWay {
    font-size: 12px;
    color: rgb(255, 255, 255);
    background-color: rgb(144, 147, 153);
    border-radius: 5px;
    padding: 3px;
}

</style>
