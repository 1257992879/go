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
          "<div class='updateListBox'>"+
              "<span class='updateListTitleNew'>Version 1.3</span>" +
              "<span class='updateListDate'>2023年8月15日</span>" +
              "<span class='updateListContext'>" +
                "1.点击导航栏跳转到对应分类时添加了平滑滚动效果，并且导航栏的选择项会随着屏幕的滚动而变化<br>" +
                "2.修复了 iOS Safari 浏览器背景图的显示问题<br>" +
                "3.更新日志支持滑动<br>" +
                "4.将通用类和计算机类交换了位置<br>" +
              "</span>" +
              "<br>" +
              "<span class='updateListTitleOld'>Version 1.2</span>" +
              "<span class='updateListDate'>2023年3月25日</span>" +
              "<span class='updateListContext'>" +
                "1.增加PWA(Progressive Web App)支持: 支持安装为应用、访问时使用缓存，让网页像本地应用一样运行<br>" +
                "2.背景图在网页打开时会渐变变暗，形成暗角，不让背景图过亮与网页内容混在一起<br>" +
                "3.修改了更新日志的样式<br>" +
                "4.修复了一些bug(在网页宽度小于一个元素的宽度时报错无法显示 和 有时会出现的页面元素显示混乱)<br>" +
              "</span>" +
              "<br>" +
              "<span class='updateListTitleOld'>Version 1.1</span>" +
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
              "</span>"+
          "</div>"
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
/* #info-context{
  /*padding: 20px;*/
</style>


<!-- 更新日志 -->
<style>
.updateListBox {
    height: 300px;
    overflow-y: scroll;
    padding: 0 5px;
    /* scrollbar-width: none; */
}
/* 滚动条样式 */
/*
::-webkit-scrollbar {
    display: none;
}*/
.updateListBox::-webkit-scrollbar {
    width: 4px; /*  设置纵轴（y轴）轴滚动条 */
    height: 4px; /*  设置横轴（x轴）轴滚动条 */
}
/* 滚动条滑块（里面小方块） */
.updateListBox::-webkit-scrollbar-thumb {
    border-radius: 0px;
    background: transparent;
}
/* 滚动条轨道 */
.updateListBox::-webkit-scrollbar-track {
    border-radius: 0;
    background: transparent;
}
/* hover时显色 */
.updateListBox:hover::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
}
.updateListBox:hover::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
}



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