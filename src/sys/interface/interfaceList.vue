<template>
  <n-space style="margin: 20px">
    <span>接口名称：</span>
    <n-input
      v-model:value="searchText"
      placeholder="请输入接口名称"
      @input="methods.getInterfaceList"
      style="width: 420px"
    />
    <span style="margin-left: 40px">接口地址：</span>
    <n-input
      v-model:value="searchUrl"
      placeholder="请输入接口地址"
      @input="methods.getInterfaceList"
      style="width: 420px"
    />
    <span style="margin-left: 40px">项目编号：</span>
    <n-input
      v-model:value="searchNo"
      placeholder="请输入项目编号"
      @input="methods.getInterfaceList"
      style="width: 420px"
    />
  </n-space>
  <n-space style="margin: 20px">
    <span>时间筛选：</span>
    <n-date-picker
      v-model:value="range"
      type="datetimerange"
      clearable
      @update:value="timeChange"
      style="width: 420px"
    />
  </n-space>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="false"
  />
  <n-modal
    v-model:show="showModal"
    preset="card"
    style="width: 1000px; height: 80%"
  >
    <template #header>
      <span class="modal-title">接口详情</span>
    </template>
    <template #default>
      <n-form :disabled="true">
        <n-form-item label="接口名称" path="selectedItem.fInterfaceName">
          <n-input v-model:value="selectedItem.fInterfaceName" />
        </n-form-item>

        <n-form-item label="接口地址" path="selectedItem.fInterfaceUrl">
          <n-input v-model:value="selectedItem.fInterfaceUrl" />
        </n-form-item>

        <n-form-item label="调用时间" path="selectedItem.fCreateTime">
          <n-input v-model:value="selectedItem.fCreateTime" />
        </n-form-item>

        <n-form-item label="入参" path="selectedItem.fInputParameter">
          <n-input
            v-model:value="selectedItem.fInputParameter"
            type="textarea"
          />
        </n-form-item>

        <n-form-item label="错误信息" path="selectedItem.fErrorInfo">
          <n-input v-model:value="selectedItem.fErrorInfo" type="textarea" />
        </n-form-item>
      </n-form>
    </template>
  </n-modal>
</template>

<script setup>
import createApi from './api'
import { onMounted, reactive, render } from 'vue'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const api = createApi(getCurrentInstance())
const columns = [
  {
    title: '序号',
    key: 'index',
    render(row, index) {
      return index + 1
    },
    width: 5,
  },
  {
    title: '接口名称',
    key: 'fInterfaceName',
    align: 'center',
    width: 100,
  },
  {
    title: '接口地址',
    key: 'fInterfaceUrl',
    align: 'center',
    width: 300,
  },
  {
    title: '项目编号',
    key: 'fProtocolNo',
    align: 'center',
    width: 300,
  },
  {
    title: '调用时间',
    key: 'fCreateTime',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center',
    render(row) {
    return [h(
      NButton, {
      onClick: () => {
        layout.open({
          label: "接口信息查询",
          key: "interfaceInfoView",
          component: '/sys/interface/interfaceView.vue',
          urlParams: {
            fId: row.fId
          }
        });
      }
    }, '查看',

    )]
  }

  },
]

/**分页*/
const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  onChange: (newPage) => {
    pagination.page = newPage // 直接更新 page 对象内的 page 属性
    methods.getInterfaceList()
  },
  onUpdatePageSize: (newPageSize) => {
    pagination.pageSize = newPageSize // 更新 pageSize
    pagination.page = 1 // 重置 page 到第一页
    methods.getInterfaceList()
  },
})

/**data */
const data = reactive([])

/**模态窗控制 */
const showModal = ref(false)

const selectedItem = ref({})

/**搜索框 接口名称 */
const searchText = ref('')
/**搜索框 接口地址 */
const searchUrl = ref('')
/**搜索框 项目编号 */
const searchNo = ref('')

/**时间筛选  */
const range = ref([1717558469000, Date.now()])

/**模态窗口打开控制 */
const handleActionClick = (row) => {
  selectedItem.value = row // 将选中的行数据赋值给 selectedItem
  showModal.value = true // 打开模态框
}

const timeChange = (value) => {
  range.value = value
  methods.getInterfaceList()
}

const methods = {
  getInterfaceList: async () => {
    /**搜索框query */
    var orQuery = []
    if (searchText.value != '') {
      orQuery.push({
        contains: {
          fInterfaceName: searchText.value,
        },
      })
    }
    if (searchUrl.value != '') {
      orQuery.push({
        contains: {
          fInterfaceUrl: searchUrl.value,
        },
      })
    }
    if (searchNo.value != '') {
      orQuery.push({
        contains: {
          fProtocolNo: searchNo.value,
        },
      })
    }

    if (range.value !== null) {
      var query = [{ and: orQuery }]
      /**时间query */
      var timeQuery = {
        and: [
          { gteq: { fCreateTime: range.value[0] } },
          { lteq: { fCreateTime: range.value[1] } },
        ],
      }
      query.push(timeQuery)
    }
    if (orQuery.length == 0) {
      data.length = 0
      const res = await api.logList({
        query: timeQuery,
      })
      data.push(...res.data.list)
    } else {
      data.length = 0
      const res = await api.logList({ query })
      data.push(...res.data.list)
    }
  },
}
onMounted(() => {
  methods.getInterfaceList()
})
</script>

<style scoped lang="scss"></style>
