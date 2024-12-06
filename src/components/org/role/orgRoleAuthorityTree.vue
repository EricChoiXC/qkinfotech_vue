<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <!-- 侧边组织架构树 -->
      <n-layout-sider content-style="padding: 24px;" :width="280">
        <n-tree
          block-line
          selectable
          :data="sysAuths"
          key-field="treeKey"
          label-field="treeLabel"
          children-field="children"
          :node-props="clickAuth"
        >
        </n-tree>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <n-table :bordered="false" striped :single-line="false">
          <thead>
            <tr>
              <td colspan="2">
                <div style="text-align: center">角色授权查询</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width: 15%">权限名称</td>
              <td>{{ auth.fName }}</td>
            </tr>
            <tr>
              <td style="width: 15%">描述</td>
              <td>{{ auth.fModule }}</td>
            </tr>
            <tr>
              <td style="width: 15%">相关角色</td>
              <td>
                <span v-for="role in auth.fRoles">{{ role.fName }};</span>
              </td>
            </tr>
            <tr>
              <td style="width: 15%">相关组织架构</td>
              <td>
                <span v-for="element in elements">{{ element.fName }};</span>
              </td>
            </tr>
            <tr>
              <td style="width: 15%">权限树</td>
              <td>
                <n-tree
                  block-line
                  selectable
                  :data="authTree"
                  key-field="treeKey"
                  label-field="treeLabel"
                  children-field="children"
                >
                </n-tree>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import { TreeOption, TreeOverrideNodeClickBehavior } from 'naive-ui'
import createApi from './api'
import { repeat } from 'seemly'

export default defineComponent({
  setup() {
    const api = createApi(getCurrentInstance())
    const sysAuths = ref([]) // 系统权限树
    const auth = ref({
      fId: '',
      fModule: '',
      fName: '',
      fRoles: [],
    }) // 权限信息
    const elements = ref([]) // 相关组织架构
    const authTree = ref([]) // 权限树

    /* 初始化系统权限树根节点 */
    /* 读取系统权限信息。排列并生成节点 */
    api.authorityList({ query: [] }).then(function (result) {
      var auths = result.data.list
      var groupChild = {}
      for (var i = 0; i < auths.length; i++) {
        var a = auths[i]
        if (groupChild[a.fGroup] == undefined) {
          groupChild[a.fGroup] = []
        }
        groupChild[a.fGroup].push({
          isLeaf: true,
          treeKey: a.fId,
          treeLabel: a.fName,
        })
      }
      var groups = []
      for (var child in groupChild) {
        groups.push({
          isLeaf: false,
          treeKey: child,
          treeLabel: child,
          children: groupChild[child],
        })
      }
      sysAuths.value.push({
        isLeaf: false,
        treeKey: '',
        treeLabel: '系统权限',
        children: groups,
      })
    })

    function clickAuth(node) {
      return {
        onClick() {
          if (node.option.isLeaf) {
            loadAuthRole(node.option)
          }
        },
      }
    }

    function loadAuthRole(node) {
      authTree.value = []
      var rootNode = {
        isLeaf: false,
        treeLabel: node.treeLabel,
        treeKey: node.treeKey,
        children: [],
      }
      api.authorityLoad({ fId: node.treeKey }).then(function (res) {
        auth.value = res.data
        var ele = []
        for (var i = 0; i < auth.value.fRoles.length; i++) {
          var authNode = {
            isLeaf: false,
            treeLabel: auth.value.fRoles[i].fName,
            treeKey: auth.value.fRoles[i].fId,
            children: [],
          }
          auth.value.fRoles[i].fElements.forEach(function (e) {
            ele.push(e)
            authNode.children.push({
              isLeaf: true,
              treeLabel: e.fName,
              treeKey: e.fId,
            })
          })
          rootNode.children.push(authNode)
        }
        elements.value = ele
        authTree.value.push(rootNode)
      })
    }

    return {
      sysAuths,
      elements,
      auth,
      authTree,
      clickAuth,
      loadAuthRole,
    }
  },
})
</script>

<style></style>
