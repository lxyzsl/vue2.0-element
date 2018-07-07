<template>
  <!-- starType是通过父组件传入的size计算属性后得到的图片尺寸，再由css动态加载 -->
  <div class="star" :class="starType">
    <!-- 如何吧class动态的设置为on ，half，off -->
    <!-- 需要计算属性itemClasses，使得itemClasses变成数组，例如['on','on','on','half','off'] -->
    <!-- 循环itemClasses得到itemClass，然后通过：class绑定就可得到 class=“on|half|off”-->
    <!-- 通过css读取class的内容来加载图片-->
    <span v-for="(itemClass,key) in itemClasses" :key="key" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
import * as type from '../../assets/type.js'
export default {
  props: [
    'size',
    'score'
  ],
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let score = Math.floor(this.score * 2) / 2
      // 是否有小数
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      // 循环向result数组里扔整星
      for (let i = 0; i < integer; i++) {
        result.push(type.CLS_ON)
      }
      if (hasDecimal) {
        result.push(type.CLS_HALF)
      }
      while (result.length < type.LEGTH) {
        result.push(type.CLS_OFF)
      }
      return result
    }
  }
}
</script>

<style lang="stylus">
 @import "../../common/stylus/mixin.styl";
    .star
      font-size 0
      .star-item
        display inline-block
        background-repeat no-repeat
      &.star-48
        .star-item
          width 20px
          height 20px
          margin-right 22px
          background-size 20px 20px
          &:last-child
              margin-right 0
          &.on
            bg-image('star48_on')
          &.half
            bg-image('star48_half')
          &.off
            bg-image('star48_off')
      &.star-36
        .star-item
          width 15px
          height 15px
          margin-right 16px
          background-size 15px 15px
          // 当屏幕宽度小于320像素时缩小星星的间隔
          @media  screen and (max-width 320px)
            margin-right 6px
          &:last-child
              margin-right 0
          &.on
              bg-image('star36_on')
          &.half
              bg-image('star36_half')
          &.off
              bg-image('star36_off')
      &.star-24
        .star-item
          width 10px
          height 10px
          margin-right 3px
          background-size 10px 10px
          &:last-child
              margin-right 0
          &.on
              bg-image('star24_on')
          &.half
              bg-image('star24_half')
          &.off
              bg-image('star24_off')
</style>
