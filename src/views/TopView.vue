<script lang="ts" setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'
import {type WebsiteList} from '@/types/WebsiteList'
import { $pinyinUtil } from "@/global";



const props = defineProps<{
    websiteItemList: WebsiteList,
    openWebsiteAnimation?: boolean
}>()

const emit = defineEmits<{
    (e: 'networkEnvChange', networkEnv: string): void,
    (e: 'titleIconClick'): void
}>()


const tabIndex = ref<string>('0')



// --------------- 网络环境相关 ---------------
const autoSwitchNetworkEnv = ref<boolean>(true)
const networkEnv = ref<'0'|'1'>('0')
// 读取 "自动切换内外网链接" 开关的状态
if (localStorage.getItem('autoSwitchNetworkEnv')==='false') {
    autoSwitchNetworkEnv.value = false
} else {
    autoSwitchNetworkEnv.value = true
    localStorage.setItem('autoSwitchNetworkEnv', 'true')
}
watch(autoSwitchNetworkEnv, (newVal, oldVal) => {
    window.localStorage.setItem("autoSwitchNetworkEnv", String(newVal))
    if (newVal && !oldVal) {
        switchNetworkEnv()
    }
})
watch(networkEnv, (newVal) => {
    window.localStorage.setItem("networkEnv", newVal)
    emit("networkEnvChange", newVal)
})
function switchNetworkEnv() {
    let imgEl = new Image()

    let count = 0
    imgEl.onload = () => {

        if (count === 0) {
            console.log('内外网判断 -> 内网')
            networkEnv.value = '0'
        } else if (count >= 1) {
            console.log('内外网判断 -> 外网')
            networkEnv.value = '1'
        }

    }
    imgEl.onerror = () => {
        if (count >= 1) {
            console.log('内外网判断 -> 网络错误')
            return
        }

        count++
        imgEl.src = 'https://www.bilibili.com/favicon.ico?t='+String(Date.now())
    }

    // 时间戳 -> 因为相同的链接浏览器会走缓存，就判断不出内外网了
    imgEl.src = 'https://stu.neusoft.edu.cn/favicon.ico?t='+String(Date.now())

}




// --------------- 搜索相关 ---------------
type SuggestList = {
    value: string,
    valuePinyin: string[],
    link: string,
    vpnLink?: string,
    weight?: number
}[]
const searchInput = ref<string>('')
const searchList = ref<SuggestList>([])
const searchEl = ref<HTMLDivElement>()
function fillSearchList() {
    searchList.value = [] //清空
    props.websiteItemList.forEach((aType) => { //一个种类
        aType.list.forEach((item) => { //一个item
            searchList.value.push({
                value: item.name, //叫value的才会显示在列表中
                valuePinyin: $pinyinUtil.getPinyin(item.name, '', false, true) as string[],
                link: item.link,
                vpnLink: item.vpnLink
            })
        })
    })
}
function calcWeight(item: SuggestList[0], searchInput: string): number {
    const itemValue = item.value.toLowerCase()
    searchInput = searchInput.toLowerCase()

    let weight = 0
    for (let i = 0; i < searchInput.length; i++) { //遍历searchInput的每个字符
        if (itemValue.includes(searchInput[i])) { //直接匹配上 权重+5
            weight += 2
            if (itemValue.indexOf(searchInput[i]) === i) { //字母顺序匹配上
                weight += 2
            }
        } else {
            let flag: boolean = false
            let indexSameFlag: boolean = false
            item.valuePinyin.forEach((pinyin) => {
                if (pinyin.includes(searchInput[i])) {
                    flag = true
                    if (pinyin.indexOf(searchInput[i]) === i) { //字母顺序匹配上
                        indexSameFlag = true
                    }
                }
            })
            if(flag) { weight += 1 }  //拼音匹配上 权重+1
            if (indexSameFlag) { weight += 2 } //字母顺序匹配上 权重+2
        }
    }
    if (searchInput===itemValue) { weight += 100 } //完全匹配 权重+100
    return weight
}
function querySearch(queryString: string, cb: (res: SuggestList) => void) {
    if (searchList.value.length === 0) {
        fillSearchList()
    }

    let results: SuggestList;
    if (queryString) { //如果有输入
        results = searchList.value

        // 计算权重
        for (let i = 0; i < results.length; i++) {
            results[i].weight = calcWeight(results[i], queryString)
        }

        // 清除权重为0的项
        results = results.filter((item) => {
            return item.weight !== 0
        })

        // 按权重排序 权重高的在上
        results.sort((a, b) => {
            return b.weight! - a.weight!
        })
    } else { //没有输入
        results = searchList.value
    }
    // 调用 callback 返回建议列表的数据
    cb(results);
}

function handleSelect(item: SuggestList[0]) {
    if (networkEnv.value === '1') {
        window.open(item.vpnLink || item.link)
    } else {
        window.open(item.link)
    }
}



// --------------- 滑动到指定类别 ---------------
function scrollToElement(tab: any) {
    // document.getElementById("aTitle1").scrollIntoView()
    // document.documentElement.scrollTop = document.getElementById("aTitle"+tab.index).offsetTop-10
    //@ts-ignore
    window.scrollTo(0, document.getElementById("aTitle" + tab.index).offsetTop - 10)
}



