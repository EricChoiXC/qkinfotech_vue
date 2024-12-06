<script setup>
const percent = ref(0)
setTimeout(() => {
  percent.value = 66
}, 500)
</script>

<template>
  <div>
    <n-grid
      x-gap="16"
      :cols="4"
    >
      <n-gi>
        <n-card
          title="访问量"
          :segmented="{
            content: true,
            footer: true
          }"
        >
          <span class="text-1">
            <n-number-animation
              ref="numberAnimationInstRef"
              :from="0"
              :to="1024"
              :duration="5000"
              :show-separator="true"
            />
          </span>
          <div class="visit-percent">
            你是第&nbsp;&nbsp;&nbsp;&nbsp;位访问者
          </div>
          <template #footer>
            纯属虚构,如有雷同，纯属巧合。
          </template>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          title="进度"
          :segmented="{
            content: true,
            footer: true
          }"
        >
          <span class="text-1"> 当前进度</span>

          <n-progress
            type="line"
            :percentage="percent"
            :indicator-placement="'inside'"
            processing
          />
          <template #footer>
            实际进度 6%
          </template>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          title="倒计时"
          :segmented="{
            content: true,
            footer: true
          }"
        >
          <span
            class="text-1"
            style="font-variant-numeric: tabular-nums; white-space: nowrap"
          >
            <n-countdown
              :duration="996 * 10000"
              :active="true"
            />
          </span>
          <template #footer>
            <span style="text-decoration: line-through; margin-right: 8px;">倒计时</span>DeadLine
          </template>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card
          title="把他当个块用"
          :segmented="{
            content: true,
            footer: true
          }"
        >
          <n-skeleton
            text
            style="margin: 5px;height: 25%;"
            :repeat="2"
          />
          <n-skeleton
            text
            style="margin: 5px;width: 60%;height: 25%;"
          />
          <template #footer>
            不知道放什么了
          </template>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<style lang='scss' scoped>
:deep(.n-card) {
  height: 200px;
  .n-card-header,
  .n-card__footer {
    height: 50px !important;
    display: flex;
    align-items: center;
  }
  .n-card__footer {
    color: #999;
  }
  .n-card__content {
    padding: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .text-1 {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .visit-percent {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
