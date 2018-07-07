<template>
  <div class="ratingselect">
    <!-- 三种按钮类型 -->
    <div class="rating-type border-1px">
      <!-- 当selectType为2时，active属性被启用 -->
      <span @click="select(2, $event)" class="block positive"
       :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0, $event)" class="block positive"
      :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1, $event)" class="block negative"
       :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <!-- 内容类型，可切换 -->
    <div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
import * as type from '../../assets/type.js'

export default {
  props: {
    // 评价内容，默认返回空数组
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    // 选择查看的评价类型
    selectType: {
      type: Number,
      default: type.ALL
    },
    // 是否读内容，默认不读
    onlyContent: {
      type: Boolean,
      default: false
    },
    // 三个按钮的内容显示。默认以下三个
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) {
        return
      }
      // this.selectType = type
      this.$emit('ratingtype-select', type)
    },
    toggleContent (event) {
      if (!event._constructed) {
        return
      }
      this.$emit('content-toggle', this.onlyContent)
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === type.POSITIVE
      })
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === type.NEGATIVE
      })
    }
  }
}
</script>

<style lang="stylus">
  @import "../../common/stylus/icon.styl";
  @import "../../common/stylus/mixin.styl";
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        &.active
          color #ffffff
        .count
          font-size 8px
          line-height 26px
          margin-left 2px
        &.positive
          background rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        font-size 12px
</style>