// 监听 "/" 快捷键
function keydownHandler(event: KeyboardEvent) {
    const keyValue = event.key

    if (keyValue === '/') {
        if (searchEl.value) {
            setTimeout(() => {
                searchEl.value?.focus()
            }, 50)
        }
    }
}
onMounted(() => {
    //检查localStorage   更新网络环境选项
    let site;
    let networkEnvTemp;
    if ((site = window.localStorage.getItem("site")) && site === "world.lxc.www.go.school") {
        if ((networkEnvTemp = window.localStorage.getItem("networkEnv")) && (networkEnvTemp === '0' || networkEnvTemp === '1')) {
            networkEnv.value = networkEnvTemp
        } else { //networkEnv不存在或不对: 重新设置networkEnv的值
            window.localStorage.setItem("networkEnv", networkEnv.value)
        }
    } else { //站点第一次访问或站点不对：清除localStorage并创建站点标记
        window.localStorage.clear()
        window.localStorage.setItem("site", "world.lxc.www.go.school")
    }
    emit('networkEnvChange', networkEnv.value)


    window.onscroll = () => {
        for (let i = props.websiteItemList.length - 1; i >= 0; i--) {
            //@ts-ignore
            if (document.documentElement.scrollTop >= (document.getElementById("aTitle" + i).offsetTop - 10)) {
                tabIndex.value = i + ''
                break
            }
        }
    }

    // 监听键盘点击 "/"
    document.addEventListener("keydown", keydownHandler)

})
onUnmounted(()=>{
    document.removeEventListener("keydown", keydownHandler)
})


defineExpose({switchNetworkEnv})

</script>


<template>
    <div id="topView" class="unselectable">
        <div id="topViewBlock">

            <el-row id="topViewContext">
                <!-- 标题 -->
                <el-col id="topViewTitle" :span="6" :xs="15">
                    <div style="margin-top: 4px">
                        <font-awesome-icon :icon="['fas', 'paper-plane']"
                            id="goIcon"
                            :class="{'iconActive':openWebsiteAnimation===true}"
                            @click="emit('titleIconClick')"
                        />
                        <span>学校常用网站</span>
                    </div>
                </el-col>
                <el-col :span="0" :xs="9">
                    <div style="margin: 6px 0 0 0; text-align: center">
                        <span style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin-right: 10px">自动切换内外网链接</span>
                        <el-switch
                            v-model="autoSwitchNetworkEnv"
                            size="small"
                        />
                    </div>
                </el-col>

                <!-- 搜索框 -->
                <el-col :span="12" :xs="15">
                    <el-autocomplete
                        id="searchInput"
                        class="inline-input"
                        style="width: 100%"
                        v-model="searchInput"
                        :fetch-suggestions="querySearch"
                        placeholder="搜索网站  (使用 / 快捷键)"
                        :trigger-on-focus="true"
                        @select="handleSelect"
                        prefix-icon="el-icon-search"
                        ref="searchEl"
                    >
                        <template #prefix>
                            <font-awesome-icon :icon="['fas', 'magnifying-glass']"/>
                        </template>
                    </el-autocomplete>
                </el-col>

                <!-- 网络环境选择 -->
                <el-col :span="6" :xs="9" style="text-align: center">
                    <div id="selectNetworkEnv">
                        <el-radio class="networkEnvSelect" v-model="networkEnv" label="0">内网</el-radio>
                        <br>
                        <el-radio class="networkEnvSelect" v-model="networkEnv" label="1">外网</el-radio>
                    </div>
                </el-col>

                <!-- 空行和类别导航栏 -->
                <el-col :span="24" :xs="0">
                    <el-row>
                        <el-col :span="18"></el-col>
                        <el-col :span="6">
                            <div style="margin: 15px 0 0 0; text-align: center">
                                <span style="font-size: 13px; color: rgba(255, 255, 255, 0.5); margin-right: 10px">自动切换内外网链接</span>
                                <el-switch
                                    v-model="autoSwitchNetworkEnv"
                                    size="small"
                                />
                            </div>
                        </el-col>
                    </el-row>


                </el-col>
                <el-col :span="24">
                    <el-tabs id="tabs" v-model="tabIndex" @tab-click="scrollToElement" style="padding: 0 10px">
                        <el-tab-pane
                            v-for="(aType,index) in websiteItemList"
                            :key="index"
                            :label="aType.title"
                            :name="index+''"
                        ></el-tab-pane>
                    </el-tabs>
                </el-col>

            </el-row>
        </div>
    </div>
</template>


<style scoped>
/* 顶栏块元素 */
#topView {
    height: 150px;
    overflow: hidden;
    padding: 10px;
}

#topViewBlock {
    height: 100%;
    background: rgba(50, 50, 50, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 20px;

}

#topViewContext {
    padding: 10px;
    height: 100%;
}

#topViewTitle {
    color: white;
    /*text-align: center;*/
    font-size: 25px;
    font-weight: bold;
}

#goIcon {
    font-size: 23px;
    margin-right: 4px;
    cursor: pointer;
}
.iconActive {
    color: rgb(88,159,248);
}

/* 搜索框 */
:deep(.el-input__wrapper) {
    background-color: rgba(255, 255, 255, 0.2);
    height: 40px;
}

:deep(.el-input__prefix) {
    width: 20px;
}

:deep(.el-input__inner) {
    color: rgb(240, 240, 240);
}


/* 选择网络环境 */
#selectNetworkEnv {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 3px 7px 4px 5px;
    border-radius: 8px;
}

.networkEnvSelect {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    display: inline-block;
    height: 20px;
}

.el-switch {
    --el-switch-on-color: rgba(64, 158, 255, 0.95);
    --el-switch-off-color: rgba(210, 210, 210, 0.9);
}



/* 类别选择栏 */
:deep(.el-tabs__item) {
    color: rgba(255, 255, 255, 0.5);
    margin-top: 5px;
}

:deep(.el-tabs__item.is-active) {
    color: rgba(255, 255, 255, 0.9);
}

:deep(.el-tabs__nav-wrap::after) {
    background-color: rgba(228, 231, 237, 0.3);
}
</style>



