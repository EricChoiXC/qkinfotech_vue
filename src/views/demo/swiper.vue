<script setup>
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
const currentIndex = ref(0)
const transition = ref('all 0.5s')
const list = ref([
  { id: 5, img: 'https://img2.baidu.com/it/u=611352150,950032526&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500' },
  { id: 1, img: 'https://img2.baidu.com/it/u=3395582942,4228440123&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
  { id: 2, img: 'https://img2.baidu.com/it/u=4084621093,2971972319&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500' },
  { id: 3, img: 'https://img2.baidu.com/it/u=611352150,950032526&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500' },
  { id: 0, img: 'https://img2.baidu.com/it/u=3395582942,4228440123&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' },
])
let WIDTH = 0
onMounted(() => {
  WIDTH = document.querySelector('.m-swiper-container').offsetWidth
  currentIndex.value++
})

function pre () {
  currentIndex.value--
  if (currentIndex.value === 0) {
    setTimeout(() => {
      transition.value = 'none'
      currentIndex.value = 3
    }, 500)
  } else {
    transition.value = 'all .5s'
  }
}

function next () {
  currentIndex.value++
  if (currentIndex.value === 4) {
    setTimeout(() => {
      transition.value = 'none'
      currentIndex.value = 1
    }, 500)
  } else {
    transition.value = 'all .5s'
  }
}
const translateX = computed(() => -(currentIndex.value * WIDTH) + 'px')
</script>

<template>
  <div class="m-swiper">
    <div class="m-swiper-container">
      <!-- swiper主体 -->
      <ul>
        <li
          v-for="item in list"
          :key="item.id"
        >
          <img
            :src="item.img"
            alt=""
          >
        </li>
      </ul>
      <!-- 切换器 -->
      <li
        class="m-swiper-change m-swiper-pre"
        @click="pre"
      >
        <n-icon
          :component="ChevronBackOutline"
          size="20"
        />
      </li>
      <li
        class="m-swiper-change m-swiper-next"
        @click="next"
      >
        <n-icon
          :component="ChevronForwardOutline"
          size="20"
        />
      </li>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.m-swiper {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  .m-swiper-container {
    width: 600px;
    height: 300px;
    background-color: #c0c0c0;
    position: relative;
    > ul {
      height: 100%;
      width: 100%;
      overflow: hidden;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: nowrap;
      > li {
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: v-bind(transition);
        transform: translateX(v-bind(translateX));
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .m-swiper-change {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      background-color: rgba(161, 160, 160, 0.5);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #fff;
    }
    .m-swiper-pre {
      left: 8px;
    }
    .m-swiper-next {
      right: 8px;
    }
  }
}
</style>
