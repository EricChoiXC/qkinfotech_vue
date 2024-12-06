<template>
  <n-card :title="props.formValue.name ? props.formValue.name : '未命名'" class="card">
    <template #header-extra>
      <n-button @click="infoView()">详情</n-button>
    </template>
    <n-space vertical>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-text strong>
            曾获国内或国际设计奖项:{{props.formValue.winning.length}}个
          </n-text>
        </template>
        <div v-for=" win in props.formValue.winning">
          {{win.fName}}
        </div>
      </n-tooltip>
    </n-space>
    <n-space vertical>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-text strong>
            主创同类设计业绩：{{props.formValue.creators.length}}个
          </n-text>
        </template>
        <div v-for=" creator in props.formValue.creators">
          {{creator.name}}
        </div>
      </n-tooltip>

    </n-space>
  </n-card>

  <n-modal style="width:60%;" v-model:show="show" preset="dialog" title="设计师详情" :mask-closable="false">
    <designer :formValue="props.formValue" @closeModal="closeModal" :isDisabled="props.isDisabled"
      :fIsUnion="props.fIsUnion" :infoValue="props.infoValue" />
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
  import designer from '@/apps/supplier/designer/designer_edit.vue'

  const props = defineProps({
    formValue: Object,
    isDisabled: Boolean,
    fIsUnion: String,
    infoValue: Array
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
