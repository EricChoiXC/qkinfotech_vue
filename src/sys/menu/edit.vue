<template>
  <div>
    <div style="text-align: right">
      <n-button type="primary" @click="methods.saveData()">保存</n-button>
    </div>
    <n-form
      label-placement="left"
      label-width="auto"
      style="clear: both"
      class="mt-2"
    >
      <n-grid :cols="2" :x-gap="24">
        <n-form-item-gi label="菜单名称">
          <n-input v-model:value="dataName" />
        </n-form-item-gi>
        <n-form-item-gi label="菜单类型">
          <n-space>
            <n-radio
              :checked="dataType === 'top-menu'"
              value="top-menu"
              name="dataType"
              @change="events.handleDataTypeChange"
            >
              顶部导航
            </n-radio>
            <n-radio
              :checked="dataType === 'aside-menu'"
              value="aside-menu"
              name="dataType"
              @change="events.handleDataTypeChange"
            >
              左侧导航
            </n-radio>
          </n-space>
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-grid
      class="mt-2"
      cols="1 s:1 m:1 l:3 xl:3 2xl:3"
      responsive="screen"
      :x-gap="12"
    >
      <n-gi span="1">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-dropdown
                trigger="hover"
                @select="events.handleAddMenu"
                :options="addMenuOptions"
              >
                <n-button type="info" ghost icon-placement="right">
                  添加菜单
                  <template #icon>
                    <div class="flex items-center">
                      <n-icon size="14">
                        <ChevronDown />
                      </n-icon>
                    </div>
                  </template>
                </n-button>
              </n-dropdown>
              <n-button
                type="info"
                ghost
                icon-placement="left"
                @click="events.handlePack"
              >
                全部{{ expandedKeys.length ? '收起' : '展开' }}
                <template #icon>
                  <div class="flex items-center">
                    <n-icon size="14">
                      <MenuOutline />
                    </n-icon>
                  </div>
                </template>
              </n-button>
            </n-space>
          </template>
          <div class="w-full menu">
            <n-input
              type="input"
              v-model:value="pattern"
              placeholder="输入菜单名称搜索"
            >
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <SearchOutline />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  :show-line="true"
                  cascade
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  :expandedKeys="expandedKeys"
                  style="height: 380px"
                  :selected-keys="selectTreeItem.treeItemKey"
                  @update:selected-keys="events.handleSelectTree"
                  @update:expanded-keys="events.handleExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <CreateOutline />
              </n-icon>
              <span>{{
                selectTreeItem.treeItemTitle + selectTreeItem.treeItemLabel
              }}</span>
            </n-space>
          </template>
          <n-alert type="info" closable>
            添加菜单或从菜单列表选择一项后，进行编辑</n-alert
          >
          <n-form
            :model="formParams"
            :rules="rules"
            ref="formRef"
            label-placement="left"
            :label-width="100"
            v-if="isEditMenu !== ''"
            class="py-4"
          >
            <n-form-item label="KEY" path="key">
              <n-input placeholder="请输入KEY" v-model:value="formParams.key" />
            </n-form-item>
            <n-form-item label="标题" path="label">
              <n-input
                placeholder="请输入标题"
                v-model:value="formParams.label"
              />
            </n-form-item>
            <n-form-item label="动作" path="action">
              <n-radio-group v-model:value="formParams.action" name="action">
                <n-space>
                  <n-radio
                    v-for="option in menuActionOptions"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.label }}</n-radio
                  >
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="显示状态" path="show">
              <n-radio-group v-model:value="formParams.show" name="show">
                <n-space>
                  <n-radio :value="true" :default-checked="true">显示</n-radio>
                  <n-radio :value="false">隐藏</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              label="跳转链接"
              path="url"
              v-if="formParams.action === 'url'"
            >
              <n-input
                v-model:value="formParams.url"
                placeholder="请输入跳转地址"
              ></n-input>
            </n-form-item>
            <n-form-item
              label="页面"
              path="page"
              v-if="formParams.action === 'page'"
            >
              <n-select
                v-model:value="formParams.page"
                :options="pageData"
                filterable
                value-field="value"
                label-field="label"
                @update:value="events.handlePageChange"
              />
            </n-form-item>
            <n-form-item
              label="模式"
              path="display"
              v-if="formParams.action === 'page'"
            >
              <n-radio-group v-model:value="formParams.display" name="display">
                <n-space>
                  <n-radio
                    v-for="option in pageDisplayModeOptions"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.label }}</n-radio
                  >
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item
              label="导航"
              path="aside"
              v-if="formParams.action === 'aside'"
            >
              <n-select
                v-model:value="formParams.aside"
                :options="menuData"
                value-field="value"
                label-field="label"
              />
            </n-form-item>

            <n-form-item label="菜单权限" path="auth">
              <formAddress
                :fElements="formParams.auth"
                status="edit"
                multi
                orgType="ORG_TYPE_ALL"
              ></formAddress>
            </n-form-item>
            <n-form-item style="margin-left: 100px">
              <n-space>
                <n-button
                  type="primary"
                  :loading="subLoading"
                  @click="events.handleSubmit"
                  >保存修改</n-button
                >
                <n-button @click="events.handleReset">重置</n-button>
                <n-button @click="events.handleDel">删除</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
