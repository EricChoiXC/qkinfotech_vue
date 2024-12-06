<template>
  <div style="text-align: center; width: 100%; margin: auto">
    <n-data-table
      :columns="columns"
      :data="data"
      :pagination="page"
      :row-key="rowKey"
    >
    </n-data-table>
  </div>
</template>

<script setup>
import { useMessage, useDialog } from 'naive-ui'
import createApi from './api'
import { useRoute, useRouter } from 'vue-router'

const api = createApi(getCurrentInstance())
const message = useMessage()
const dialog = useDialog()
const route = useRoute()
const id = route.query.fId

function handleCheck() {}

const columns = [
  {
    title: '项目编号',
    key: 'fProjectNo',
  },
  {
    title: '项目名称',
    key: 'fProjectName',
  },
  {
    title: '类型',
    key: 'fType',
  },
  {
    title: 'ISO编号',
    key: 'fNo',
  },
  {
    title: '部门',
    key: 'fCreator.fParent.fName',
  },
  {
    title: '填表人',
    key: 'fCreator.fName',
  },
  {
    title: '日期',
    key: 'fCreateTime',
  },
  {
    title: '属性',
    key: 'fStatus',
  },
  {
    title: '',
    key: 'options',
  },
]

const data = reactive([])

function list() {
  var query = {}
  api
    .isoApprovalList({
      query: query,
    })
    .then(function (res) {
      if (res.status == 200) {
        // data = res.data.list
      }
    })
}
list()

const page = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [8, 10, 15],
  onChange: (page) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
</script>

<style scoped></style>
