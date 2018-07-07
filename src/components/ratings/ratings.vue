<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star class="star" :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <!-- 评价按钮组件 -->
      <ratingselect :selectType='selectType' @ratingtype-select='ratingtypeSelect'
      :onlyContent='onlyContent' @content-toggle='contentToggle' :ratings="ratings"></ratingselect>
      <!-- 评价列表 -->
      <div class="rating-wrapper">
        <!-- 当有评价内容数据才显示 -->
        <ul v-show="ratings && ratings.length > 0">
          <!-- rating.rateType表示评价类型 -->
          <!-- rating.text表示评价是否有内容 -->
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,key) in ratings" :key="key" class="rating-item border-1px">
            <!-- 用户名和头像 -->
            <div class="avatar">
              <img  width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size=24 :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟到达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend  && rating.recommend.length">
                <span :class="{'icon-thumb_up':rating.rateType === 0,
                  'icon-thumb_down':rating.rateType === 1}"></span>
                <span class="item" v-for="(item,keys) in rating.recommend" :key="keys">{{item}}</span>
              </div>
               <!-- 时间 -->
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
        <!-- 暂无评价 -->
        <div class="no-rating" v-show="!ratings || !ratings.length">
          暂无评价
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as type from '../../assets/type.js'
// 引入星星组件
import star from '../star/star'
// 引入滚动条
import Bscroll from 'better-scroll'
// 引入购物车组件
import shopcart from '../shopcart/shopcart'
// 引入按钮组件
import cartcontrol from '../cartcontrol/cartcontrol'
// 引入split组件
import split from '../split/split'
// 引入评价组件ratingselect
import ratingselect from '../ratingselect/ratingselect'
// 引入date.js的formatDate函数
import {formatDate} from '../../common/js/date'

export default {
  props: ['seller'],
  data () {
    return {
      selectType: type.ALL,
      onlyContent: true,
      ratings: []
    }
  },
  created () {
    this.axios.get('/api/ratings').then((response) => {
      if (response.data.errno === type.ERR_OK) {
        this.ratings = response.data.data
        this.$nextTick(() => {
          if (!this.scroll) {
            // Bscroll绑定ratings的DOM
            this.scroll = new Bscroll(this.$refs.ratings, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    })
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
    star,
    shopcart,
    cartcontrol,
    split,
    ratingselect
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl"
  .ratings
    // 保持视口固定
    position absolute
    // 因为header组件高度是174px
    top 174px
    bottom 0
    width 100%
    left 0
    overflow hidden
    .overview
      display flex
      padding 18px 0
      .overview-left
        flex 0 0 137px
        width 137px
        border-right 1px solid rgba(7,17,27,0.1)
        text-align center
        padding 6px 0
        // 当屏幕宽度小于375px是改变flex自适应宽度
        @media  screen and (max-width 375px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          line-height 28px
          font-size 24px
          color rgb(255,153,0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7,17,27)
        .rank
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
      .overview-right
        flex 1
        padding 6px 0 6px 24px
        // 当屏幕宽度小于375px是改变右区块的左内边距
        @media  screen and (max-width 375px)
          padding-left 6px
        .score-wrapper
          margin-bottom 8px
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .star
            display inline-block
            vertical-align top
            margin 0 12px
          .score
            line-height 18px
            display inline-block
            vertical-align top
            color rgb(255,153,0)
            font-size 12px
        .delivery-wrapper
          font-size 0
          .title
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .deliveryTime
            margin-left 12px
            line-height 18px
            font-size 12px
            color rgb(147,153,159)
    .rating-wrapper
      padding 0 18px
      .rating-item
        padding 18px 0
        display flex
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius: 50%
        .content
          flex 1
          position relative
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7,17,27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              line-height 12px
              font-weight 200
              font-size 10px
              color rgb(147,153,159)
          .text
            margin-bottom: 8px
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
          .recommend
            line-height: 16px
            font-size 0
            .icon-thumb_up, .item, .icon-thumb_down
              display: inline-block
              margin: 0 8px 4px 0
              font-size 9px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
