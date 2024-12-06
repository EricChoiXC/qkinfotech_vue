<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header> </n-layout-header>
      <n-layout>
        <n-layout>
          <n-layout-header>
            <n-layout>
              <n-layout-header>
                <n-flex justify="end">
                  <!-- <n-button type="primary" @click="add">新建</n-button> -->
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
    title="角色管理"
  >
    <orgRoleAuthorityEdit
      :fId="rowdata.fId"
      @onClose="update"
      :method="method"
    ></orgRoleAuthorityEdit>
  </n-modal>
</template>

<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import {
  NTag,
  NButton,
  useMessage,
  NRadio,
  NDropdown,
  NDatePicker,
  NInput,
  NButtonGroup,
  NRadioGroup,
  NModal,
  DataTableColumns,
  DataTableRowKey,
} from 'naive-ui'
import createApi from './api'
import { useTableDate } from '@/apps/common/actionButton.js'

type RowData = {
  key: number
  fName: string
  fAuths: string
}

export default {
  methods: {},
  setup() {
    const api = createApi(getCurrentInstance())
    const columsName = [
      {
        title: '名称',
        key: 'fName',
      },
      {
        title: '权限',
        key: 'fAuths',
      },
    ]

    const data = ref([])
    const checkedRowKeysRef = ref<DataTableRowKey[]>([])

    const showModal = ref(false)
    const loadData = (param) => {
      api.roleList(param).then(function (res) {
        if (res.status == 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            temp['key'] = i
            var fAuthsStr = ''
            for (var j = 0; j < temp.fAuthorities.length; j++) {
              fAuthsStr += temp.fAuthorities[j].fName
              if (j < temp.fAuthorities.length - 1) {
                fAuthsStr += ';'
              }
            }
            temp['fAuths'] = fAuthsStr
            data.value.push(temp)
          }
        }
      })
    }
    loadData({ query: [] })
    const deleteCall = (row) => {
      api.roleDelete({ fId: [row.fId] })
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

    const paginationReactive = reactive({
      page: 1,
      pageSize: 5,
      showSizePicker: true,
      pageSizes: [3, 5, 7],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      },
    })

    return {
      columns,
      checkedRowKeys: checkedRowKeysRef,
      rowKey: (row: RowData) => row.key,
      handleCheck(rowKeys: DataTableRowKey[]) {
        checkedRowKeysRef.value = rowKeys
      },
      data,
      showModal,
      page: paginationReactive,
      rowdata,
      method,
      add() {
        showModal.value = true
        method.value = 'add'
        rowdata.value = {}
      },
      update(updated) {
        showModal.value = false
        data.value = []
        loadData({ query: [] })
      },
    }
  },
}
</script>

<style></style>
