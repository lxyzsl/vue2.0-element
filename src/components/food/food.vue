<template>
  <!-- 通常是隐藏,当点击商品后改为显示 -->
  <transition name="move">
    <div class="food" v-show="showFlag"  ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back">
            <i class="icon-arrow_lift" @click="back"></i>
          </div>
        </div>
        <!-- 基本信息区域 -->
        <div class="content">
          <!-- 标题 -->
          <h1 class="title">{{food.name}}</h1>
          <!-- 描述 -->
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <!-- 价格 -->
          <div class="price">
            <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <!-- 购物车按钮组件 -->
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <!--  food.info存在时才显示 -->
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 评价按钮组件 -->
          <ratingselect :selectType='selectType' @ratingtype-select='ratingtypeSelect'
          :onlyContent='onlyContent' @content-toggle='contentToggle' :desc="desc" :ratings="food.ratings"></ratingselect>
          <!-- 评价列表 -->
          <div class="rating-wrapper">
            <!-- 当有评价内容数据才显示 -->
            <ul v-show="food.ratings && food.ratings.length > 0">
              <!-- rating.rateType表示评价类型 -->
              <!-- rating.text表示评价是否有内容 -->
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,key) in food.ratings" :key="key" class="rating-item border-1px">
                <!-- 用户名和头像 -->
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img  class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <!-- 时间 -->
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <!-- 评论 -->
                <p class="text">
                  <!-- 当rating.rateType为0时，给这个class绑定icon-thumb_up属性-->
                  <!-- 当rating.rateType为1时，给这个class绑定icon-thumb_down属性-->
                  <span :class="{'icon-thumb_up':rating.rateType === 0,
                  'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <!-- 暂无评价 -->
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
// 引入滚动条
import Bscroll from 'better-scroll'
// 引入按钮组件
import cartcontrol from '../cartcontrol/cartcontrol'
// 引入Vue
import Vue from 'vue'
// 引入split组件
import split from '../split/split'
// 引入评价组件ratingselect
import ratingselect from '../ratingselect/ratingselect'
import * as type from '../../assets/type.js'
// 引入date.js的formatDate函数
import {formatDate} from '../../common/js/date'

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFlag: false,
      selectType: type.ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    ratingtypeSelect (selecttype) {
      this.selectType = selecttype
    },
    contentToggle (onlycontent) {
      // 取反
      this.onlyContent = !onlycontent
    },
    show () {
      // 商品被点击后置为显示
      this.showFlag = true
      // 默认显示所有评价
      this.selectType = type.ALL
      // 只看有内容的评价
      this.onlyContent = true
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back () {
      this.showFlag = false
    },
    addFirst (event) {
      if (!event._constructed) {
        return
      }
      // 将点击的事件目标dom传递给父组件
      // 父组件里由food标签里的v-on:cart-add监听接收
      this.$emit('cart-add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    needShow (types, text) {
      // 如果用户想要看有内容的评价但实际上却没有时,返回flase
      if (this.onlyContent && !text) {
        return false
      }
      // 如果点击的是全部显示,直接返回true
      if (this.selectType === type.ALL) {
        return true
      } else {
        // 根据选择类型和是否有内容显示
        return this.selectType === types
      }
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
}
</script>

<style lang="stylus">
  @import "../../common/stylus/icon.styl";
  @import "../../common/stylus/mixin.styl";
  .food
    // 由于覆盖整个屏幕
    position fixed
    left 0
    top 0
    // 给底部留购物车高度
    bottom 48px
    // 浮层，但能高过购物车列表的z-index 50的浮层高度
    z-index 30
    width 100%
    background #ffffff
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
    &.move-enter, &.move-leave-active
      transform: translate3d(100%, 0, 0)
    .image-header
      position relative
      width 100%
      height 0
      // 当给padding设为100%时，那这个盒子的宽或者高可以按照已有的宽或高计算百分比
      // 这里宽度设置了100%，所以给padding-top设置了100%后使得image-header成为宽高相等的容器
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        // 撑到父容器宽高的100%
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          // 把icon变成块级元素并加上padding增加可点击区域
          display block
          padding 10px
          font-size 20px
          color #ffffff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
        margin-bottom 8px
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
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
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        // 用来盖住cartcontrol组件
        z-index 10
        height 24px
        line-height 24px
        padding 0 12px
        // 不希望padding和border把整个div撑大
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #ffffff
        background rgb(0,160,220)
        opacity: 1
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
          z-index: -1
    .info
      padding 18px
      .title
        line-height 17px
        margin-bottom 16px
        font-size 14px
        color rgb(7,17,27)
      .text
        padding 0 8px
        font-size 12px
        font-weight 200
        color rgb(77,85,93)
        line-height 24px
    .rating
      padding-top 18px
      .title
        line-height 17px
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
        // 评论列表
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              display inline-block
              margin-right 6px
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_up
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)
</style>