import { ref, unref, reactive, onMounted, computed } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import { v4 as uuid } from 'uuid'
import {
  ChevronDown,
  MenuOutline,
  SearchOutline,
  InformationCircle,
  CreateOutline,
} from '@vicons/ionicons5'
import formAddress from '@/apps/common/address/formAddress.vue'
import pages from '@/router/pages.js'
import createApi from './api'
import { useRoute } from 'vue-router'

const api = createApi(getCurrentInstance())
// 页面打开方式
const actionMode = {
  aside: [
    { label: '显示子菜单', value: 'menu' },
    { label: '显示内容', value: 'page' },
    { label: '跳转', value: 'url' },
  ],
  menu: [
    { label: '显示子菜单', value: 'menu' },
    { label: '显示左侧导航', value: 'aside' },
    { label: '显示内容', value: 'page' },
    { label: '跳转', value: 'url' },
  ],
}

const pageDisplayModeOptions = [
  { label: '本页面', value: 'tab' },
  { label: '新窗口', value: 'window' },
  { label: '对话框', value: 'dialog' },
]

/** form表单验证规则 */
const rules = {
  key: { required: true, message: '请输入KEY', trigger: 'blur' },
  label: {
    required: true,
    message: '请输入标题',
    trigger: 'blur',
  },
  action: {
    required: true,
    message: '请选择打开方式',
    trigger: 'change',
  },
  url: { required: true, message: '请输入跳转地址', trigger: 'change' },
  page: { required: true, message: '请选择页面', trigger: 'change' },
  aside: { required: true, message: '请选择导航', trigger: 'change' },
  display: {
    required: true,
    message: '请选择页面的显示方式',
    trigger: 'change',
  },
}
const pageData = ref([]) // 页面数据 从 page.js 获取
const menuData = ref([]) // 导航菜单列表 从 ajax 获取
const formRef: any = ref([])
const message = useMessage()
const dialog = useDialog()
const route = useRoute()

const dataName = ref('')
const dataType = ref('top-menu')
const menuActionOptions = computed(() => {
  if (dataType.value == 'top-menu') {
    return actionMode.menu
  }
  if (dataType.value == 'aside-menu') {
    return actionMode.aside
  }
})
const menuId = ref(null)

const props = defineProps(['id'])
const fId = route.query.fId

