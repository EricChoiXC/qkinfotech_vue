<template>
  <n-card>
    <n-data-table
      :columns="columns"
      :data="data"
      :row-props="rowProps"
      :pagination="pagination"
    >
    </n-data-table>
  </n-card>
  <n-modal
    v-model:show="showModal"
    style="width: 60%"
    preset="dialog"
    title="定时任务"
    :mask-closable="false"
  >
    <taskEdit
      :taskMainId="taskMainId"
      :taskEditDisabled="taskEditDisabled"
      @closeModal="closeModal"
    ></taskEdit>
  </n-modal>
</template>

<script setup>
import { reactive, h } from 'vue'
import createApi from './api'
import { useMessage } from 'naive-ui'
import taskEdit from './taskEdit.vue'

const api = createApi(getCurrentInstance())
const taskMainId = ref('')
const showModal = ref(false)
const taskEditDisabled = ref(false)
const columns = [
  {
    title: '任务名称',
    key: 'fName',
  },
  {
    title: '群组',
    key: 'fGroup',
  },
  {
    title: '任务Bean',
    key: 'fTaskBeanName',
  },
  {
    title: '下次启动时间',
    key: 'fScheduledTime',
  },
]
const message = useMessage()

const data = reactive([])

function list() {
  data.splice(0, data.length)
  var param = []
  param.push({ eq: { fStockTask: true } })
  api.list({ query: param }).then(function (result) {
    for (var i = 0; i < result.data.list.length; i++) {
      data.push(result.data.list[i])
      data[i].options = [
        h(
          NButton,
          {
            onClick: () => {
              message.info('禁用')
            },
          },
          '禁用',
        ),
      ]
    }
  })
}

list()

const rowProps = function (row) {
  return {
    onClick: function () {
      taskMainId.value = row.fId
      taskEditDisabled.value = true
      showModal.value = true
    },
  }
}

function closeModal() {
  showModal.value = false
  list()
}

const pagination = reactive({
  page: 1,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
})
</script>

<style></style>
