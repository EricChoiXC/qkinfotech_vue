<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-content>
        <div style="margin-top: 30px; margin-left: 15px">
          <XCritera
            name="list"
            :filters="filters"
            :textSearch="true"
            placeholder="请输入项目类别名称"
            @change="(value) => handleFilterChange(value)"
          ></XCritera>
        </div>

        <n-divider />
        <n-space justify="end" style="width: 100%">
          <n-button @click="onCloseImportModal">刷新</n-button>
          <n-button type="primary" @click="add">新增</n-button>
          <n-button type="primary" @click="batchDelete">批量删除</n-button>
          <commonImport
            module="masterdata/importance"
            class="com.qkinfotech.core.tendering.model.masterModels.MasterDataImportance"
            @closeImportModalFunc="onCloseImportModal"
          ></commonImport>
          <commonExport module="masterdata/importance"></commonExport>
        </n-space>
        <div style="text-align: center; width: 100%; margin: auto">
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="page"
            :row-key="(row) => row.fId"
            @update:checked-row-keys="actions.handleCheck"
          >
          </n-data-table>
        </div>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script setup>
import { h, defineComponent, reactive } from 'vue'
import { NButton, useMessage, useDialog } from 'naive-ui'
import projectNodes from '@/apps/project/project_nodes.vue'
import XCritera from '@/apps/common/filter/x-criteria.vue'
import XDate from '@/apps/common/filter/x-date.vue'
import XFilterItem from '@/apps/common/filter/x-filter-item.vue'
import XSelector from '@/apps/common/filter/x-selector.vue'
import commonImport from '@/apps/common/transport/import.vue'
import commonExport from '@/apps/common/transport/export.vue'
import createApi from './api'
import { inject } from 'vue'

import moment from 'moment'

import { useTableDate } from '@/sys/js/button.js'
import { InformationCircleOutline as InfoIcon } from '@vicons/ionicons5'
import { list } from 'postcss'
import layout from '@/layout/layout'

const dialog = useDialog()
const api = createApi(getCurrentInstance())

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

const message = useMessage()
const data = ref([])

const filters = ref([
  {
    type: XDate,
    visible: true,
    props: {
      field: 'time',
      label: '登记日期',
      value: null,
    },
  },
  {
    type: XSelector,
    visible: true,
    props: {
      field: 'fType',
      label: '项目类型',
      value: null,
      options: [
        {
          label: '16 方案征集',
          value: 1,
        },
      ],
    },
  },
])

const checkedRowKeys = checkedRowKeysRef

const columns = ref([
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
                label: '查看项目重要性',
                key: 'masterDataImportanceview',
                component: '/sys/masterData/importance/view.vue',
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
              // const url = `/opdesk/sys/master/masterDataImportanceedit?fId=${encodeURIComponent(row.fId)}`;
              // window.open(url);
              layout.open({
                label: '编辑项目类别',
                key: 'masterDataImportanceedit',
                component: '/sys/masterData/importance/edit.vue',
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
            onClick: async () => {
              dialog.warning({
                title: '警告',
                content: '是否删除？',
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: async () => {
                  try {
                    await api.delete({ fId: [row.fId] }).then((result) => {
                      actions.list()
                      message.success('删除成功！')
                    })
                  } catch (error) {
                    message.error('有关联，无法删除！')
                  }
                },
              })
            },
          },
          '删除',
        ),
      ]
    }, // 使用公共函数
  },
])
const reload = inject('reload')

//导入刷新操作
const onCloseImportModal = () => {
  actions.list()
}

const actions = {
  list: async (url, filter) => {
    await api
      .list()
      .then((result) => {
        const dataList = result.data.list
        data.value = []
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          }
          data.value.push(obj)
        }
      })
      .catch((err) => {})
  },
  viewItem: async (row) => {},

  handleCheck(rowKeys) {
    // 更新选中行的 keys
    checkedRowKeysRef.value = rowKeys
  },
}

const handleFilterChange = (value) => {
  //筛选操作

  let ftSearchValue = value[0].ftsearch
  var query = []
  value.forEach(function (item, index) {
    if (item.ftsearch === '' && value.length === 1) {
      actions.list()
    } else if (item.ftsearch !== '') {
      const contains = {
        contains: {
          fName: item.ftsearch,
        },
      }
      query.push({
        contains: {
          fName: ftSearchValue,
        },
      })
      api
        .list({
          query: query,
        })
        .then((result) => {
          const dataList = result.data.list
          data.value = []
          for (let i = 0; i < dataList.length; i++) {
            const obj = {
              fName: dataList[i].fName,
              fId: dataList[i].fId,
            }
            data.value.push(obj)
          }
        })
    }
  })
}

const add = () => {
  layout.open({
    label: '新增项目重要性',
    key: 'masterDataImportanceAdd',
    component: '/sys/masterData/importance/add.vue',
  })
}

const batchDelete = async () => {
  const ids = checkedRowKeysRef.value
  if (ids.length == 0) {
    message.error('未选择选项')
    return
  }
  try {
    await api.delete({ fId: ids }).then((res) => {
      message.success('删除成功')
      actions.list()
    })
  } catch (error) {
    message.error('有关联，无法删除！')
  }
}

// 监听message事件
const handleMessage = (event) => {
  handleChildWindowClose(event)
}
// 定义处理子窗口关闭的函数
const handleChildWindowClose = (event) => {
  if (event.data.action === 'importWindowClose') {
    // 这里调用你的刷新列表的方法
    actions.list()
  }
}

onMounted(() => {
  actions.list()
  window.addEventListener('message', handleMessage)
})
</script>

<style></style>
