<template>
  <div>
    <n-card :segmented="{ content: true }" :bordered="false" size="small">
      <template #header>
        <n-space justify="space-between">
          <n-ellipsis>菜单授权管理</n-ellipsis>
          <n-space>
            <n-button @click="loadSysMenu">刷新</n-button>
            <n-button type="primary" @click="openSysMenuEdit">新建</n-button>
          </n-space>
        </n-space>
      </template>
      <div style="width: 100%">
        <n-data-table :data="data" :columns="columns"> </n-data-table>
      </div>
    </n-card>
  </div>
</template>
<script setup>
import { ref, unref, reactive, onMounted, computed } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import createApi from './api'
import baseUrl from '@/utils/baseUrl'

const api = createApi(getCurrentInstance())
const dialog = useDialog()
const message = useMessage()

const menuTypeMap = {
  pageJson: 'pageJson',
  menuJson: 'menuJson',
  'top-menu': '顶部导航栏',
  'aside-menu': '左侧导航栏',
}

//已有菜单导航
const data = ref([])
//数据表列
const columns = [
  {
    title: '名称',
    key: 'fMenuName',
  },
  {
    title: '菜单类型',
    key: 'fMenuType',
    render(row) {
      return menuTypeMap[row.fMenuType]
    },
  },
  {
    title: '操作',
    key: 'option',
    render(row) {
      return h(NSpace, {}, [
        h(
          NButton,
          {
            onClick: function () {
              window.open(baseUrl.pmUrl + '/view/sys/menu/edit?fId=' + row.fId)
            },
          },
          '编辑',
        ),
        h(
          NButton,
          {
            type: 'error',
            onClick: function () {
              dialog.warning({
                title: '确认删除',
                content: '是否确认删除？',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: async function () {
                  await api.menuDelete({ fId: row.fId })
                  loadSysMenu()
                },
              })
            },
          },
          '删除',
        ),
      ])
    },
  },
]

//加载导航数据
function loadSysMenu() {
  api.menuList().then(function (res) {
    if (res.status == 200) {
      data.value.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        data.value.push(res.data.list[i])
      }
    }
  })
}

function openSysMenuEdit() {
  window.open(baseUrl.pmUrl + '/view/sys/menu/edit')
}

onMounted(() => {
  loadSysMenu()
})
</script>
