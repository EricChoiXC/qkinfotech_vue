<!-- 地址本控件 -->
<!-- 2024-06-20 优化：不再区分单多选，统一优化为数组格式，只在少部分地方区分单多选 -->
<!-- 2024-06-24 优化：通过fElement和fElements区分单多选内容，增加分栏 -->
<!-- 2024-08-12 优化：提交方法支持emit('searchModal') 使用时组件上添加@searchModal-->
<!-- 2024-08-26 改造：增加群组页签 -->
<!-- 2024-09-09 改造，增加excludes方法，作为去除的选择项 -->
<!-- 2024-09-29 优化，优化重复点击导致重复数据请求加载 -->
<!-- 2024-11-14 改造：群组页面加载，基于群组分类进行数据处理 -->
<!--
	入参：
		multi：是否单多选，默认为false，单选
		fElement：单选值对象，需包含fId和fName，multi == false时必填
		fElements：多选值对象列表，需包含fId和fName，multi == true时必填
		orgType：地址本的可选择组织架构范围，默认"ORG_TYPE_ALL"，可用选项请查询orgTypeMap
		status：是否可编辑，edit/view，默认为"view"
    limitRange: 限制选择范围，对象数组，格式[{fId:"", fName:""}]，有值的时候会顶替树列表的根节点
    exCludes: 去除选择范围，
    @searchModal：地址本确认选择数据后调用方法
