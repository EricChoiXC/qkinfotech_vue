<template>

  <n-card :title="props.formValue.name" class="card">
    <template #header-extra>
      <n-button @click="infoView()">详情</n-button>
    </template>
    <n-space vertical>
      <n-text strong>
        业主名称:{{props.formValue.owner}}
      </n-text>
    </n-space>
    <n-space vertical>
      <n-text strong>
        项目地点：{{props.formValue.place}}
      </n-text>
    </n-space>
  </n-card>

  <n-modal style="width:60%;" v-model:show="show" preset="dialog" title="项目详情" :mask-closable="false">
    <itemEdit :formValue="props.formValue" @closeModal="closeModal"  :isDisabled="props.isDisabled" :designers="props.designers"/>
  </n-modal>

</template>

<script setup>
  import {
    AddCircleOutline as addIcon
  } from '@vicons/ionicons5';
  import {
    TrashOutline as TrashIcon
  } from '@vicons/ionicons5'
  import attachment from '@/apps/common/attachment/attachment.vue'
  import itemEdit from '@/apps/supplier/item/item_edit.vue'

  const props = defineProps({
    formValue: Object,
    isDisabled : Boolean,
    designers: Array,
  })

  const show = ref(false);
  const infoView = () => {
    show.value = true;
  }
  const closeModal = () => {
    show.value = false;
  }
</script>

<style>
  .card {
    height: 150px;
  }
</style>
