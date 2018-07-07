<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script>
import header from './components/header/header.vue'
import * as type from './assets/type.js'
import {urlParse} from './common/js/util.js'

export default {
  data () {
    return {
      seller: {
        id: (() => {
          // 定义urlParse方法获取url里的id参数
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  components: {
    'v-header': header
  },
  mounted () {
    this.axios.get('/api/seller?id=' + this.seller.id).then((res) => {
      if (res.data.errno === type.ERR_OK) {
        // this.seller = res.data.data
        // 给this.seller扩展属性，保留id属性
        this.seller = Object.assign({}, this.seller, res.data.data)
      }
    })
  }
}

</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    .tab
      display : flex
      width : 100%
      height : 40px
      line-height : 40px
      .tab-item
        flex:1
        text-align: center
        // &是指父元素 这里是 class=“tab-item” 的div
        & > a
          // 使得整个alink的块可被点击
          display:block
          font-size :14px
          color :rgb(77,85,93)
        //选中后高亮
        .router-link-active
          color :rgb(240,20,20)
</style>