-->
<template>
  <!-- 页面显示 -->
  <n-space v-if="multi">
    <n-tag
      v-for="ele in $props.fElements"
      :closable="$props.status === 'edit'"
      @close="closeOnSelectedTags(ele)"
    >
      {{ ele.fName }}
    </n-tag>
    <n-tag v-if="$props.status == 'edit'">
      <n-icon :component="Person" @click="openAddress"></n-icon>
    </n-tag>
  </n-space>
  <n-input
    placeholder="请选择"
    @click="openAddress"
    :allow-input="noInputAddress"
    v-model:value="$props.fElement.fName"
    :disabled="$props.status != 'edit'"
    v-else
  >
    <template #suffix>
      <n-icon :component="Person"></n-icon>
    </template>
  </n-input>

  <!-- 地址本弹窗 -->
  <n-modal
    style="width: 60%; height: 60%"
    v-model:show="showAddressModal"
    preset="dialog"
    title="地址本"
    :mask-closable="false"
    :closable="false"
    :close-on-esc="false"
  >
    <n-layout>
      <!-- 顶部栏 -->
      <n-layout-header style="height: 20%"> </n-layout-header>

      <!-- 分栏 -->
      <n-layout-content style="height: 60%">
        <n-card>
          <n-tabs type="card">
            <!-- 地址本页 -->
            <n-tab-pane name="组织架构" tab="组织架构">
              <n-card style="height: 500px">
                <n-layout has-sider>
                  <!-- 左侧树 -->
                  <n-layout-sider
                    style="width: 50%; height: 470px"
                    content-style="padding-right : 20px"
                    bordered
                  >
                    <n-scrollbar style="height: 100%">
                      <n-tree
                        block-line
                        selectable
                        :data="addressTree"
                        key-field="treeKey"
                        label-field="treeLabel"
                        :on-load="loadChildOrgNodes"
                        :node-props="clickTreeNode"
                      >
                      </n-tree>
                    </n-scrollbar>
                  </n-layout-sider>
                  <!-- 右侧列表项 -->
                  <n-layout-header style="width: 50%; height: 470px">
                    <n-list bordered>
                      <template v-if="multi">
                        <n-checkbox-group
                          :value="addressSelectedValsId"
                          @update:value="clickAddressCheckbox"
                        >
                          <n-list-item v-for="item in addressLists">
                            <n-checkbox
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                            >
                            </n-checkbox>
                          </n-list-item>
                        </n-checkbox-group>
                      </template>
                      <template v-else>
                        <n-radio-group v-model:value="$props.fElement.fId">
                          <n-list-item v-for="item in addressLists">
                            <n-radio
                              :key="item.fId"
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                              @change="clickAddressRadio"
                            >
                            </n-radio>
                          </n-list-item>
                        </n-radio-group>
                      </template>
                    </n-list>
                    <n-space justify="center">
                      <n-button :loading="onLoadingList" v-show="onLoadingList" type="info" disabled>加载中</n-button>
                    </n-space>
                  </n-layout-header>
                </n-layout>
              </n-card>
            </n-tab-pane>
            <!-- 群组 -->
            <n-tab-pane name="群组" tab="群组" v-if="showGroupTab()">
              <n-card style="height: 500px">
                <n-layout has-sider>
                  <!-- 左侧树 -->
                  <n-layout-sider
                    style="width: 50%; height: 470px"
                    content-style="padding-right : 20px"
                    bordered
                  >
                    <n-scrollbar style="height: 100%">
                      <n-tree
                        block-line
                        selectable
                        :data="groupsTree"
                        key-field="treeKey"
                        label-field="treeLabel"
                        :on-load="loadGroupMemberNodes"
                        :node-props="clickGroupNode"
                        :selected-keys="addressSelectedTreeNode"
                      >
                      </n-tree>
                    </n-scrollbar>
                  </n-layout-sider>
                  <!-- 右侧列表项 -->
                  <n-layout-header style="width: 50%; height: 470px">
                    <n-list bordered>
                      <template v-if="multi">
                        <n-checkbox-group
                          :value="addressSelectedValsId"
                          @update:value="clickGroupMemberCheckbox"
                        >
                          <n-list-item v-for="item in groupMemberLists">
                            <n-checkbox
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                            >
                            </n-checkbox>
                          </n-list-item>
                        </n-checkbox-group>
                      </template>
                      <template v-else>
                        <n-radio-group v-model:value="$props.fElement.fId">
                          <n-list-item v-for="item in groupMemberLists">
                            <n-radio
                              :key="item.fId"
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                              @change="clickAddressRadio"
                            >
                            </n-radio>
                          </n-list-item>
                        </n-radio-group>
                      </template>
                    </n-list>
                  </n-layout-header>
                </n-layout>
              </n-card>
            </n-tab-pane>
            <!-- 角色 -->
            <n-tab-pane name="角色" tab="角色" v-if="showGroupTab()">
              <n-card style="height: 500px">
                <n-layout has-sider>
                  <!-- 左侧树 -->
                  <n-layout-sider
                    style="width: 50%; height: 470px"
                    content-style="padding-right : 20px"
                    bordered
                  >
                    <n-scrollbar style="height: 100%">
                      <n-tree
                        block-line
                        selectable
                        :data="rolesTree"
                        key-field="treeKey"
                        label-field="treeLabel"
                        :node-props="clickRoleNode"
                      >
                      </n-tree>
                    </n-scrollbar>
                  </n-layout-sider>
                  <!-- 右侧列表项 -->
                  <n-layout-header style="width: 50%; height: 470px">
                    <n-list bordered>
                      <template v-if="multi">
                        <n-checkbox-group
                          :value="addressSelectedValsId"
                          @update:value="clickRoleMemberCheckbox"
                        >
                          <n-list-item v-for="item in roleMemberLists">
                            <n-checkbox
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                            >
                            </n-checkbox>
                          </n-list-item>
                        </n-checkbox-group>
                      </template>
                      <template v-else>
                        <n-radio-group v-model:value="$props.fElement.fId">
                          <n-list-item v-for="item in roleMemberLists">
                            <n-radio
                              :key="item.fId"
                              :value="item.fId"
                              :label="item.fName"
                              :name="item.fName"
                              @change="clickAddressRadio"
                            >
                            </n-radio>
                          </n-list-item>
                        </n-radio-group>
                      </template>
                    </n-list>
                  </n-layout-header>
                </n-layout>
              </n-card>
            </n-tab-pane>
            <!-- 搜索页 -->
            <n-tab-pane name="搜索" tab="搜索">
              <n-card style="height: 500px">
                <n-space justify="center">
                  <n-input
                    v-model:value="searchInput"
                    placeholder="请输入名称/拼音/编号"
                    @keyup.enter="doSearch"
                  ></n-input>
                  <n-button @click="doSearch">搜索</n-button>
                </n-space>
                <n-list bordered>
                  <template v-if="multi">
                    <n-checkbox-group
                      :value="addressSelectedValsId"
                      @update:value="clickSearchCheckbox"
                    >
                      <n-list-item v-for="item in searchLists">
                        <n-checkbox
                          :value="item.fId"
                          :label="item.fName"
                          :name="item.fName"
                        >
                        </n-checkbox>
                        <span style="color: gray">({{ item.fFullName }})</span>
                      </n-list-item>
                    </n-checkbox-group>
                  </template>
                  <template v-else>
                    <n-radio-group v-model:value="$props.fElement.fId">
                      <n-list-item v-for="item in searchLists">
                        <n-radio
                          :key="item.fId"
                          :value="item.fId"
                          :label="item.fName"
                          :name="item.fName"
                          @change="clickAddressRadio"
                        >
                        </n-radio>
                        <span style="color: gray">({{ item.fFullName }})</span>
                      </n-list-item>
                    </n-radio-group>
                  </template>
                </n-list>
              </n-card>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-layout-content>

      <!-- 已选项，按钮 -->
      <n-layout-footer style="height: 20%">
        <n-space justify="start">
          已选：
          <n-tag
            v-for="val in addressSelectedVals"
            closable
            @close="closeTags(val)"
          >
            {{ val.fName }}
          </n-tag>
        </n-space>
        <n-space justify="center">
          <n-button type="success" @click="confirm">确认</n-button>
          <n-button type="warning" @click="clean">清空</n-button>
          <n-button type="error" @click="cancel">取消</n-button>
        </n-space>
      </n-layout-footer>
    </n-layout>
  </n-modal>
