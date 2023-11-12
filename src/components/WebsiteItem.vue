<script lang="ts" setup>

import type {WebsiteItem} from "@/types/WebsiteList";

defineProps<{
    networkEnv: string,
    websiteItem: WebsiteItem,

    // link: string,
    // imageSrc: string,
    // name: string,
    // desc: string,
    // accessWay: string
}>()

</script>


<template>
    <a id="item" :href="networkEnv==='1'&&websiteItem.accessWay==='VPN' ? websiteItem.vpnLink : websiteItem.link" target="_blank">


        <el-row>
            <el-col :span="9" style="text-align: center">
                <img id="imageIcon" :src="websiteItem.imageUrl" :alt="websiteItem.name">
                <span id="accessWay" v-if="websiteItem.accessWay==='仅内网'" style="background-color: rgb(245, 108, 108)">{{ websiteItem.accessWay }}</span>
                <span id="accessWay" v-else-if="websiteItem.accessWay==='VPN'" style="background-color: rgb(103, 194, 58)">{{ websiteItem.accessWay }}</span>
                <span id="accessWay" v-else-if="websiteItem.accessWay==='公网'" style="background-color: rgb(64, 158, 255)">{{ websiteItem.accessWay }}</span>
                <span id="accessWay" v-else>{{ websiteItem.accessWay }}</span>
            </el-col>

            <el-col :span="15">
                <div style="margin-left: 8px">
                    <span id="itemName">{{ websiteItem.name }}</span>
                    <br>
                    <span id="itemDesc">{{ websiteItem.desc }}</span>
                </div>
            </el-col>
        </el-row>


    </a>
</template>


<style scoped>
#item {
    width: 198px;
    height: 98px;
    margin: 10px;

    background: rgba(240, 240, 240, 0.5);
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

#imageIcon {
    width: 100%;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.4) 2px 2px 10px;
}

#itemName {
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
