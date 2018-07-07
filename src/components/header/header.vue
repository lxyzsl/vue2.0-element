<template>
  <div class="header" v-if="seller.supports">
      <!-- 内容区 -->
      <div class="content-wrapper">
        <!-- 左边头像区 -->
        <div class="avatar">
          <img :src="seller.avatar" alt="" width="64" height="64">
        </div>
        <!-- 右侧内容区 -->
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <!-- 描述 -->
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div  class="support">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
        </div>
      </div>
      <!-- 公告相关 -->
      <div class="bulletin-wrapper" @click="showDetail">
        <!-- 公告图标，公告内容 -->
        <span class="bulletin-title"></span><span class="bullentin-text">{{seller.bulletin}}</span>
        <span class="right">></span>
      </div>
      <!-- header背景图 -->
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%">
      </div>
      <!-- 详情弹出浮层 -->
      <transition name="fade" mode="">
        <div v-show="detailShow" class="detail">
          <!-- 内容包装层，用来清除浮动 -->
          <div class="detail-wrapper clearfix">
            <!-- 真正的内容层 -->
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <!-- 优惠内容 -->
              <ul class="supports">
                <li class="support-item" v-for="(item,key) in seller.supports" :key="key">
                  <span class="icon" :class="classMap[seller.supports[key].type]"></span>
                  <span class="text">{{seller.supports[key].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="detail-close" @click="detailOff">
            <span>X</span>
          </div>
        </div>
      </transition>
  </div>
</template>

<script >
import star from '../star/star'
export default{
  props: ['seller'],
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  data () {
    return {
      detailShow: false
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    detailOff () {
      this.detailShow = false
    }
  },
  components: {
    star
  }
}
</script>
<style lang="stylus">
  @import "../../common/stylus/mixin.styl";
  @import "../../common/stylus/base.styl";
  .header
    position relative
    overflow hidden
    color #ffffff
    background rgba(7,17,27,0.5)
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      // font-size :0是去除图像与文字的空隙
      font-size 0
      .avatar
        display  inline-block
        vertical-align top
        font-size 14px
        img
          border-radius 2px
      .content
        display  inline-block
        font-size 14px
        margin-left 16px
        .title
          margin 2px 0 8px 0
          .brand
          // 将行内元素的span变成块元素以便宽高生效
            display inline-block
            //顶部对齐
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          margin-bottom 10px
          line-height 12px
          font-style 12px
        .support
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 4px
            background-size 12px 12px
            background-repeat no-repeat
            //bg-image('文件名')
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            vertical-align top
            line-height 10px
            font-size 10px
      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, 0.2)
        text-align center
        .count
          font-size 10px
        .icon-keyboard_arrow_right
          font-size 10px
    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      // 下面三行用来处理文字不换行，当超出是用。。。代替
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background rgba(7,17,27,0.2)
      // 图标
      .bulletin-title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bullentin-text
        margin 0 4px
        font-size 10px
        font-weight 200
        vertical-align top
      .right
        position absolute
        font-size 10px
        right 12px
        top 1px
    //背景图
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      // 虚化
      filter blur(10px)
    // 详情弹出层
    .detail
      position fixed
      z-index 100
      top 0
      left 0
      width 100%
      height 100%
      overflow auto
      // 浮层最终效果
      background rgba(7,17,27,0.8)
      // 动画时长
      transition all 0.5s
      // 苹果手机背景模糊
      backdrop-filter blur(10px)
      // 动画进入后的效果
      &.fade-enter-active
        opacity 1
        background rgba(7,17,27,0.8)
      // 动画进入前的效果 重要且要放在fade-enter-active后面
      &.fade-enter
        opacity 0
      // 动画离开后的效果
      &.fade-leave-active
        opacity 0
        background rgba(7,17,27,0)
      // 外层容器的高度需要更具内容高度变更,所以最小高度为100%可以使内容不够时，按钮依旧定位在底部
      .detail-wrapper
        // 宽度100%使得子元素可以居中
        width 100%
        min-height 100%
        .detail-main
          margin-top 64px
          // 内容底部内边距，防止X按钮与内容重合
          padding-bottom 64px
          .name
            line-height 16px
            text-align center
            font-size 16px
            font-weight 700
          .star-wrapper
            margin-top 18px
            padding 2px 0
            text-align center
          .title
            display flex
            width 80%
            margin 28px auto 24px auto
            .line
              flex 1
              position relative
              top -6px
              border-bottom 1px solid rgba(255,255,255,0.2)
            .text
              padding 0 12px
              font-weight 700
              font-size 14px
          .supports
            width 80%
            margin 0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
            .icon
              display inline-block
              width 16px
              height 16px
              vertical-align top
              margin-right 6px
              background-size 12px
              background-repeat no-repeat
              &.decrease
                bg-image('decrease_2')
              &.discount
                bg-image('discount_2')
              &.guarantee
                bg-image('guarantee_2')
              &.invoice
                bg-image('invoice_2')
              &.special
                bg-image('special_2')
            .text
              vertical-align top
              line-height 14px
              font-size 12px
          // 商家介绍
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              font-size 12px
              line-height 24px
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        // 清除浮动
        clear both
        font-size 32px
</style>
