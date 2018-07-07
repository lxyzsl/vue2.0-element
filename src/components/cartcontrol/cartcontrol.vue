<template>
  <!-- 按钮组件 -->
  <div class="cartcontrol">
    <!-- vue2.0需要在外面包一层transition -->
    <transition name="move" mode="">
      <!-- 防止冒泡 -->
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <!-- 由于字体要动画，所以放到内层 -->
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count " v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  // 从父组件获取的商品数据
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart (event) {
      // 如果时原生事件，则屏蔽避免PC端产生两次点击效果
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        // 当我们给一个比如props中，或者data中被观测的对象添加一个新的属性的时候，
        // 不能直接添加，必须使用Vue.set方法
        // Vue.set方法用来新增对象的属性。如果要增加属性的对象是响应式的，
        // 那该方法可以确保属性被创建后也是响应式的，同时触发视图更新
        // food原本时没有count属性的，所以要通过Vue.set方法添加
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 将点击的事件目标dom传递给父组件
      // 父组件有v-on:cart-add监听接收
      this.$emit('cart-add', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      this.food.count--
    }
  }
}
</script>

<style lang="stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      // 增加可点击区域
      padding 6px
      opacity: 1
      transform: translate3d(0, 0, 0)
      // translate3D可以开启硬件加速，使得动画更流畅
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all 0.4s linear
        transform: rotate(0)
      // vue动画过渡属性
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      // vue动画过渡属性
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
