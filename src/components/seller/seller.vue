<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.serviceScore"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <span class="content">{{seller.bulletin}}</span>
        </div>
        <ul class="supports">
          <li class="support-item border-1px" v-for="(item,key) in seller.supports" :key="key">
            <span class="icon" :class="classMap[seller.supports[key].type]"></span>
            <span class="text">{{seller.supports[key].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <!-- 为了要图片横向排列滚动，所以要定义pic-wrapper固定视口 -->
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,key) in seller.pics" :key="key">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="infos">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="(info,key) in seller.infos" :key="key">
            <span class="text">{{info}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 引入星星组件
import star from '../star/star'
// 引入split组件
import split from '../split/split'
// 引入滚动条
import Bscroll from 'better-scroll'
// 引入本地存储方法
import {saveToLocal, loadFromLocal} from '../../common/js/store.js'

export default {
  props: ['seller'],
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  data () {
    return {
      // favorite: false
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  beforeMount () {
    this.$nextTick(() => {
      if (!this.scroll) {
        // Bscroll绑定ratings的DOM
        this.scroll = new Bscroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
      this.__initPics()
    })
  },
  // 监听seller数据，当seller变动时执行初始化滚动条方法
  watch: {
    seller () {
      this.$nextTick(() => {
        this.__initPics()
      })
    }
  },
  methods: {
    __initPics () {
      // 当有seller数据是才进入以下流程，防止包undefined错误
      if (this.seller) {
        if (!this.picScroll) {
          // 图片横向滚动条
          let picWith = 120
          let margin = 6
          let width = (picWith + margin) * this.seller.pics.length - margin
          // 告知宽度
          this.$refs.picList.style.width = width + 'px'
          this.$nextTick(() => {
            this.picScroll = new Bscroll(this.$refs.picWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            })
          })
        } else {
          this.picScroll.refresh()
        }
      }
    },
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  components: {
    star,
    split
  }
}
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/icon.styl";
  .seller
    position absolute
    top 174px
    left 0
    width 100%
    overflow hidden
    bottom 0
    .overview
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      .desc
        padding-bottom 18px
        font-size 0
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          display inline-block
          margin-right 12px
          line-height 18px
          font-size 10px
          color rbg(77,85,93)
      .remark
        display flex
        padding 18px 0 0 0
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          // 最后一个不要边框
          &:last-child
            border none
          h2
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
            margin-bottom 4px
          .content
            line-height 24px
            color rgb(7,17,27)
            font-weight 200
            font-size 10px
            .stress
              font-size 24px
      .favorite
        position absolute
        right 5px
        top 18px
        // 限制宽度，防止点击后爱心位置偏移
        width 50px
        text-align center
        .icon-favorite
          display block
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color red
        .text
          line-height 10px
          font-size 10px
          color rbg(77,85,93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height 24px
          font-size 12px
          font-weight 200
          color rgb(240,20,20)
      .supports
        .support-item
          padding 16px 12px
          font-size 0
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
        .icon
          display inline-block
          vertical-align top
          width 16px
          height 16px
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          //bg-image('文件名')
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height 16px
          font-weight 200
          font-size 12px
          color rgb(7,17,27)
    .pics
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      // 固定视口
      .pic-wrapper
        width 100%
        overflow hidden
        // 当图片超过屏幕宽度，不折行
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            // 变成行类元素使其不折行
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin 0
    .infos
      padding 18px 18px 0 18px
      .title
        padding-bottom 12px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        line-height 16px
        padding 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size 12px
        color rgb(7,17,27)
        &:last-child
          border-none()
</style>
