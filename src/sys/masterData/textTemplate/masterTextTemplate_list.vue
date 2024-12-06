<template>
  <n-card>
    <n-layout>
      <n-layout-content>
        <div style="margin-top: 30px; margin-left: 15px">
          <XCritera
            name="list"
            :filters="filters"
            :textSearch="true"
            placeholder="请输入模板名称"
            @change="(value) => handleFilterChange(value)"
          ></XCritera>
        </div>
        <n-divider />
        <n-space justify="end" style="width: 100%">
          <n-button @click="onCloseImportModal">刷新</n-button>
          <n-button type="primary" @click="add">新增</n-button>
          <n-button type="primary" @click="batchDelete">批量删除</n-button>
          <commonImport
            module="master/text/template"
            class="com.qkinfotech.core.tendering.master.model.MasterTextTemplate"
            @closeImportModalFunc="onCloseImportModal"
          ></commonImport>
          <commonExport module="master/text/template"></commonExport>
        </n-space>
        <div style="text-align: center; width: 100%; margin: auto">
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="page"
            :row-key="(row) => row.fId"
            @update:checked-row-keys="handleCheck"
          >
          </n-data-table>
        </div>
      </n-layout-content>
    </n-layout>
  </n-card>
</template>

<script setup>
import { h, defineComponent, reactive } from 'vue'
import { NButton, useMessage, useDialog } from 'naive-ui'
import createApi from './api'
import commonImport from '@/apps/common/transport/import.vue'
import commonExport from '@/apps/common/transport/export.vue'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const dialog = useDialog()
const api = createApi(getCurrentInstance())
const message = useMessage()
const menuStore = useMenuStore()

const page = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [5, 10, 15],
  onChange: (newPage) => {
    page.page = newPage // 直接更新 page 对象内的 page 属性
  },
  onUpdatePageSize: (newPageSize) => {
    page.pageSize = newPageSize // 更新 pageSize
    page.page = 1 // 重置 page 到第一页
  },
})
const checkedRowKeysRef = ref([])
const data = reactive([])
const columns = reactive([
  {
    type: 'selection',
    width: 50,
  },
  {
    title: '名称',
    key: 'fName',
  },
  {
    title: '操作',
    key: 'actions',
    width: 500,
    render(row) {
      return [
        h(
          NButton,
          {
            onClick: () => {
              layout.open({
                label: '查看文本模板',
                key: 'masterTextTemplateView',
                component:
                  '/sys/masterData/textTemplate/masterTextTemplate_view.vue',
                urlParams: {
                  fId: row.fId,
                },
              })
            },
          },
          '查看',
        ),
        h(
          NButton,
          {
            onClick: () => {
              layout.open({
                label: '编辑文本模板',
                key: 'masterTextTemplateEdit',
                component:
                  '/sys/masterData/textTemplate/masterTextTemplate_edit.vue',
                urlParams: {
                  fId: row.fId,
                },
              })
            },
          },
          '编辑',
        ),
        h(
          NButton,
          {
            onClick: () => {
              dialog.warning({
                content: "是否删除该数据？",
                negativeText: "取消",
                positiveText: "确认",
                onPositiveClick: async function() {
                  await api.delete({ fId: row.fId })
                  init()
                }
              })
            },
          },
          '删除',
        ),
      ]
    },
  },
])

function init() {
  data.length = 0
  api.list().then(function (res) {
    if (res.status == 200) {
      for (var i = 0; i < res.data.list.length; i++) {
        data.push(res.data.list[i])
      }
    }
  })
}

function onCloseImportModal() {
  init()
}

function add() {
  layout.open({
    label: '新建文本模板',
    key: 'masterTextTemplateEdit',
    component: '/sys/masterData/textTemplate/masterTextTemplate_edit.vue',
    urlParams: {},
  })
}

/**
 * 批量删除
 */
function batchDelete() {
  dialog.warning({
    title: '警告',
    content: '是否批量删除？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await api.delete({ fId: checkedRowKeysRef.value })
        init()
      } catch (error) {
        message.error('有关联，无法删除！')
      }
    },
  })
}

function handleCheck(rowKeys) {
  // 更新选中行的 keys
  checkedRowKeysRef.value = rowKeys
}

init()
</script>

<style></style>
