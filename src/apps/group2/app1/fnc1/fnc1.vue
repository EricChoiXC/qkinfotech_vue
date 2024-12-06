<script setup>

</script>

<template>
  <div>
    <n-carousel :space-between="30" :loop="false" slides-per-view="auto" centered-slides draggable>
      <n-carousel-item style="width: 30%">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg">
      </n-carousel-item>
      <n-carousel-item style="width: 20%">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg">
      </n-carousel-item>
      <n-carousel-item style="width: 30%">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg">
      </n-carousel-item>
      <n-carousel-item style="width: 40%">
        <img class="carousel-img" src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg">
      </n-carousel-item>
    </n-carousel>
  </div>
</template>
<style lang="scss" scoped></style>