const methods = {
  loadData: () => {
    if (fId) {
      api.menuLoad({ fId: fId }).then(function (res) {
        if (res.status == 200) {
          menuId.value = res.data.fId
          treeData.value = res.data.fMenuJson
          dataName.value = res.data.fMenuName
          dataType.value = res.data.fMenuType
        }
      })
    } else {
      menuId.value = uuid(32)
    }
  },
  /** 加载Page数据 */
  loadPage: () => {
    pageData.value = Object.keys(pages).map((v) => {
      return {
        label: pages[v].label + '(' + pages[v].path + ')',
        value: v,
        name: pages[v].label,
      }
    })
  },
  /** 加载菜单数据 */
  loadMenu: () => {
    //加载已有的左侧导航数据
    api
      .menuList({
        query: {
          eq: {
            fMenuType: 'aside-menu',
          },
        },
      })
      .then(function (res) {
        if (res.status == 200) {
          menuData.value.length = 0
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            menuData.value.push({
              label: temp.fMenuName,
              value: temp.fId,
            })
          }
        }
      })
  },
  /** 保存Menu数据 */
  saveData: () => {
    if (dataName.value == '') {
      message.error('请填写菜单名称！', {
        duration: 0,
        closable: true,
      })
      return
    }
    let param = {
      fId: menuId.value,
      fMenuName: dataName.value,
      fMenuType: dataType.value,
      fMenuJson: [...unref(treeData)],
    }
    //alert(JSON.stringify(param))
    api.menuSave(param).then((res) => {
      //如果没有Id，则表示第一次添加数据，需要重新获取下Id
      // if (
      //   menuId.value === null ||
      //   menuId.value === undefined ||
      //   menuId.value === ''
      // ) {
      //   methods.loadMenu()
      // }
      subLoading.value = false
      message.success('保存成功！')
    })
  },

  /** 获取是否可以创建子菜单 */
  getIsAddSon: computed(() => {
    return !selectTreeItem.value.treeItemKey.length
  }),
  /** 遍历菜单所有KEY */
  getMenuAllKeys: () => {
    let allKeys = []
    // 递归函数，用于遍历菜单并提取menu属性
    const traverse = (items) => {
      items.forEach((item) => {
        // 添加当前项的key到结果数组中
        allKeys.push(item.key)
        // 如果当前项有children属性，递归调用traverse函数
        if (item.children) {
          traverse(item.children)
        }
      })
    }
    // 从传入的menus数组开始遍历
    traverse(unref(treeData))
    return allKeys
  },
  /** 根据KEY查找菜单数据 */
  getMenuItemByKey: (key) => {
    // 递归函数来查找具有指定parentKey的父级对象
    const findParent = (items, key) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) {
          // 如果找到了匹配的项，就返回它
          return items[i]
        }
        // 如果当前项有children，递归检查它们
        if (Array.isArray(items[i].children)) {
          const result = findParent(items[i].children, key)
          if (result) {
            return result
          }
        }
      }
      // 如果没有找到匹配的父级，返回null
      return null
    }
    // 查找
    return findParent(unref(treeData), key)
  },
  /** 添加新菜单或页面 */
  addMenuItem: (key, newItem) => {
    //添加新菜单时，验证是否存在
    const menuItem = methods.getMenuItemByKey(newItem.key)
    if (menuItem === null || menuItem === undefined) {
      // KEY不为空，添加子菜单
      if (key) {
        // 查找选项并添加新项
        const parent = methods.getMenuItemByKey(key)
        if (parent) {
          //children为空,则初始化数组
          parent.children = parent.children ? parent.children : []
          parent.children.push({ ...newItem })
        }
      } else {
        // 添加顶级菜单
        treeData.value.push({ ...newItem })
      }
      methods.saveData()
    } else {
      methods.updateMenuItem(newItem.key, newItem)
    }
  },
  /** 更新菜单或页面数据 */
  updateMenuItem: (key, newItem) => {
    // 查找选项并添加新项
    const item = methods.getMenuItemByKey(key)
    if (item) {
      // 如果找到了匹配的项，应用更新
      Object.assign(item, newItem)
    }
    methods.saveData()
  },
  /** 删除指定KEY的菜单数据 */
  deleteMenuItem: (key) => {
    const detete = (menus, key) => {
      return menus.reduce((acc, menu) => {
        // 检查当前菜单项是否是需要删除的
        if (menu.key !== key) {
          // 如果不是，则递归处理子菜单（如果有的话）
          let filteredChildren = menu.children
            ? detete(menu.children, key)
            : menu.children
          // 将当前菜单（可能已更新的子菜单）添加到结果数组中
          acc.push({ ...menu, children: filteredChildren })
        }
        // 不需要添加匹配的菜单项到结果数组中
        return acc
      }, [])
    }
    const newMenus = detete([...unref(treeData)], key)
    treeData.value = newMenus
    methods.saveData()
  },
}

