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
                  <n-button type="primary" @click="addGroup">新建</n-button>
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
    title="群组信息"
  >
    <editGroup
      :status="method"
      :fId="rowdata.fId"
      @onClose="updateGroup"
    ></editGroup>
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
  fOwner: string
  fMembers: Object
}

export default {
  methods: {},
  setup() {
    const api = createApi(getCurrentInstance())
    const columsName = [
      {
        title: '名称',
        key: 'fName',
        width: '20%',
      },
      {
        title: '所属',
        key: 'fOwner',
        width: '20%',
      },
      {
        title: '范围',
        key: 'fMembers',
        width: '60%',
      },
    ]

    const data = ref([])
    const checkedRowKeysRef = ref<DataTableRowKey[]>([])

    const showModal = ref(false)
    var param = []
    param.push({ eq: { 'fType': 5 } })
    const loadData = (param) => {
      api.groupList(param).then(function (res) {
        if (res.status == 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            temp['key'] = i
            var fMembersStr = ''
            for (var j = 0; j < temp.fMembers.length; j++) {
              fMembersStr += temp.fMembers[j].fElement.fName
              if (j < temp.fMembers.length - 1) {
                fMembersStr += ';'
              }
            }
            temp['fMembers'] = fMembersStr
            temp['fOwner'] = temp.fOwner ? temp.fOwner.fName : ''
            data.value.push(temp)
          }
        }
      })
    }
    loadData({ query: param })

    const method = ref()
    const rowdata = ref()
    const { columns } = useTableDate({
      showModal,
      method,
      rowdata,
      data,
      columsName,
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

    function addGroup() {
      showModal.value = true
      method.value = 'edit'
      rowdata.value = {}
    }

    function updateGroup(updated) {
      showModal.value = false
      data.value = []
      var param = []
      param.push({ eq: { 'fType': 5 } })
      loadData({ query: param })
    }

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
      addGroup,
      updateGroup,
    }
  },
}
</script>

<style></style>
