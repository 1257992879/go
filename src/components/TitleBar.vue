<template>
  <div id="titleBar">
    <span id="titleBarContext">
      <i :class="iconClass"></i>
      <span>{{titleName}}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: "TitleBar",
  props: {
    iconClass: String,
    titleName: String
  }
}
</script>

<style scoped>
#titleBar{
  color: white;
}
#titleBarContext{
  display: inline-block;
  padding: 0 7px 0 5px;
  font-size: 17px;
  background: rgba(240, 240, 240, 0.35);
  color: black;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 6px;
}
</style>