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
          "V_1.0: <br>" +
          "上线网站<br>" +
          "<br>" +
          "V_1.1: <br>" +
          "1.将壁纸更新为1080P，并解决背景图加载卡住的问题(其实就是换了个链接)<br>" +
          "2.降低分类标题视图的透明度和模糊值，让看起来更有毛玻璃的感觉<br>" +
          "3.在底部增加版本显示，并加入更新日志<br>"
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