</template>

<script>
import { ref, defineComponent, h, reactive } from 'vue'
import { Person } from '@vicons/ionicons5'
import createApi from './api'
import { useMessage } from 'naive-ui'
import { repeat } from 'seemly'
import publicContext from '@/context.js'

const orgTypeMap = {
  ORG_TYPE_ORG: [1],
  ORG_TYPE_DEPT: [2],
  ORG_TYPE_POST: [3],
  ORG_TYPE_PERSON: [80],
  ORG_TYPE_GROUP: [5],
  ORG_TYPE_ORGORDEPT: [1, 2],
  ORG_TYPE_POSTORPERSON: [3, 80],
  ORG_TYPE_ALLORG: [1, 2, 3, 80],
  ORG_TYPE_ALL: [1, 2, 3, 5, 80],
}

export default defineComponent({
  props: {
    multi: Boolean,
    /* 是否多选 */
    fElements: Object,
    /* 单选值 */
    fElement: Object,
    /* 多选值 */
    orgType: String,
    /* 地址本可选的组织架构 */
    status: String,
    /* edit/view */
    limitRange: Object,
    exCludes: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    /* 是否编辑 */
    const editStatus = ref(false)
    if (props.status && props.status == 'edit') {
      editStatus.value = true
    }
    /* 是否多选 */
    const multi = ref(false)
    if (props.multi && props.multi == true) {
      multi.value = true
    }
    /* 地址本可选的组织架构类型 */
    const orgType = ref('ORG_TYPE_ALL')
    if (props.orgType && orgTypeMap[props.orgType]) {
      orgType.value = props.orgType
    }
    /* 是否显示地址本弹窗 */
    const showAddressModal = ref(false)
    /* 信息 */
    const message = useMessage()
    /* 旧选项值 */
    const oldElement = reactive({
      fId: '',
      fName: '',
    })
    const oldElements = reactive([])
    /* 地址本-搜索-搜索文本 */
    const searchInput = ref('')
    /* 地址本-组织架构-组织架构树 */
    const addressTree = reactive([])
    addressTree.push({
      isLeaf: false,
      treeKey: '',
      treeLabel: '组织架构',
    })
    /* 地址本-组织架构-当前选中树节点 */
    const addressSelectedTreeNode = ref('')
    /* 地址本-组织架构-展示列表 */
    const addressLists = reactive([])
    /* 地址本-搜索也-展示列表 */
    const searchLists = reactive([])
    /* 地址本-当前选择项 */
    const addressSelectedVals = reactive([])
    const addressSelectedValsId = reactive([])
    /* 是否有正在加载列表 */
    const onLoadingList = ref(false)

    /* 禁止文本框输入 */
    function noInputAddress() {
      return false
    }
    /* 打开地址本 */
    function openAddress() {
      /* 记录旧值 */
      addressSelectedVals.length = 0
      addressSelectedValsId.length = 0
      if (multi.value) {
        oldElements.length = 0
        for (var i = 0; i < props.fElements.length; i++) {
          oldElements.push(props.fElements[i])
          addressSelectedVals.push(props.fElements[i])
          addressSelectedValsId.push(props.fElements[i].fId)
        }
      } else {
        oldElement.fId = props.fElement.fId
        oldElement.fName = props.fElement.fName
        if (props.fElement.fId != '') {
          addressSelectedVals.push({
            fId: props.fElement.fId,
            fName: props.fElement.fName,
          })
          addressSelectedValsId.push(props.fElement.fId)
        }
      }
      /* 初始化地址本 */
      searchInput.value = ''
      addressTree.length = 0
      addressSelectedTreeNode.value = ''
      addressLists.length = 0
      searchLists.length = 0
      showAddressModal.value = true
      if (props.limitRange != undefined && props.limitRange.length >= 0) {
        for (var i = 0; i < props.limitRange.length; i++) {
          var temp = props.limitRange[i]
          addressTree.push({
            isLeaf: temp.fId ? false : true,
            treeKey: temp.fId,
            treeLabel: temp.fName,
          })
        }
      } else {
        addressTree.push({
          isLeaf: false,
          treeKey: '',
          treeLabel: '组织架构',
        })
      }
      initGroup()
      initRole()
    }
    /* 地址本确认 */
    function confirm() {
      if (multi.value) {
        props.fElements.length = 0
        for (var i = 0; i < addressSelectedVals.length; i++) {
          props.fElements.push(addressSelectedVals[i])
        }
      } else {
        if (addressSelectedVals.length > 0) {
          props.fElement.fId = addressSelectedVals[0].fId
          props.fElement.fName = addressSelectedVals[0].fName
        } else {
          props.fElement.fId = ''
          props.fElement.fName = ''
        }
      }
      showAddressModal.value = false
      //emit搜索执行
      context.emit('searchModal')
    }
    /* 地址本清空 */
    function clean() {
      addressSelectedVals.length = 0
      addressSelectedValsId.length = 0
      if (!props.multi) {
        props.fElement.fId = ''
        props.fElement.fName = ''
      }
    }
    /* 地址本取消 */
    function cancel() {
      if (multi.value) {
        props.fElements.length = 0
        for (var i = 0; i < oldElements.length; i++) {
          props.fElements.push(oldElements[i])
        }
      } else {
        props.fElement.fId = oldElement.fId
        props.fElement.fName = oldElement.fName
      }
      showAddressModal.value = false
    }
    /* 删除一个已选项 */
    function closeTags(e) {
      for (var i = 0; i < addressSelectedVals.length; i++) {
        if (addressSelectedVals[i].fId == e.fId) {
          addressSelectedVals.splice(i, 1)
          addressSelectedValsId.splice(i, 1)
          break
        }
      }
      if (!props.multi) {
        props.fElement.fId = ''
        props.fElement.fName = ''
      }
    }
    /* 在地址本外删除多选地址本的已选项 */
    function closeOnSelectedTags(e) {
      for (var i = 0; i < props.fElements.length; i++) {
        if (props.fElements[i].fId == e.fId) {
          props.fElements.splice(i, 1)
          break
        }
      }
    }
    /* 加载树子节点 */
    function loadChildOrgNodes(node) {
      return new Promise(function (resolve) {
        getChildElementNodes(node.treeKey).then(function (res) {
          node.children = res
          resolve()
        })
      })
    }
    /* 加载右侧列表 */
    function clickTreeNode(node) {
      return {
        async onclick() {
          console.log(node)
          console.log(onLoadingList.value)
          if (addressSelectedTreeNode.value == node.option.treeKey) {
            return;
          }
          if (onLoadingList.value) {
            message.warning("正在加载组织架构数据中，请稍候")
            return
          }
          onLoadingList.value = true
          addressLists.length = 0
          var orgs = orgTypeMap[orgType.value]
          addressSelectedTreeNode.value = node.option.treeKey
          for (var i = 0; i < orgs.length; i++) {
            var org = orgs[i]
            var query = []
            var param = []
            var url = ''
            param.push({
              eq: {
                'fValid': true,
              },
            })
            param.push({
              eq: {
                'fType': org,
              },
            })
            if (org == '2') {
              if (addressSelectedTreeNode.value == '') {
                param.push({
                  null: 'fParent',
                })
                param.push({
                  null: 'fCompany',
                })
              } else {
                param.push({
                  or: [
                    {
                      eq: {
                        'fParent.fId': addressSelectedTreeNode.value,
                      },
                    },
                    {
                      eq: {
                        'fCompany.fId': addressSelectedTreeNode.value,
                      },
                    },
                  ],
                })
              }
              url += 'deptList'
            } else if (org == '1' || org == '80') {
              if (addressSelectedTreeNode.value == '') {
                param.push({
                  null: 'fParent',
                })
              } else {
                param.push({
                  eq: {
                    'fParent.fId': addressSelectedTreeNode.value,
                  },
                })
              }
              url += org == '1' ? 'companyList' : 'personList'
            } else if (org == '3' || org == '5') {
              if (addressSelectedTreeNode.value == '') {
                param.push({
                  null: 'fOwner',
                })
              } else {
                param.push({
                  eq: {
                    'fOwner.fId': addressSelectedTreeNode.value,
                  },
                })
              }
              url += org == '3' ? 'postList' : 'groupList'
            }
            query.push({
              and: param,
            })
            var pageSize = 100
            var pageNum = 0
            var res = await api[url]({
              query: query,
              pagesize: 15,
              pagenum: 0
            })
            var total = res.data.total
            while(pageSize * pageNum <= total) {
              await axiosPost(url, {
                query: query,
                /*sort: ['fOrder'],*/
                pagesize: pageSize,
                pagenum: pageNum
              }).then(async function (res) {
                for (var i = 0; i < res.length; i++) {
                  if (!props.exCludes.includes(res[i].fId)) {
                    addressLists.push({
                      fId: res[i].fId,
                      fName: res[i].fName,
                      fFullName: res[i].fFullName,
                    })
                  }
                }
              }).catch(function (e) {

              })
              pageNum++
            }
          }
          onLoadingList.value = false
        },
      }
    }
    /* 地址本搜索框查询 */
    async function doSearch() {
      searchLists.length = 0
      if (searchInput.value == '') {
        return
      }
      var orgs = orgTypeMap[orgType.value]
      for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i]
        var query = []
        var param = []
        var url = ''
        param.push({
          eq: {
            'fValid': true,
          },
        })
        param.push({
          eq: {
            'fType': org,
          },
        })
        param.push({
          or: [
            {
              contains: {
                'fName': searchInput.value,
              },
            },
            {
              contains: {
                'fNamePinYin': searchInput.value,
              },
            },
            {
              contains: {
                'fNameSimplePinYin': searchInput.value,
              },
            },
            {
              contains: {
                'fCode': searchInput.value,
              },
            },
          ],
        })
        if (props.limitRange != undefined && props.limitRange.length >= 0) {
          var limitQuery = []
          for (var i = 0; i < props.limitRange.length; i++) {
            limitQuery.push({
              contains: {
                'fHibernateIds': props.limitRange[i].fId,
              },
            })
          }
          param.push({
            or: limitQuery,
          })
        }
        if (org == '1') url += 'companyList'
        else if (org == '2') url += 'deptList'
        else if (org == '3') url += 'postList'
        else if (org == '5') url += 'groupList'
        else if (org == '80') url += 'personList'
        query.push({
          and: param,
        })
        await axiosPost(url, {
          query: query,
          /*sort: ['fOrder'],*/
        }).then(function (res) {
          for (var i = 0; i < res.length; i++) {
            searchLists.push({
              fId: res[i].fId,
              fName: res[i].fName,
              fFullName: res[i].fFullName,
            })
          }
        })
      }
    }

    /* 获取节点的子公司，部门数据 */
    async function getChildElementNodes(key) {
      var nodes = [] /* 结果 */
      var query = []
      /* 子公司 */
      if (key == '') {
        query.push({
          null: 'fParent',
        })
      } else {
        query.push({
          eq: {
            'fParent.fId': key,
          },
        })
      }
      query.push({
        eq: {
          'fValid': true,
        },
      })
      await axiosPost('companyList', {
        query: [
          {
            and: query,
          },
        ],
        /*sort: ['fOrder'],*/
      }).then((value) => {
        for (var i = 0; i < value.length; i++) {
          nodes.push({
            treeLabel: value[i].fName,
            treeKey: value[i].fId,
            isLeaf: false,
          })
        }
      })
      /* 部门 */
      query = []
      if (key == '') {
        query.push({
          and: [
            {
              null: 'fParent',
            },
            {
              null: 'fCompany',
            },
            {
              eq: {
                'fValid': true,
              },
            },
          ],
        })
      } else {
        query.push({
          and: [
            {
              eq: {
                'fValid': true,
              },
            },
            {
              or: [
                {
                  eq: {
                    'fParent.fId': key,
                  },
                },
                {
                  eq: {
                    'fCompany.fId': key,
                  },
                },
              ],
            },
          ],
        })
      }
      await axiosPost('deptList', {
        query: query,
        /*sort: ['fOrder'],*/
      }).then((value) => {
        for (var i = 0; i < value.length; i++) {
          nodes.push({
            treeLabel: value[i].fName,
            treeKey: value[i].fId,
            isLeaf: false,
          })
        }
      })
      return nodes
    }
    /* 后台请求 */
    async function axiosPost(url, param) {
      var res = await api[url](param)
      var nodes = res.data.list
      return repeat(nodes.length, undefined).map((_, index) => {
        return {
          fName: nodes[index].fName,
          fId: nodes[index].fId,
          fCode: nodes[index].fCode,
          fFullName: nodes[index].fFullName,
        }
      })
    }
    /* 地址本复选框点击 */
    function clickAddressCheckbox(vals, target) {
      if (target.actionType == 'check') {
        for (var i = 0; i < addressLists.length; i++) {
          if (addressLists[i].fId == target.value) {
            addressSelectedVals.push({
              fId: addressLists[i].fId,
              fName: addressLists[i].fName,
            })
            addressSelectedValsId.push(addressLists[i].fId)
          }
        }
      } else if (target.actionType == 'uncheck') {
        closeTags({
          fId: target.value,
        })
      }
    }
    function clickGroupMemberCheckbox(vals, target) {
      if (target.actionType == 'check') {
        for (var i = 0; i < groupMemberLists.length; i++) {
          if (groupMemberLists[i].fId == target.value) {
            addressSelectedVals.push({
              fId: groupMemberLists[i].fId,
              fName: groupMemberLists[i].fName,
            })
            addressSelectedValsId.push(groupMemberLists[i].fId)
          }
        }
      } else if (target.actionType == 'uncheck') {
        closeTags({
          fId: target.value,
        })
      }
    }
    function clickRoleMemberCheckbox(vals, target) {
      if (target.actionType == 'check') {
        for (var i = 0; i < roleMemberLists.length; i++) {
          if (roleMemberLists[i].fId == target.value) {
            addressSelectedVals.push({
              fId: roleMemberLists[i].fId,
              fName: roleMemberLists[i].fName,
            })
            addressSelectedValsId.push(roleMemberLists[i].fId)
          }
        }
      } else if (target.actionType == 'uncheck') {
        closeTags({
          fId: target.value,
        })
      }
    }

    function clickAddressRadio(e) {
      addressSelectedVals.length = 0
      addressSelectedValsId.length = 0
      addressSelectedVals.push({
        fId: e.target.value,
        fName: e.target.name,
      })
      addressSelectedValsId.push(e.target.value)
      props.fElement.fId = e.target.value
      props.fElement.fName = e.target.name
    }
    /* 搜索复选框点击 */
    function clickSearchCheckbox(vals, target) {
      if (target.actionType == 'check') {
        for (var i = 0; i < searchLists.length; i++) {
          if (searchLists[i].fId == target.value) {
            addressSelectedVals.push({
              fId: searchLists[i].fId,
              fName: searchLists[i].fName,
            })
            addressSelectedValsId.push(searchLists[i].fId)
          }
        }
      } else if (target.actionType == 'uncheck') {
        closeTags({
          fId: target.value,
        })
      }
    }

    //群组
    const groupsTree = reactive([])
    //群组列表
    const groupMemberLists = reactive([])
    //加载群组子节点（未使用）
    function loadGroupMemberNodes(node) {
      return new Promise(function (resolve) {
        /*getChildElementNodes(node.treeKey).then(function (res) {
          node.children = res
          resolve()
        })*/
        console.log("loadGroupMemberNodes")
        console.log(node)
        node.children = []
        // 四个父节点点击加载
        if (node.treeKey === 'global') {
          var query = {
            or : [{
              and: [
                {null: "fOwner"},
                {null: "fGroupCate"}
              ]
            }, {
              and : [
                {null : "fOwner"},
                {null : "fGroupCate.fOwner"}
              ]
            }]
          }
          var param = {
            query : query
          }
          api.orgGroupList(param).then(function(res) {
            console.log(res)
          })
        } else if (node.treeKey === 'personal') {
          var query = {
            and : [{
              "eq" : {"fOwner.fId" : publicContext.user()}
            }, {
              "null": "fGroupCate"
            }]
          }
          var param = {
            query : query
          }
          api.orgGroupListAll(param).then(function(res) {
            console.log(res)
          })
          query = {
            and : [
              {"null" : "fOwner"},
              {"eq" : {"fGroupCate.fOwner.fId" : publicContext.user()}}
            ]
          }
          param.query = query
          api.orgGroupListAll(param).then(function(res) {
            console.log(res)
          })


        } else if (node.treeKey === 'dept') {
          api.orgOrgGroupList({fKey : "dept"}).then(function(res) {
            console.log(res)
          })
        } else if (node.treeKey === 'company') {
          api.orgOrgGroupList({fKey : "company"}).then(function(res) {
            console.log(res)
          })
        }
        resolve()
      })
    }
    //加载群组成员
    function clickGroupNode(node) {
      return {
        onClick() {
          groupMemberLists.length = 0
          var orgs = orgTypeMap[orgType.value]
          if (orgs.indexOf(5) >= 0) {
            groupMemberLists.push({
              fId: node.option.treeKey,
              fName: node.option.treeLabel,
              fFullName: '',
            })
          }
          for (var i = 0; i < node.option.members.length; i++) {
            var temp = node.option.members[i]
            if (orgs.indexOf(parseInt(temp.fType)) >= 0) {
              groupMemberLists.push({
                fId: temp.fId,
                fName: temp.fName,
                fFullName: temp.fFullName,
              })
            }
          }
        },
      }
    }
    //初始化群组
    function initGroup() {
      //初始化群组长度
      groupMemberLists.length = 0
      groupsTree.length = 0

      //加载无分类群组
      api.groupList().then(function (res) {
        if (res.status == 200 && res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            groupsTree.push({
              isLeaf: true,
              treeKey: temp.fId,
              treeLabel: temp.fName,
              members: temp.fMembers,
            })
          }
        }
      })

      //加载四大群组类型
      groupsTree.push({
        isLeaf: false,
        treeKey : "global",
        treeLabel : "全局群组",
        members : []
      })
      groupsTree.push({
        isLeaf: false,
        treeKey : "personal",
        treeLabel : "个人群组",
        members : []
      })
      groupsTree.push({
        isLeaf: false,
        treeKey : "dept",
        treeLabel : "部门群组",
        members : []
      })
      groupsTree.push({
        isLeaf: false,
        treeKey : "company",
        treeLabel : "公司群组",
        members : []
      })
    }

    //是否显示群组卡片
    function showGroupTab() {
      return !props.limitRange || props.limitRange.length == 0
    }

    //角色树
    const rolesTree = reactive([])
    //角色列表
    const roleMemberLists = reactive([])
    //加载角色成员
    function clickRoleNode(node) {
      return {
        onClick() {
          roleMemberLists.length = 0
          var orgs = orgTypeMap[orgType.value]
          for (var i = 0; i < node.option.fElements.length; i++) {
            var temp = node.option.fElements[i]
            if (orgs.indexOf(parseInt(temp.fType)) >= 0) {
              roleMemberLists.push({
                fId: temp.fId,
                fName: temp.fName,
                fFullName: temp.fFullName,
              })
            }
          }
        },
      }
    }
    //初始化角色
    function initRole() {
      rolesTree.length = 0
      roleMemberLists.length = 0
      api.sysRoleList().then(function (res) {
        if (res.status == 200 && res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            var temp = res.data.list[i]
            rolesTree.push({
              isLeaf: true,
              treeKey: temp.fId,
              treeLabel: temp.fName,
              fElements: temp.fElements,
            })
          }
        }
      })
    }

    return {
      /* 参数 */
      editStatus,
      multi,
      orgType,
      showAddressModal,
      message,
      oldElement,
      oldElements,
      searchInput,
      addressTree,
      addressSelectedTreeNode,
      addressLists,
      searchLists,
      addressSelectedVals,
      addressSelectedValsId,
      groupsTree,
      groupMemberLists,
      rolesTree,
      roleMemberLists,
      onLoadingList,

      /* 方法 */
      confirm,
      clean,
      cancel,
      openAddress,
      noInputAddress,
      closeTags,
      closeOnSelectedTags,
      loadChildOrgNodes,
      clickTreeNode,
      doSearch,
      clickAddressCheckbox,
      clickGroupMemberCheckbox,
      clickRoleMemberCheckbox,
      clickAddressRadio,
      clickSearchCheckbox,
      getChildElementNodes,
      axiosPost,
      loadGroupMemberNodes,
      clickGroupNode,
      initGroup,
      showGroupTab,
      clickRoleNode,
      initRole,

      /* 其他 */
      Person,
    }
  },
})
</script>
