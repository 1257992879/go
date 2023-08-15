<template>
  <div id="topView">
    <div id="topViewBlock">

      <el-row id="topViewContext">
        <!-- 标题 -->
        <el-col id="topViewTitle" :span="6" :xs="24">
          <i class="el-icon-s-promotion"></i>
          <span>学校常用网站</span>
        </el-col>

        <!-- 搜索框 -->
        <el-col :span="12" :xs="15">
          <el-autocomplete
              id="searchInput"
              class="inline-input"
              style="width: 100%"
              v-model="searchInput"
              :fetch-suggestions="querySearch"
              placeholder="搜索网站"
              :trigger-on-focus="false"
              @select="handleSelect"
              prefix-icon="el-icon-search"
          ></el-autocomplete>
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
        <el-col :span="24" :xs="0"><br><br></el-col>
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
#topView{
  height: 150px;
  overflow: hidden;
  padding: 10px;
}
#topViewBlock{
  height: 100%;
  background: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;

}
#topViewContext{
  padding: 10px;
  height: 100%;
}
#topViewTitle{
  color: white;
  /*text-align: center;*/
  font-size: 25px;
  font-weight: bold;
}

/* 搜索框 */
>>>#searchInput{
  background-color: rgba(255,255,255,0.2);
  color: rgb(240,240,240);
}

/* 选择网络环境 */
>>>#selectNetworkEnv{
  display: inline-block;
  background-color: rgba(255,255,255,0.2);
  padding: 3px 7px 3px 5px;
  border-radius: 8px;
}
>>>.networkEnvSelect{
  color: rgba(255,255,255,0.8);
  margin: 0;
}

/* 类别选择栏 */
>>>.el-tabs__item {
  color: rgba(255,255,255,0.5);
  margin-top: 5px;
}
>>>.el-tabs__item.is-active {
  color: rgba(255, 255, 255, 0.9);
}
>>>.el-tabs__nav-wrap::after{
  background-color: rgba(228, 231, 237, 0.3);
}
</style>


<script>

export default {
  name: "TopView",
  data(){
    return{
      searchInput: '',
      searchList: [],
      networkEnv: '0',
      tabIndex: '0'
    }
  },
  props: {
    websiteItemList: {}
  },
  methods: {
    fillSearchList(){
      let list = this.websiteItemList;
      list.forEach((aType)=>{ //一个种类
        aType.list.forEach((item)=>{ //一个item
          this.searchList.push({
            value: item.name, //叫value的才会显示在列表中
            link: item.link
          })
        })
      })
    },
    querySearch(queryString, cb) {
      if(this.searchList.length===0){
        this.fillSearchList()
      }

      let results;
      if (queryString) { //如果有输入
        results = this.searchList.filter((searchItem)=>{ //遍历searchList里每个元素，返回是否需要显示出来
          return ( searchItem.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1 ) //为true则包含该内容
        })
      }else { //没有输入
        results = this.searchList
      }
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect(item){
      window.open(item.link)
    },
    scrollToElement(tab) {
      // document.getElementById("aTitle1").scrollIntoView()
      // document.documentElement.scrollTop = document.getElementById("aTitle"+tab.index).offsetTop-10
        window.scrollTo(0, document.getElementById("aTitle"+tab.index).offsetTop-10)
    }
  },
  mounted() {
    //检查localStorage   更新网络环境选项
    let site;
    let networkEnv;
    if((site=window.localStorage.getItem("site")) && site==="world.lxc.www.go.school"){
      if((networkEnv=window.localStorage.getItem("networkEnv")) && (networkEnv==='0' || networkEnv==='1') ){
        this.networkEnv = networkEnv
      }else { //networkEnv不存在或不对: 重新设置networkEnv的值
        window.localStorage.setItem("networkEnv", this.networkEnv)
      }
    }else { //站点第一次访问或站点不对：清除localStorage并创建站点标记
      window.localStorage.clear()
      window.localStorage.setItem("site", "world.lxc.www.go.school")
    }
    this.$emit("networkEnvChange",this.networkEnv)

    window.onscroll = () =>{
        for (let i = this.websiteItemList.length-1; i >= 0; i--) {
            if ( document.documentElement.scrollTop >= (document.getElementById("aTitle"+i).offsetTop-10) && this.tabIndex !== i+'' ) {
                this.tabIndex = i+''
                break
            }
        }
    }

  },
  watch: {
    networkEnv: function(newVal) {
      window.localStorage.setItem("networkEnv", newVal)
      this.$emit("networkEnvChange",this.networkEnv)
    }
  }
}
</script>

