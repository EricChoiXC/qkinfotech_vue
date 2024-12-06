<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <!-- 侧边结构树 -->
      <n-layout-sider content-style="padding: 24px;">
        <n-tree
          block-line
          selectable
          :data="orgTree"
          :default-expanded-keys="defaultExpandedKeys"
          key-field="treeKey"
          label-field="treeLabel"
          :on-load="loadChildOrgNodes"
          :node-props="clickTreeNode"
        >
        </n-tree>
      </n-layout-sider>
      <n-layout-header>
        <n-layout>
          <n-layout-header>
            <n-layout has-sider>
              <n-layout-sider>
                <n-select
                  :options="orgTypes"
                  @update:value="handleSelect"
                  :value="selectedOrgType"
                ></n-select>
              </n-layout-sider>
              <n-layout-header>
                <n-flex justify="end">
                  <!-- <n-dropdown
                    trigger="hover"
                    :options="addButtons"
                    @select="addElement"
                  >
                    <n-button type="primary">新建</n-button>
                  </n-dropdown> -->
<!--                  <n-button type="primary" @click="exportPersons()"
                    >导出</n-button
                  >-->
                </n-flex>
              </n-layout-header>
            </n-layout>
          </n-layout-header>
          <n-layout-content>
            <!-- 组织架构列表 -->
            <n-data-table
              :columns="columns"
              :data="data"
              :pagination="page"
              :row-key="rowKey"
              @update:checked-row-keys="handleCheck"
            >
            </n-data-table>
          </n-layout-content>
        </n-layout>
      </n-layout-header>
    </n-layout>
  </n-space>
  <n-modal
    v-model:show="addPersonModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="员工信息"
  >
    <addPerson @onClose="updateDataTable"></addPerson>
  </n-modal>
  <n-modal
    v-model:show="addCompanyModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="公司信息"
  >
    <addCompany @onClose="updateDataTable"></addCompany>
  </n-modal>
  <n-modal
    v-model:show="addDeptModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="部门信息"
  >
    <addDept @onClose="updateDataTable"></addDept>
  </n-modal>
</template>

<script lang="ts">
import { ref, defineComponent, h, reactive, getCurrentInstance } from 'vue'
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
  TreeOption,
  TreeOverrideNodeClickBehavior,
  SelectOption,
} from 'naive-ui'
import createApi from './api'
import { repeat } from 'seemly'

const api = createApi(getCurrentInstance())
/* 列表行数据类型 */
type RowData = {
  key: number
  fName: string
  fCode: string
  fTel: string
  fCreateTime: BigInteger
}

/* 列表列 */
const columns = [
  {
    title: '名称',
    key: 'fName',
  },
  {
    title: '编号',
    key: 'fCode',
  },
  {
    title: '创建时间',
    key: 'fCreateTime',
  },
  {
    title: '座机',
    key: 'fTel',
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NButtonGroup, {}, [
        h(NButton, { onClick: () => editRow(row) }, { default: () => '编辑' }),
        /* h(NButton, {onClick : () => updateRow(row), disabled : row.disabled}, { default : () =>'更新' }), */
        /* h(NButton, {onClick : () => editRowOpen(row)}, { default : () =>'更新（打开页面）' }), */
        h(
          NButton,
          { onClick: () => deleteRow(row) },
          { default: () => '删除' },
        ),
      ])
    },
  },
]

/* 列表 */
const createColumns = ({
  editRow,
  deleteRow,
}: {
  editRow: (row: RowData) => void
  deleteRow: (row: RowData) => void
}): DataTableColumns<RowData> => [
  {
    type: 'selection',
  },
  {
    title: '名称',
    key: 'fName',
  },
  {
    title: '编号',
    key: 'fCode',
  },
  {
    title: '创建时间',
    key: 'fCreateTime',
  },
  {
    title: '座机',
    key: 'fTel',
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NButtonGroup, {}, [
        /*h(NButton, { onClick: () => editRow(row) }, { default: () => '编辑' }),*/
        /* h(NButton, {onClick : () => updateRow(row), disabled : row.disabled}, { default : () =>'更新' }), */
        /* h(NButton, {onClick : () => editRowOpen(row)}, { default : () =>'更新（打开页面）' }), */
       /* h(
          NButton,
          { onClick: () => deleteRow(row) },
          { default: () => '删除' },
        ),*/
      ])
    },
  },
]

