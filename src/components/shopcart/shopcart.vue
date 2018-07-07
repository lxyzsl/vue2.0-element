<template>
  <div>
    <div class="shopcart">
      <!-- 来回折叠，fold取反 -->
      <div class="content" @click="toggleList">
        <!-- 左区块宽度自适应 -->
        <div class="content-left">
          <!-- logo区块 -->
          <div class="logo-wrapper">
            <!-- 当有数量是，绑定新属性使其高亮 -->
            <div class="logo" :class="{'highlight':totalCount>0}">
              <!-- 购物车icon -->
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <!-- 价格区块 -->
          <div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}元</div>
          <!-- 注释区块 -->
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- 右总价格区块宽度固定 -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition name="drop"
        v-for="(ball,key) in balls" :key="key"
        @before-enter="beforeDrop"
        @enter="dropping"
        @after-enter="afterDrop">
          <div v-show="ball.show" class="ball" v-bind:css="false">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <!-- 购物车详情页面 -->
      <!-- 由于不能直接再计算属性里更改data，所以由watch来监测isShow -->
      <transition name="fold">
        <div class="shopcart-list" v-show="isShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,key) in selectFoods" :key="key">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
      </transition>
    </div>
    <!-- 购物车列表出现后增加虚化背景 -->
    <transition name="fade">
      <div class="list-mask" v-show="isShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
// 引入按钮组件
import cartcontrol from '../cartcontrol/cartcontrol'
// 引入滚动条
import Bscroll from 'better-scroll'

export default {
  props: {
    // 选择的商品
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 20,
            count: 1
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 定义5个小球状态为False
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      // 是否显示购物车列表
      isShow: false
    }
  },
  computed: {
    // 计算总价格
    totalPrice () {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    // 计算总数量
    totalCount () {
      let count = 0
      this.selectFoods.forEach(food => {
        count += food.count
      })
      return count
    },
    // 结算描述
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    }
  },
  methods: {
    // 点击事件折叠购物车列表
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.isShow = !this.isShow
    },
    // 从所以的小球里找到一个隐藏的小球，并将其设置为true
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    // transition钩子函数
    beforeDrop (el) {
      // 把所有show为true的小球都找到
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          // 返回这个元素相对这个视口的left和top偏移
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          // 窗口的高度-按钮的高度-购物车图标高度
          let y = -(window.innerHeight - rect.top - 22)
          // 给小球附上 transform属性
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 设置小球的初始位置
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping (el) {
      /* eslint-disable no-unused-vars */
      // 获取dom元素的某些属性可以触发浏览器重绘
      // 这里就随便获取了el的高度
      let rf = el.offsetHeight
      this.$nextTick(() => {
        // dropping是将位置置回来
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
      })
    },
    afterDrop (el) {
      // 删除第一个元素并返回
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    // 清空购物车列表
    empty () {
      // 将所有商品数量置零
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    // 点击其他区域收起购物车列表
    hideList () {
      this.isShow = false
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}元`)
    }
  },
  components: {
    cartcontrol
  },
  watch: {
    // 监测totalCount数据，当总数量为0时，隐藏购物车列表
    totalCount () {
      if (!this.totalCount) {
        this.isShow = false
        return false
      }
    },
    // 监测isShow数据
    isShow () {
      let show = this.isShow
      // 当购物车列表展开时才可以加减商品数量
      if (show) {
        this.$nextTick(() => {
          // 如果没有better-scroll的实例则添加
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs.listContent, {
              click: true
            })
          } else {
            // refresh计算是否需要滚动
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl";
  .shopcart
    // 底部固定
    position fixed
    left 0
    bottom 0
    // 设置z-index是为了能盖住底部
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0
      .content-left
        // 左区块自适应
        flex 1
        .logo-wrapper
          // 横向布局
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          // 设为圆
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            // 有商品时高亮
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              // 有商品时高亮
              &.highlight
                color #ffffff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #ffffff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          // 横向布局
          display inline-block
          font-size 24px
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          color rgba(255,255,255,0.4)
          border-right 1px solid rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          &.highlight
            color #ffffff
        .desc
          // 横向布局
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          color rgba(255,255,255,0.4)
          font-size 10px
      .content-right
        // 右区块固定
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          color rgba(255,255,255,0.4)
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #ffffff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        // Y洲抛物线
        transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background-color rgb(0,160,220)
          // X轴线性
          transition all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 12px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  // 蒙版
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40
    backdrop-filter blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
