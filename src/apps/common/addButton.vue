<template>
  <n-button type="primary" @click="handleClick()">
    <template #icon>
      <n-icon>
        <add-icon></add-icon>
      </n-icon>
    </template>
    {{ buttonText }}
  </n-button>
</template>


<script lang="ts">
  import { CashOutline as CashIcon } from '@vicons/ionicons5'
  import { AddCircleOutline as AddIcon } from '@vicons/ionicons5'

  export default {
    components: {
      CashIcon,
      AddIcon,
    },
    props: {
      buttonText: {
        type: String,
        default: '新建' // 默认按钮文本为“新建”
      }
    },
    methods: {
      handleClick() {
        this.$emit('click'); // 触发自定义事件 click
      }
    }
  };
</script>

<style>
</style>