/* 列表数据 */
const data = ref([])

function deleteRow(row) {
  alert('delete:' + row.hdId)
}

function updateRow(row) {
  alert('update:' + row.hdId)
}

/* 选中框 */
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
/* 创建树数据 */
/* 树 */
const orgTree = ref([])
async function getChildElementNodes(key): Promise<TreeOption[]> {
  var query = []
  var nodes = []
  if (key == '') {
    query.push({ null: 'fParent' })
  } else {
    query.push({ eq: { 'fParent.fId': key } })
  }
  query.push({ eq: { 'fValid': true } })
  await axiosPost('companyList', { query: [{ and: query }] }).then((value) => {
    for (var i = 0; i < value.length; i++) {
      nodes.push({
        treeLabel: value[i].treeLabel,
        treeKey: value[i].treeKey,
        isLeaf: false,
      })
    }
  })
  query = []
  if (key == '') {
    query.push({
      and: [
        { null: 'fParent' },
        { null: 'fCompany' },
        { eq: { 'fValid': true } },
      ],
    })
  } else {
    query.push({
      and: [
        { eq: { 'fValid': true } },
        {
          or: [{ eq: { 'fParent.fId': key } }, { eq: { 'fCompany.fId': key } }],
        },
      ],
    })
  }
  await axiosPost('deptList', { query: query }).then((value) => {
    for (var i = 0; i < value.length; i++) {
      nodes.push({
        treeLabel: value[i].treeLabel,
        treeKey: value[i].treeKey,
        isLeaf: false,
      })
    }
  })
  return nodes
}

async function axiosPost(url, param) {
  var res = await api[url](param)
  var nodes = res.data.list
  return repeat(nodes.length, undefined).map((_, index) => {
    return {
      treeLabel: nodes[index].fName,
      treeKey: nodes[index].fId,
      isLeaf: false,
    }
  })
}

/* 列表展示的组织架构类型 */
const selectedOrgType = ref(1)
/* 点选的树节点fId */
const selectedTreeId = ref('')
/* 更新列表 */
function updateDataTable() {
  var query = []
  if (selectedTreeId.value != '') {
    query.push({ eq: { 'fParent.fId': selectedTreeId.value } })
  } else {
    query.push({ null: 'fParent' })
  }
  var url = 'elementList'
  if (selectedOrgType.value == 1) url = 'companyList'
  if (selectedOrgType.value == 2) {
    query = []
    if (selectedTreeId.value != '') {
      query.push({
        or: [
          { eq: { 'fParent.fId': selectedTreeId.value } },
          { eq: { 'fCompany.fId': selectedTreeId.value } },
        ],
      })
    } else {
      query.push({
        and: [{ null: 'fParent' }, { null: 'fCompany' }],
      })
    }
    url = 'deptList'
  }
  if (selectedOrgType.value == 80) url = 'personList'
  api[url]({ query: query }).then(function (res) {
    if (res.status == 200) {
      data.value = data.value.slice(0, 0)
      for (var i = 0; i < res.data.list.length; i++) {
        var temp = res.data.list[i]
        data.value.push({
          key: i,
          fName: temp.fName,
          fCode: temp.fCode,
          fGender: temp.fGender,
          fMobile: temp.fMobile,
          fTel: temp.fTel,
          fEmail: temp.fEmail,
          fCreateTime: temp.fCreateTime,
          disabled: true,
        })
      }
    }
  })
}

