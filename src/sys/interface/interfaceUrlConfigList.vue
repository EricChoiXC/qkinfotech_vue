<template>
  <n-layout>
    <n-layout-content>
      <div style="margin-top: 30px; margin-left: 15px">
        <span>接口名称：</span>
        <n-input
          v-model:value="searchText"
          placeholder="请输入接口名称"
          @input="methods.getInterfaceList"
          style="width: 420px"
        />
      </div>
      <n-divider />
      <n-space justify="end" style="width: 100%">
        <n-button type="primary" @click="methods.add()">新增</n-button>
        <n-button type="primary" @click="methods.batchDelete()"
          >批量删除</n-button
        >
      </n-space>
      <div
        style="
          text-align: center;
          width: 100%;
          margin: auto;
          margin-bottom: 20px;
        "
      >
        <n-data-table
          :columns="columns"
          :data="data"
          :pagination="pagination"
          :bordered="false"
          :row-key="(row) => row.fId"
          @update:checked-row-keys="handleCheck"
        />
      </div>
    </n-layout-content>
  </n-layout>

  <n-modal
    v-model:show="showModal"
    preset="card"
    style="width: 1000px; height: 80%"
  >
    <interfaceUrlConfigAdd @closeModal="methods.closeModal" />
  </n-modal>

  <n-modal
    v-model:show="viewModal"
    preset="card"
    style="width: 1000px; height: 80%"
  >
    <interfaceUrlConfigView
      @closeModal="methods.closeModal"
      :viewData="viewData"
    />
  </n-modal>

  <n-modal
    v-model:show="editModal"
    preset="card"
    style="width: 1000px; height: 80%"
  >
    <interfaceUrlConfigEdit
      @closeModal="methods.closeModal"
      :viewData="viewData"
    />
  </n-modal>
</template>

<script setup>
import createApi from './api'
import { onMounted, reactive, render } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { useMenuStore } from '@/store/menu.js'
import interfaceUrlConfigAdd from './interfaceUrlConfigAdd.vue'
import interfaceUrlConfigEdit from './interfaceUrlConfigEdit.vue'
import interfaceUrlConfigView from './interfaceUrlConfigView.vue'
const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())
const columns = [
  {
    type: 'selection',
  },
  {
    title: '序号',
    key: 'index',
    render(row, index) {
      return index + 1
    },
    width: 5,
  },
  {
    title: '所属系统',
    key: 'fInterfaceSystem',
    align: 'center',
    width: 100,
  },
  {
    title: '接口key',
    key: 'fInterfaceKey',
    align: 'center',
    width: 100,
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
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            onClick: () => {
              methods.view(row)
            },
          },
          '查看',
        ),
        h(
          NButton,
          {
            onClick: () => {
              methods.edit(row)
            },
          },
          '编辑',
        ),
      ]
    },
  },
]
const message = useMessage()
const dialog = useDialog()
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
let viewData = ref({})
/**模态窗控制 */
const showModal = ref(false) //新增
const viewModal = ref(false) //查看
const editModal = ref(false) //编辑
const selectedItem = ref({})
/**搜索框 接口名称 */
const searchText = ref('')
const checkedRowKeys = ref([])
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys
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
      const res = await api.urlConfigList({
        query: orQuery,
      })
      data.length = 0
      data.push(...res.data.list)
    } else {
      const res = await api.urlConfigList()
      data.length = 0
      data.push(...res.data.list)
    }
  },
  add: async () => {
    showModal.value = true
  },
  view: async (row) => {
    await api
      .urlConfigLoad({
        fId: row.fId,
      })
      .then((result) => {
        viewData = result.data
        viewModal.value = true
      })
  },
  edit: async (row) => {
    await api
      .urlConfigLoad({
        fId: row.fId,
      })
      .then((result) => {
        viewData = result.data
        editModal.value = true
      })
  },
  batchDelete: async () => {
    const ids = checkedRowKeys.value
    if (ids.length == 0) {
      message.error('请选择一项进行删除！')
      return
    }
    try {
      dialog.warning({
        title: '删除',
        content: '是否确认删除？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          await api
            .urlConfigDelete({ fId: ids })
            // axios
            //   .post(`/pm/interface/url/config/delete?fId=${ids}`)
            .then((res) => {
              message.success('删除成功!')
              methods.getInterfaceList()
            })
        },
      })
    } catch (error) {
      message.error('删除失败!' + error)
    } finally {
      methods.getInterfaceList()
    }
  },
  closeModal: async () => {
    showModal.value = false
    viewModal.value = false
    editModal.value = false
    methods.getInterfaceList()
  },
}
onMounted(() => {
  methods.getInterfaceList()
})
</script>

<style scoped lang="scss"></style>
