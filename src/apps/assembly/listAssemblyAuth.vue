<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header>
        <n-space style="align-items: center; margin: 20px">
          <span>组件名称：</span>
          <n-input
            placeholder="请输入组件名称"
            style="width: 300px"
            v-model:value="filtersName"
            @input="filterListByName"
          />
        </n-space>
      </n-layout-header>
      <n-layout>
        <n-layout>
          <n-layout-header>
            <n-layout>
              <n-layout-header>
                <n-flex justify="end">
                  <div style="padding-right: 10px">
                    <n-button type="primary" @click="addAssembly"
                      >新建</n-button
                    >
                  </div>
                </n-flex>
              </n-layout-header>
            </n-layout>
          </n-layout-header>
          <n-layout-content>
            <div style="text-align: center; width: 100%; margin: auto">
              <n-data-table
                :columns="columns"
                :data="data"
                :pagination="page"
                :row-key="rowKey"
                @update:checked-row-keys="handleCheck"
              >
              </n-data-table>
            </div>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-space>
  <n-modal
    v-model:show="showModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="快捷方式"
  >
    <AddAssembly :fId="rowdata.fId" @onClose="assemblyUpdate"></AddAssembly>
  </n-modal>
</template>

<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import { DataTableRowKey } from 'naive-ui'
import { useTableDate } from '@/apps/common/actionButton.js'
import storage from '@/utils/storage'
import AddAssembly from '@/apps/assembly/addAssemblyAuth.vue'
import createApi from './api'

type RowData = {
  fId: string
  fName: string
  fComponentKey: string
  fAssemblyComponentDataKey: string
  fUsedList: []
  fOrder: number
  fCreator: {}
  fCreateTime: BigInteger
}

export default {
  components: { AddAssembly },
  methods: {},
  setup() {
    const api = createApi(getCurrentInstance())
    const columsName = [
      {
        title: '组件名称',
        key: 'fName',
      },
      {
        title: '组件类型',
        key: 'fAssemblyKey',
      },
      {
        title: '组件数据类型',
        key: 'fAssemblyComponentDataKey',
      },
      {
        title: '可使用者',
        key: 'fUsedList',
        render(row) {
          const users = []
          if (row.fUsedList.length > 0) {
            for (let i = 0; i < row.fUsedList.length; i++) {
              // console.log(row.fUsedList[i].fUsed.fName);
              users.push(row.fUsedList[i].fUsed.fName)
            }
          }
          return users.join(',')
        },
      },
      {
        title: '创建时间',
        key: 'fCreateTime',
      },
      {
        title: '顺序',
        key: 'fOrder',
      },
    ]

    const data = ref([])
    const checkedRowKeysRef = ref<DataTableRowKey[]>([])

    const showModal = ref(false)
    var param = {
      query: [],
      sort: ['fOrder asc'],
    }
    api.list(param).then(function (res) {
      if (res.status == 200) {
        data.value = res.data.list
      }
    })
    const deleteCall = (e) => {
      const param = {
        fId: [],
      }
      param.fId.push(e.fId)
      api.delete(param).then(function (res) {
        console.log('删除成功!!!')
      })
    }
    const method = ref()
    const rowdata = ref()
    const { columns } = useTableDate({
      showModal,
      method,
      rowdata,
      data,
      columsName,
      deleteCall,
    })
    console.log(columns)

    const paginationReactive = reactive({
      page: 1,
      pageSize: 15,
      showSizePicker: true,
      pageSizes: [15, 30, 50],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      },
    })
    //组件名称过滤
    const filtersName = ref('')
    const filterListByName = async () => {
      const filterNameList = await api.list({
        query: { contains: { fName: filtersName.value } },
      })
      data.value = filterNameList.data.list
    }

    return {
      filtersName,
      filterListByName,
      columns,
      checkedRowKeys: checkedRowKeysRef,
      rowKey: (row: RowData) => row.fId,
      handleCheck(rowKeys: DataTableRowKey[]) {
        checkedRowKeysRef.value = rowKeys
      },
      data,
      showModal,
      page: paginationReactive,
      rowdata,
      method,
      addAssembly() {
        showModal.value = true
        method.value = 'add'
        rowdata.value = {}
      },
      assemblyUpdate() {
        showModal.value = false
        data.value = []
        var param = {
          query: [],
          sort: ['fOrder asc'],
        }
        api.list(param).then(function (res) {
          if (res.status == 200) {
            data.value = res.data.list
          }
        })
      },
    }
  },
}
</script>

<style></style>
