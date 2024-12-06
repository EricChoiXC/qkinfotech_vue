<script setup>

</script>

<template>
  <div class="">

    <!--  顶部  -->
    <div class="px-4 h-[60px] bg-[#41709f] flex justify-between items-center text-base">

      <div class="logo text-2xl font-bold">
        <a href="https://www.shabidding.com/shgjzb/" target="_blank">
          <!-- <n-image width="70px" src="/src/assets/logo.png" preview-disabled ref="https://www.shabidding.com" /> -->
          <img src="@/assets/logo.jpg" alt="logo" />
        </a>
      </div>


    </div>

  </div>
</template>

<style scoped>
  :deep(.n-menu .n-menu-item-content .n-menu-item-content-header) {
    color: #000
  }

  :deep(.n-menu .n-menu-item:hover) {
    background-color: rgb(65 112 159);
    color: #fff;
  }
</style>
