<template>
  <div id="app">
    <img id="bg-image" :src="backgroundImgUrl" alt="backgroundImage">
    <transition name="el-fade-in-linear">
      <img id="bg-image" class="transition-box" v-show="newBGImgFlag" :src="newBackgroundImgUrl" alt="backgroundImage">
    </transition>
    <div id="cover" :style="{opacity: loadStatus}"></div>
    <TopView :website-item-list="websiteItemList" @networkEnvChange="networkEnv=$event"></TopView>
    <ListView :website-item-list="websiteItemList" :network-env="networkEnv" :website-item-num="websiteItemNum"></ListView>
    <EndView :version="'Version: ' + version"></EndView>
  </div>
</template>

<style>
body{
  margin: 0;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
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
}
#cover {
  z-index: -5;
  opacity: 0;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(0,0,0,0) 0,rgba(0,0,0,.5) 100%),radial-gradient(rgba(0,0,0,0) 33%,rgba(0,0,0,.3) 166%);
  transition: .8s;
}
</style>

<script>
import ListView from "@/views/ListView";
import TopView from "@/views/TopView";
import EndView from "@/views/EndView";
export default {
  data(){
    return{
      websiteItemList: {},
      networkEnv: "",
      websiteItemNum: -1,
      backgroundImgUrl: 'https://api.lxc2.com:8/bingImg',
      newBackgroundImgUrl: '',
      newBGImgFlag: false,
      loadStatus: '0',
      version: '1.3'
    }
  },
  components: {
    EndView,
    TopView,
    ListView
  },
  mounted() {
    //获取列表数据
    this.$axios.get("./website-list.json")
        .then((resp)=>{
          const list = resp.data.websiteList
          this.websiteItemList = list
          this.websiteItemNum = 0
          list.forEach((aType)=>{ //一个种类
            aType.list.forEach(()=>{ //一个item
              this.websiteItemNum++;
            })
          })
        })
        .catch((error) => {
          console.error(JSON.stringify(error))
          alert("获取列表失败")
        })

    //监听更新背景图事件
    document.addEventListener('documentRefreshBackgroundImage', ()=>{
      let newBGUrl = new URL(this.backgroundImgUrl)
      newBGUrl.searchParams.set('timestamp', Date.now().toString())
      this.newBackgroundImgUrl = newBGUrl

      this.newBGImgFlag = true
      setTimeout(()=>{
        this.backgroundImgUrl = newBGUrl
        this.newBGImgFlag = false
      },1000)
    })

    window.onload = ()=>{
      this.loadStatus = '1'

      // //检查版本信息，是否更新了新版本
      // let storageVersion = window.localStorage.getItem("go_version")
      // if (storageVersion) { //存在版本信息
      //   if (storageVersion !== this.version) { //发生了版本更新
      //
      //   }
      // } else { //不存在版本信息: 第一次打开
      //
      // }
    }
  }
}
</script>