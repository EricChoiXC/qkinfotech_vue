<template>
  <transition name="fade">
    <label v-if="visible" :class="['tip-label', type]">{{ message }}</label>
  </transition>
</template>

<script>
export default {
  name: 'TipLabel',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info'  // 默认类型为 'info'，可选值包括 'success', 'warning', 'error'
    },
    visible: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.tip-label {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 3px;
  font-size: 14px;
}
.tip-label.info {
  background-color: #d9edf7;
  color: #31708f;
}
.tip-label.success {
  background-color: #dff0d8;
  color: #3c763d;
}
.tip-label.warning {
  background-color: #fcf8e3;
  color: #8a6d3b;
}
.tip-label.error {
  background-color: #f2dede;
  color: #a94442;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

