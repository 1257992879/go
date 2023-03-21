<template>
  <div id="end-block">
    <div id="info" @click="openVersionInfo">
      <span id="info-context">{{ version }}</span>
    </div>
  </div>
</template>

<script>
import {MessageBox} from "element-ui";

export default {
  name: "EndView",
  props: {
    version: String
  },
  data(){
    return {
      updateInfo:
          "<span class='updateListTitleNew'>Version 1.1</span>" +
          "<span class='updateListDate'>2022年11月22日</span>" +
          "<span class='updateListContext'>" +
            "1.将壁纸更新为1080P，并解决背景图加载卡住的问题(其实就是换了个链接)<br>" +
            "2.降低分类标题视图的透明度和模糊值，让看起来更有毛玻璃的感觉<br>" +
            "3.在底部增加版本显示，并加入更新日志<br>" +
          "</span>" +
          "<br>" +
          "<span class='updateListTitleOld'>Version 1.0</span>" +
          "<span class='updateListDate'>2022年11月11日</span>" +
          "<span class='updateListContext'>" +
            "上线网站<br>" +
          "</span>"
    }
  },
  methods: {
    openVersionInfo(){
      MessageBox.alert(this.updateInfo, '更新日志', {
        showConfirmButton: false,
        dangerouslyUseHTMLString: true
      });
    }
  }
}
</script>

<style scoped>
#end-block{
  text-align: center;
}
#info{
  display: inline-block;
  margin: 50px 0 10px 0;
  background: rgba(240, 240, 240, 0.35);
  color: black;
  font-size: 15px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 6px;
  padding: 5px 10px 5px 10px;
  cursor: pointer;
}
#info-context{
  /*padding: 20px;*/
}
</style>


<!-- 更新日志 -->
<style>
.updateListTitleNew{
  font-weight: bold;
  text-align: center;
  font-size: 25px;
  display: block;
}
.updateListTitleOld{
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  display: block;
}
.updateListDate{
  display: block;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  color: #969696;
}
.updateListContext{
  display: block;
  font-size: 13px;
}
</style>