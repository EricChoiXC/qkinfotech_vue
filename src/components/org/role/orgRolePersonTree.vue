<template>
  <n-space vertical size="large">
    <n-layout has-sider>
      <!-- 侧边组织架构树 -->
      <n-layout-sider content-style="padding: 24px;" :width="320">
        <n-tree
          block-line
          selectable
          :data="orgTree"
          key-field="treeKey"
          label-field="treeLabel"
          :on-load="loadChildOrgNodes"
          :node-props="clickTreeNode"
        >
        </n-tree>
      </n-layout-sider>
      <n-layout-content content-style="padding: 24px;">
        <!-- 人员权限信息表 -->
        <n-table :bordered="false" striped :single-line="false">
          <thead>
            <tr>
              <td colspan="2">
                <div style="text-align: center">员工授权查询</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width: 15%">姓名</td>
              <td>{{ info.fName }}</td>
            </tr>
            <tr>
              <td style="width: 15%">备注</td>
              <td></td>
            </tr>
            <tr>
              <td style="width: 15%">权限</td>
              <td>
                <span v-for="ele in auths">{{ ele }};</span>
              </td>
            </tr>
            <tr>
              <td style="width: 15%">相关组织架构</td>
              <td>
                <span v-for="ele in elements">{{ ele }};</span>
              </td>
            </tr>
            <tr>
              <td style="width: 15%">权限树</td>
              <td>
                <!-- 人员权限树 -->
                <n-tree
                  block-line
                  selectable
                  :data="roleTree"
                  key-field="treeKey"
                  label-field="treeLabel"
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
import orgApi from '../api'
import { repeat } from 'seemly'

export default defineComponent({
  setup() {
    const api = createApi(getCurrentInstance())
    const roleTree = ref([])
    const orgTree = ref([])
    const info = ref({})
    const elements = ref([])
    const auths = ref([])

    /* 初始化树 */
    orgTree.value.push({
      isLeaf: false,
      treeKey: '',
      treeLabel: '组织架构',
    })

    /* 获取人员权限信息 */
    function loadPersonRole(id) {
      roleTree.value = []
      api.roleSearchPerson({ fId: id }).then(function (res) {
        // roleTree.value.push(res.roleTree)
        info.value = res.info
        // elements.value = res.personElements
        auths.value = res.auths
      })
    }

    function clickTreeNode(node) {
      return {
        onClick() {
          if (node.option.isLeaf) {
            loadPersonRole(node.option.treeKey)
          }
        },
      }
    }

    async function axiosPost(url, param) {
      var res = await orgApi()[url](param)
      var nodes = res.data.list
      return repeat(nodes.length, undefined).map((_, index) => {
        return {
          treeLabel: nodes[index].fName,
          treeKey: nodes[index].fId,
          isLeaf: false,
        }
      })
    }

    async function getChildElementNodes(key) {
      var query = []
      var nodes = []
      query.push({ eq: { 'fValid': true } })
      if (key == '') {
        query.push({ null: 'fParent' })
      } else {
        query.push({ eq: { 'fParent.fId': key } })
      }
      await axiosPost('companyList', { query: query }).then((value) => {
        for (var i = 0; i < value.length; i++) {
          nodes.push({
            treeLabel: value[i].treeLabel,
            treeKey: value[i].treeKey,
            isLeaf: false,
          })
        }
      })
      await axiosPost('personList', {
        query: query,
      }).then((value) => {
        for (var i = 0; i < value.length; i++) {
          nodes.push({
            treeLabel: value[i].treeLabel,
            treeKey: value[i].treeKey,
            isLeaf: true,
          })
        }
      })
      query = []
      if (key == '') {
        query.push({
          and: [{ null: 'fParent' }, { null: 'fCompany' }],
        })
      } else {
        query.push({
          or: [{ eq: { 'fParent.fId': key } }, { eq: { 'fCompany.fId': key } }],
        })
      }
      await axiosPost('deptList', {
        query: query,
      }).then((value) => {
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

    function loadChildOrgNodes(node) {
      return new Promise((resolve) => {
        getChildElementNodes(node.treeKey).then((res) => {
          node.children = res
          resolve()
        })
      })
    }

    return {
      roleTree,
      orgTree,
      info,
      elements,
      auths,

      loadPersonRole,
      clickTreeNode,
      axiosPost,
      getChildElementNodes,
      loadChildOrgNodes,
    }
  },
})
</script>

<style></style>