/* 新建按钮组 */
const addButtons = [
  {
    key: 1,
    label: '公司',
  },
  {
    key: 2,
    label: '部门',
  },
  {
    key: 80,
    label: '人员',
  },
]

export default {
  methods: {
    exportPersons() {
      if (checkedRowKeysRef.value.length == 0) {
        alert('请选择要导出的数据！')
        return
      }
      var res = []
      //标题行
      var titleLine = ''
      var keys = []
      var titles = columns
      for (var i = 0; i < titles.length; i++) {
        if (titles[i].key.indexOf('f') == 0) {
          titleLine += titles[i].title + ';'
          keys.push(titles[i].key)
        }
      }
      //res.push(titleLine);
      //数据行
      for (var val in checkedRowKeysRef.value) {
        var line = data.value[checkedRowKeysRef.value[val]]
        var temp = {}
        for (var key in line) {
          temp[key] = line[key]
        }
        res.push(temp)
      }
      api.elementExport({ columns: res })
    },
  },
  setup() {
    const addPersonModal = ref(false)
    const addCompanyModal = ref(false)
    const addDeptModal = ref(false)
    const rowData = ref([])
    /* 列表数据 */
    api
      .companyList({
        query: { eq: { 'fValid': true } },
      })
      .then(function (res) {
        if (res.status == 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            data.value.push({
              key: i,
              fName: temp.fName,
              fCode: temp.fCode,
              fGender: temp.fGender,
              fMobile: temp.fMobile,
              fTel: temp.fTel,
              fEmail: temp.fEmail,
              fCreateTime: temp.fCreateTime,
              disabled: true,
            })
          }
        }
      })

    /* 初始化树 */
    orgTree.value.length = 0
    orgTree.value.push({
      isLeaf: false,
      treeKey: '',
      treeLabel: '组织架构',
    })

    /* 分页 */
    const paginationReactive = reactive({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageSizes: [7, 10, 15],
      onChange: (page) => {
        paginationReactive.page = page
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize
        paginationReactive.page = 1
      },
    })

    const clickTreeNode: TreeOverrideNodeClickBehavior = ({ option }) => {
      if (option.children) {
        return 'toggleExpand'
      }
      return 'default'
    }

    return {
      columns: createColumns({
        editRow(row: RowData) {
          // showModal.value = true
        },
        deleteRow(row: RowData) {},
      }),
      checkedRowKeys: checkedRowKeysRef,
      rowKey: (row: RowData) => row.key,
      handleCheck(rowKeys: DataTableRowKey[]) {
        checkedRowKeysRef.value = rowKeys
      },
      data,
      rowData,
      deleteRow,
      updateRow,
      orgTypes: [
        {
          value: 1,
          label: '公司',
          url: 'companyList',
        },
        {
          value: 2,
          label: '部门',
          url: 'deptList',
        },
        {
          value: 80,
          label: '员工',
          url: 'personList',
        },
      ],
      addPersonModal,
      addDeptModal,
      addCompanyModal,
      page: paginationReactive,
      orgTree,
      defaultExpandedKeys: ref([]),
      selectedOrgType,
      selectedTreeId,
      addButtons,
      handleSelect(value: number, option: SelectOption) {
        selectedOrgType.value = value
        updateDataTable()
        return
      },
      clickTreeNode: ({ option }: { option: TreeOption }) => {
        return {
          onClick() {
            selectedTreeId.value = option.treeKey
            updateDataTable()
          },
        }
      },
      loadChildOrgNodes: (node: TreeOption) => {
        return new Promise<void>((resolve) => {
          getChildElementNodes(node.treeKey).then((res) => {
            node.children = res
            resolve()
          })
        })
      },
      addElement(key) {
        rowData.value.push('fParentId', selectedTreeId.value)
        if (key == 1) addCompanyModal.value = true
        if (key == 2) addDeptModal.value = true
        if (key == 80) addPersonModal.value = true
      },
    }
  },
}
</script>

<style></style>
