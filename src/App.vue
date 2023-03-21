<template>
  <div id="app">
<!--    :style="{backgroundImage: 'url(' +backgroundImgUrl+ ')'}"       -->
    <div id="bg-image"></div>
    <TopView :website-item-list="websiteItemList" @networkEnvChange="networkEnv=$event"></TopView>
    <ListView :website-item-list="websiteItemList" :network-env="networkEnv" :website-item-num="websiteItemNum"></ListView>
    <EndView version="Version: 1.2 (beta)"></EndView>
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
}
#bg-image{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -10;
  background-image: url("https://api.isoyu.com/bing_images.php");
  background-color: dimgray;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  /*-webkit-background-size: cover;*/
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
      backgroundImgUrl: ""
    }
  },
  components: {
    EndView,
    TopView,
    ListView
  },
  mounted() {
    // //设置背景图，用日期做标记
    // const date = new Date()
    // this.backgroundImgUrl = 'https://api.isoyu.com/bing_images.php?date='+date.getFullYear()+'_'+(date.getMonth()+1)+'_'+date.getDate()

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
  }
}
</script>