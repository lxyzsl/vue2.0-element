<template>
  <div class="goods">
      <!-- 菜单 -->
      <!-- ref:用来绑定DOM元素，然后在$refs里被调用 -->
      <!-- ref必须采用驼峰写法 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!-- 当计算属性返回的index与循环的key一致时修改css使其高亮 -->
          <li v-for="(item,key) in goods" :key="key" class="menu-item"
          :class="{'current':currentIndex === key}" @click="selectMenu(key,$event)">
            <span class="text">
              <!-- 当type>0时显示icon -->
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!-- 商品 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item,key) in goods" :key="key" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="(food,key2) in item.foods" :key="key2" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <!-- 按钮组件 -->
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 购物车 -->
      <shopcart ref="shopcart" :selectFoods ="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
      <!-- food组件 -->
      <food ref="food" :food="selectedFood" v-on:cart-add="cartAdd"></food>
  </div>
</template>

<script>
import * as type from '../../assets/type.js'
// 引入滚动条
import Bscroll from 'better-scroll'
// 引入购物车组件
import shopcart from '../shopcart/shopcart'
// 引入按钮组件
import cartcontrol from '../cartcontrol/cartcontrol'
// 引入商品详情food组件
import food from '../food/food'

export default {
  props: ['seller'],
  data () {
    return {
      goods: [],
      // 定义商品类高度数组
      listHeight: [],
      // 定义菜单类高度
      scrollY: 0,
      selectedFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    // 将所有点击过的商品数目传给shopcart
    selectFoods () {
      let foods = []
      // 遍历得到所有分类
      this.goods.forEach((good) => {
        // 遍历得到所有商品
        good.foods.forEach((food) => {
          // 这个count实在购物车按钮组件里用通过Vue.set()添加的新属性
          // 把数量>0的商品放入foods传给购物车组件，然后通过购物车组件的计算属性动态的改变底部
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  mounted () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.axios.get('/api/goods').then((res) => {
      if (res.data.errno === type.ERR_OK) {
        this.goods = res.data.data
        // 场景是在进行获取数据后，需要对新视图进行下一步操作或者其他操作时就需要nextTick
        this.$nextTick(() => {
          this._initScroll()
          // DOM更新后计算高度以便实现滚动条联动
          this._calculateHeight()
        })
      }
    })
  },
  methods: {
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      // 调用food组件的show方法
      this.$refs['food'].show()
    },
    selectMenu (index, event) {
      // 将事件传入并且判断是否是Bscroll派发事件还是默认事件
      // 如果是默认事件则return掉，以免在pc模式下同时触发两个事件
      // 原生事件是没有_constructed属性，所以可以通过有没有_constructed来判断
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      // 获取food类的index
      let el = foodList[index]
      // 以300毫秒的时间将导航条定位到对于的foods类
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll () {
      this.menuScroll = new Bscroll(this.$refs.menuWrapper, {
        // 恢复默认点击事件
        click: true
      })
      this.foodsScroll = new Bscroll(this.$refs.foodsWrapper, {
        click: true,
        // 实时获取滚动条位置
        probeType: 3
      })
      // on方法时监听当前实例上的自定义事件
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      // 获取商品类
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      // 将初始高度0填充到数组第一位
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        // 将商品类的高度以此累加并填充到数组里
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    cartAdd (el) {
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        // 用来绑定DOM元素，然后在$refs访问
        // 调用shopcart组件的drop()函数
        this.$refs['shopcart'].drop(el)
      })
    },
    addFood (el) {
      this.$nextTick(() => {
        // 用来绑定DOM元素，然后在$refs访问
        // 调用shopcart组件的drop()函数
        this.$refs['shopcart'].drop(el)
      })
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  }
}
</script>

<style lang="stylus">
  @import "../../common/stylus/mixin.styl";
  @import "../../common/stylus/icon.styl";
  // goods页很有可能会超过页面的高度，而且也没有纵向滚动条。
  // 所以超过的部分会被隐藏，左侧分类和右侧商品都是可以滚动的
  // 所以goods应该使用绝对定位来确定视口
  .goods
    display flex
    position absolute
    width 100%
    // 去掉header高度
    top 174px
    // 去掉购物车高度
    bottom 46px
    // 隐藏滚动条
    overflow hidden
    .menu-wrapper
      // 是否等分，是否缩放，占位空间
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        // 垂直居中组好的布局 display table
        display table
        width 56px
        height 54px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background #ffffff
          .text
            font-weight 700
            border 0
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          //bg-image('文件名')
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-bottom 1px solid rgba(7,17,27,0.1)
          font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background #f3f5f7
      // 由于左侧商品图片宽度时固定的，右侧商品名称随着设备宽度变化
      // 所以每个food-item都使用flex布局
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 3px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7,17,27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color #93999f
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            .count
              margin-right 12px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 18px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147,153,159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
