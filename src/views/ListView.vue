<template>

  <div style="text-align: center">

  <span :key="index1" v-for="(aType,index1) in websiteItemList">
    <TitleBar
        :icon-class="aType.titleIconName"
        :title-name="aType.title"
        :id="'aTitle'+index1"
    />

    <template v-for="(item,index2) in aType.list"> <!-- 内网 -->
      <WebsiteItem
          v-if="networkEnv==='1'&&item.accessWay==='VPN'"
          :key="index2"
          :link="item.vpnLink"
          :image-src="item.imageUrl"
          :name="item.name"
          :desc="item.desc"
          :access-way="item.accessWay"
      />
      <WebsiteItem
          v-else
          :key="index2"
          :link="item.link"
          :image-src="item.imageUrl"
          :name="item.name"
          :desc="item.desc"
          :access-way="item.accessWay"
      />
    </template>


    <template v-for="i in fillElementNum(aType.list.length)">
      <WebsiteItem
          :key="i+'-hidden'"
          style="visibility: hidden"
      />
    </template>


  </span>

  </div>


</template>

<script>
// @ is an alias to /src
import WebsiteItem from '@/components/WebsiteItem'
import TitleBar from "@/components/TitleBar";

export default {
  name: 'ListView',
  data(){
    return{
      displayWidth: 0,
      itemWidth: 230,
      itemHeight: 130
    }
  },
  methods: {
    // scrollToElement(elementIndex){
    //   // document.getElementById("aTitle1").scrollIntoView()
    //   document.documentElement.scrollTop = document.getElementById("aTitle"+elementIndex).offsetTop-10
    // }
  },
  components: {
    TitleBar,
    WebsiteItem
  },
  props: {
    websiteItemList: {},
    networkEnv: String,
    websiteItemNum: Number
  },
  computed: {
    fillElementNum() {
      return function (itemNumInAType) {
        const aLineNumber = Math.floor(this.displayWidth / this.itemWidth) //Math.floor()向下取整
        let lastLineNumber = itemNumInAType % aLineNumber
        let addNumber;
        if (lastLineNumber === 0) {
          lastLineNumber = aLineNumber
        }
        addNumber = aLineNumber - lastLineNumber
        return addNumber;
      }

    }
  },
  mounted() {
    this.displayWidth = document.documentElement.clientWidth
    window.onresize = ()=> {
      this.displayWidth = document.documentElement.clientWidth
    }
    onload = () => {
      this.displayWidth = document.documentElement.clientWidth
    }
  }
}
</script>

