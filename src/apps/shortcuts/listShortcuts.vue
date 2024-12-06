<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header>
        <n-space style="align-items: center; margin: 20px">
          <span>快捷方式：</span>
          <n-input
            placeholder="请输入快捷方式名称"
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
                    <n-button type="primary" @click="addShortcuts"
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
    <AddShortcuts :fId="rowdata.fId" @onClose="shortcutsUpdate"></AddShortcuts>
  </n-modal>
</template>

<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import { DataTableRowKey } from 'naive-ui'
import { useTableDate } from '@/apps/common/actionButton.js'
import storage from '@/utils/storage'
import AddShortcuts from '@/apps/shortcuts/addShortcuts.vue'
import createApi from './api'
import context from '@/context.js'


type RowData = {
  fId: string
  fName: string
  fType: number
  fUrl: string
  fIconUrl: string
  fUsedList: []
  fOrder: number
  fCreateTime: BigInteger
}

export default {
  components: { AddShortcuts },
  methods: {},
  setup() {
    const api = createApi(getCurrentInstance())
    const columsName = [
      {
        title: '名称',
        key: 'fName',
      },
      {
        title: '快捷方式跳转地址',
        key: 'fUrl',
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
        title: '快捷方式图标显示url',
        key: 'fIconUrl',
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

    //名稱搜索
    const filtersName = ref('')
    const filterListByName = async () => {
      const filterNameList = await api.list({
        query: { contains: { fName: filtersName.value } },
      })
      data.value = filterNameList.data.data.list
    }

    return {
      filtersName,
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
      filterListByName,
      addShortcuts() {
        showModal.value = true
        method.value = 'add'
        rowdata.value = {}
      },
      shortcutsUpdate() {
        showModal.value = false
        data.value = []
        var param = {
          query: [],
          userId: context.user(),
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