const events = {
  /** 菜单类型选择后处理 */
  handleDataTypeChange: (value) => {
    dataType.value = event.target.value
  },
  /** 添加菜单按钮事件 */
  handleAddMenu: (key: string) => {
    isEditMenu.value = 'add'
    if (key === 'home') {
      selectTreeItem.value.treeItemTitle = '添加顶栏菜单'
      selectTreeItem.value.treeItemKey = []
      selectTreeItem.value.treeItemLabel = ''
    } else {
      selectTreeItem.value.treeItemTitle = '添加子菜单：'
    }
    Object.assign(formParams, initialForm)
  },
  /** 选择页面OnChagne事件 */
  handlePageChange: (v, option) => {
    Object.assign(formParams, {
      key: option.value,
      label: option.name,
    })
  },
  /** 左侧树形展开收起发生变化时事件 */
  handleExpandedKeys: (keys) => {
    expandedKeys.value = keys
  },
  /** 左侧树形节点选中事件 */
  handleSelectTree: (keys) => {
    Object.assign(formParams, { ...initialForm })
    if (keys.length) {
      const treeItem = { ...methods.getMenuItemByKey(keys[0]) }
      selectTreeItem.value.treeItemTitle = '编辑菜单：'
      selectTreeItem.value.treeItemKey = keys
      selectTreeItem.value.treeItemLabel = treeItem.label
      Object.assign(formParams, treeItem)
      isEditMenu.value = 'edit'
    } else {
      isEditMenu.value = ''
      selectTreeItem.value.treeItemKey = []
      selectTreeItem.value.treeItemTitle = ''
      selectTreeItem.value.treeItemLabel = ''
    }
  },
  /** 左侧树形展开收起事件 */
  handlePack: () => {
    if (expandedKeys.value.length) {
      expandedKeys.value = []
    } else {
      expandedKeys.value = methods.getMenuAllKeys()
    }
  },
  /** 右侧菜单编辑区域删除按钮事件 */
  handleDel: () => {
    dialog.info({
      title: '提示',
      content: `您确定想删除此菜单吗?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        methods.deleteMenuItem(selectTreeItem.value.treeItemKey[0])
      },
    })
  },
  /** 右侧菜单编辑区域重置按钮事件 */
  handleReset: () => {
    const treeItem = {
      ...methods.getMenuItemByKey(selectTreeItem.value.treeItemKey[0]),
    }
    Object.assign(formParams, treeItem)
  },
  /** 右侧菜单编辑区域报错提交按钮事件 */
  handleSubmit: () => {
    formRef.value.validate((errors: boolean) => {
      if (!errors) {
        subLoading.value = true
        if (formParams.action !== 'url') {
          formParams.url = undefined
        }
        if (isEditMenu.value === 'add') {
          methods.addMenuItem(selectTreeItem.value.treeItemKey[0], formParams)
        } else {
          methods.updateMenuItem(
            selectTreeItem.value.treeItemKey[0],
            formParams,
          )
        }
      } else {
        message.error('请填写完整信息')
      }
    })
  },
}
/** 左侧树形选择的Item */
const selectTreeItem = ref({
  treeItemKey: [],
  treeItemTitle: '',
  treeItemLabel: '',
})
/** 左侧树形展开收起KEY */
const expandedKeys = ref([])
/** 左侧树形菜单数据 */
const treeData = ref([])
/** 左侧树形菜单检索 */
const pattern = ref('')
/** 右侧菜单编辑区域编辑状态 */
const isEditMenu = ref('')
/** 加载状态 */
const loading = ref(true)
/** 保存价值状态 */
const subLoading = ref(false)
/** 左侧操作按钮，下来菜单 */
const addMenuOptions = ref([
  {
    label: '添加顶级菜单',
    key: 'home',
    disabled: false,
  },
  {
    label: '添加子菜单',
    key: 'son',
    disabled: methods.getIsAddSon,
  },
])

/** 页面表达初始化数据 */
const initialForm = {
  key: '',
  label: '',
  action: 'menu',
  page: '',
  display: 'tab',
  aside: '',
  auth: [],
  url: '',
  children: undefined,
  show: true,
  showAside: true,
}
/** 右侧菜单编辑区域Form */
const formParams = reactive({ ...initialForm })

/** 初始化页面数据 */
onMounted(async () => {
  methods.loadData()
  methods.loadMenu()
  methods.loadPage()
  loading.value = false
})
</script>
