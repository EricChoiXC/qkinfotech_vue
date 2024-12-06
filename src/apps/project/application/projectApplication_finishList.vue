<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header>
      </n-layout-header>
      <n-layout-content>
        <div style="display: flex; flex-wrap: wrap; justify-content: start;  margin-left: 15px; margin-top: 30px;">
          <n-grid x-gap="12" y-gap="12" :cols="3">
            <n-gi>
              <n-space style="align-items:center">
                <span>项目名称：</span>
                <n-input placeholder="请输入项目名称" @blur="handleBlur" @focus="handleFocus" @change="handleFocus"
                  @keyup="handleKeyUp" @input="handleFilterChange" v-model:value="filters.fProjectName"
                  style="width: 300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>项目编号：</span>
                <n-input placeholder="请输入项目编号" @blur="handleBlur" @focus="handleFocus" @change="handleFocus"
                  @keyup="handleKeyUp" @input="fProjectNoFilterChange" v-model:value="filters.fProjectNo"
                  style="width:300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>业主：</span>
                <n-input placeholder="请输入业主" @blur="handleBlur" @focus="handleFocus" @change="handleFocus"
                  @keyup="handleKeyUp" @input="fOwnerFilterChange" v-model:value="filters.fOwner"
                  style="width: 300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>项目经理：</span>
                <n-input placeholder="请输入项目经理" @blur="handleBlur" @focus="handleFocus" @change="handleFocus"
                  @keyup="handleKeyUp" @input="handleFilterManager" v-model:value="filters.fManager"
                  style="width: 300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>项目部门：</span>
                <formAddress style="width: 300px;" @searchModal="deptSearch" :fElement="filters.fDept" status="edit"
                  orgType="ORG_TYPE_DEPT" :limitRange="shgjzbOrg">
                </formAddress>
              </n-space>
            </n-gi>
            <!-- <n-gi>
              <n-space style="align-items:center">
                <span>日期选择：</span>
                <n-date-picker v-model:value="datetimerange" :disabled="disabled" type="datetimerange" @blur="onBlur3"
                  @update:value="onChange3" style="width: 300px;" />
              </n-space>
            </n-gi> -->
          </n-grid>
        </div>

        <n-divider />
        <div style="margin-top: 30px; margin-left: 15px;">
          <n-space style="align-items:center">
            排序：
            <n-button secondary :type="orderButtonsType['fBaseFinishTime']" @click="changeOrder('fBaseFinishTime')"
              icon-placement="right">
              基本结束时间
              <template #icon>
                <n-icon v-if="orderButtonsType['fBaseFinishTime'] == 'primary'">
                  <ArrowUp></ArrowUp>
                </n-icon>
                <n-icon v-else-if="orderButtonsType['fBaseFinishTime'] == 'success'">
                  <ArrowDown></ArrowDown>
                </n-icon>
              </template>
            </n-button>
            <n-button secondary :type="orderButtonsType['fLimitFinishTime']" @click="changeOrder('fLimitFinishTime')"
              icon-placement="right">
              限制结束时间
              <template #icon>
                <n-icon v-if="orderButtonsType['fLimitFinishTime'] == 'primary'">
                  <ArrowUp></ArrowUp>
                </n-icon>
                <n-icon v-else-if="orderButtonsType['fLimitFinishTime'] == 'success'">
                  <ArrowDown></ArrowDown>
                </n-icon>
              </template>
            </n-button>
            <n-button secondary :type="orderButtonsType['fQualifyTime']" @click="changeOrder('fQualifyTime')"
              icon-placement="right">
              达标日期
              <template #icon>
                <n-icon v-if="orderButtonsType['fQualifyTime'] == 'primary'">
                  <ArrowUp></ArrowUp>
                </n-icon>
                <n-icon v-else-if="orderButtonsType['fQualifyTime'] == 'success'">
                  <ArrowDown></ArrowDown>
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </div>

        <n-divider />
        <div style="text-align: center; width: 100%;margin: auto;">
          <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
            @update:checked-row-keys="handleCheck">
          </n-data-table>
        </div>
      </n-layout-content>
    </n-layout>
  </n-space>
</template>



<script setup>
  import {
    h,
    defineComponent,
    reactive,
    ref
  } from "vue";
  import {
    NButton,
    useMessage
  } from "naive-ui";
  import formAddress from '@/apps/common/address/formAddress.vue'
  import projectNodes from '@/apps/project/project_nodes.vue'
  import XCritera from '@/apps/common/filter/x-criteria.vue'
  import XDate from '@/apps/common/filter/x-date.vue'
  import XFilterItem from '@/apps/common/filter/x-filter-item.vue'
  import XSelector from '@/apps/common/filter/x-selector.vue'
  import storage from "@/utils/storage";
  import {
    ArrowUp,
    ArrowDown
  } from '@vicons/ionicons5'
  import context from '@/context.js'

  import layout from "@/layout/layout";
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const fDeptManager = reactive({})
  const pagination = reactive({
    page: 1,
    pageSize: 15,
    showSizePicker: true,
    pageSizes: [15, 30, 50],
    onChange: (newPage) => {
      pagination.page = newPage; // 直接更新 page 对象内的 page 属性
      // fetchList();
    },
    onUpdatePageSize: (newPageSize) => {
      pagination.pageSize = newPageSize; // 更新 pageSize
      pagination.page = 1; // 重置 page 到第一页
      // fetchList();
    }
  });
  const range = ref([118313526e4, Date.now()])

  //项目名称
  const filters = reactive({
    fProjectName: "",
    fProjectNo: "",
    fOwner: "",
    fDeptManager: "",
    fBaseFinishTime: "",
    fLimitFinishTime: "",
    fQualifyTime: "",
    fManager: "",
    fDept: {}
  })

  /* 排序按钮 */
  const orderButtonsType = ref({
    "fBaseFinishTime": "tertiary",
    "fLimitFinishTime": "tertiary",
    "fQualifyTime": "tertiary"
  })

  /* 当前排序项 */
  const orderBy = ref([])

  const columns = [{
    title: '序号',
    key: 'index',
    render(row, index) {
      return index + 1;
    }
  }, {
    title: '类别',
    key: 'fProjectCategory.fName'
  }, {
    title: '项目编号',
    key: 'fProtocolNo',
  }, {
    title: '项目名称',
    key: 'fName'
  }, {
    title: '业主',
    key: 'fOwner'
  }, {
    title: '项目经理',
    key: 'fDeptManager.fName'
  }, {
    title: '基本结束时间',
    key: 'fBaseFinishTime',
    // sorter: (row1, row2) => {
    //   const date1 = new Date(row1.fBaseFinishTime);
    //   const date2 = new Date(row2.fBaseFinishTime);
    //   return date1.getTime() - date2.getTime();
    // }
  }, {
    title: '限制结束时间',
    key: 'fLimitFinishTime',
    // sorter: (row1, row2) => {
    //   const date1 = new Date(row1.fLimitFinishTime);
    //   const date2 = new Date(row2.fLimitFinishTime);
    //   return date1.getTime() - date2.getTime();
    // }

  }, {
    title: '达标日期',
    key: 'fQualifyTime',
    // sorter: (row1, row2) => {
    //   const date1 = new Date(row1.fQualifyTime);
    //   const date2 = new Date(row2.fQualifyTime);
    //   return date1.getTime() - date2.getTime();
    // }

  }, {
    title: '操作',
    key: 'options',
    render(row) {
      return [h(
        NButton, {
          onClick: async () => {
            // const url = `/opdesk/projectManagement/implementation/project-view?fId=${encodeURIComponent(row.fId)}`;
            // window.open(url);
            layout.close("project-view")
            layout.open({
              label: "项目详情",
              key: "project-view",
              component: '/apps/project/project_nodes.vue',
              urlParams: {
                fId: row.fId
              },
              /*id: row.fId*/
            });
          }
        }, '查看',
      ), ]
    }
  }]

  const showModal = ref(false)
  const message = useMessage();
  const data = ref([]);

  const fetchList = async (query = []) => {
    try {
      var auths = storage.get("auths")
      var queryAnd = []
      var query = []
      if (filters.fProjectName !== "") {
        query.push({
          "contains": {
            "fName": filters.fProjectName
          }
        })
      }
      if (filters.fProjectNo !== "") {
        query.push({
          "contains": {
            "fProtocolNo": filters.fProjectNo
          }
        })
      }
      if (filters.fOwner !== "") {
        query.push({
          "contains": {
            "fOwner": filters.fOwner
          }
        })
      }
      if (filters.fManager !== "") {
        query.push({
          "contains": {
            "fDeptManager.fName": filters.fManager
          }
        })
      }
      if (filters.fDept.fId !== undefined && filters.fDept.fId !== '') {
        query.push({
          "eq": {
            "fDept.fId": filters.fDept.fId
          }
        })
      }
      // 项目编号不为空的记录
      query.push({
        "neq": {
          "fProtocolNo": ""
        }
      })

      if (query.length == 0) {
        queryAnd = []
      } else {
        queryAnd = [{
          "and": query
        }]
      }

      var query2 = []
      //项目经理是自己 或者 成员包括自己
      //2024-09-08 管理员不此受控
      //2024-10-21 有查询的情况下不再限制自己的范围
      if ((storage.get("auths") && storage.get("auths").includes("AUTH_ADMIN")) || query.length > 1) {} else {
        const res = await api.projectMemberList({
          query: {
            "eq": {
              "fPersonId.fId": context.user()
            }
          }
        });
        const arr = [];
        res.data.list.map(item => (
          arr.push(item.fMainId.fId)
        ));
        query2.push({
          "eq": {
            "fDeptManager.fId": context.user(),
          }
        })
        query2.push({
          "in": {
            "fId": arr,
          }
        })
        queryAnd.push({
          "or": query2
        })
      }

      var param = {}
      param.query = queryAnd
      param.sort = ["fCreateTime desc"]
      // param.sort = orderBy.value
      if (orderBy.value.length !== 0) {
        param.sort = orderBy.value
      }
      const response = await api.projectMainList(param);
      if (response.data.list) {
        data.value = response.data.list
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //获取当前登录人部门
  // const getDefaultDept = async () => {
  //   const userId = context.user()
  //   const positionResult = await axios.post(`/pm/org/person/load?fId=${userId}`);
  //   const deptId = positionResult.data.fParent.fId;
  //   const deptName = positionResult.data.fParent.fName;
  //   fDeptObj.value.fId = deptId
  //   fDeptObj.value.fName = deptName
  // }

  const otherList = async (query = []) => {
    try {
      //项目组成员记录
      const res = await api.projectMemberList({
        query: {
          "eq": {
            "fPersonId.fId": context.user()
          }
        }
      });
      const arr = [];
      res.data.list.map(item => (
        arr.push(item.fMainId.fId)
      ));
      //
      var auths = storage.get("auths")
      var queryAnd = []
      var query = []
      // 项目编号不为空的记录
      query.push({
        "neq": {
          "fProtocolNo": ""
        }
      })
      queryAnd.push({
        "and": query
      })
      var query2 = []
      //项目经理是自己 或者 成员包括自己
      //2024-09-08 管理员不此受控
      //2024-10-21 有查询的情况下不再限制自己的范围
      if ((storage.get("auths") && storage.get("auths").includes("AUTH_ADMIN")) || query.length > 1) {} else {
        query2.push({
          "eq": {
            "fDeptManager.fId": context.user(),
          }
        })
        query2.push({
          "in": {
            "fId": arr,
          }
        })
        queryAnd.push({
          "or": query2
        })
      }
      var param = {}
      param.query = queryAnd
      param.sort = ["fCreateTime desc"]
      if (orderBy.value.length !== 0) {
        param.sort.push(orderBy.value[0])
      }
      const response = await api.projectMainList(param);
      if (response.data.list) {
        data.value.push(...response.data.list);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  onMounted(async () => {
    otherList();
    //部门筛选默认设值
    // await getDefaultDept();
    //取当前部门记录
    // await fetchList();
  });

  //项目名称搜索
  const handleFilterChange = (v) => {
    fetchList();
  };
  //项目编号搜索
  const fProjectNoFilterChange = (v) => {
    fetchList();
  };
  //业主信息搜索
  const fOwnerFilterChange = (v) => {
    fetchList();
  };
  //项目经理搜索
  const handleFilterManager = (v) => {
    fetchList();
  };
  //部门搜索
  const deptSearch = () => {
    fetchList();
  }

  //时间筛选
  // const onChange3 = (v) => {
  //   var timeQuery = [{
  //     "or": [{
  //         "and": [{
  //           "gt": {
  //             "fBaseFinishTime": v[0]
  //           }
  //         }, {
  //           "lt": {
  //             "fBaseFinishTime": v[1]
  //           }
  //         }, ]
  //       },
  //       {
  //         "and": [{
  //           "gt": {
  //             "fLimitFinishTime": v[0]
  //           }
  //         }, {
  //           "lt": {
  //             "fLimitFinishTime": v[1]
  //           }
  //         }, ]
  //       },
  //       {
  //         "and": [{
  //           "gt": {
  //             "fQualifyTime": v[0]
  //           }
  //         }, {
  //           "lt": {
  //             "fQualifyTime": v[1]
  //           }
  //         }, ]
  //       },
  //     ]
  //   }]
  //   axios.post("/pm/apps/project/main/list", {
  //     query: timeQuery
  //   }).then(response => {
  //     data.value = response.data.list;
  //   });
  // }

  //时间排序
  const timestatus = ref([])
  const sortByDate = () => {
    const sort = ["fBaseFinishTime desc"]
    api.projectMainList({
      sort: sort
    }).then(response => {
      data.value = response.data.list.map(item => ({
        fId: item.fId,
        fName: item.fName,
        fNo: item.fProtocolNo,
        fCreateTime: item.fCreateTime,
        fDept: item.fDept,
        fOwner: item.fOwner,
        // fDeptManager:item.fDeptManager,
        fProjectCategory: item.fProjectCategory,
        fBaseFinishTime: item.fBaseFinishTime,
        fLimitFinishTime: item.fLimitFinishTime,
        fBaseFinishTime: item.fBaseFinishTime,
      }));
    });
  }

  /* 变更排序项 */
  function changeOrder(orderName) {
    /* 1.变更排序项 */
    var orderRule = "";
    if (orderBy.value.length == 0) {
      orderBy.value.push(orderName)
      orderRule = "asc"
    } else {
      if (orderBy.value[0] == orderName) {
        orderBy.value[0] = orderName + " desc"
        orderRule = "desc"
      } else if (orderBy.value[0] == orderName + " desc") {
        orderBy.value.length = 0
      } else {
        orderBy.value[0] = orderName
        orderRule = "asc"
      }
    }
    /* 2.变更排序按钮 */
    if (orderBy.value.length == 0) {
      for (var key in orderButtonsType.value) {
        orderButtonsType.value[key] = "tertiary"
      }
    } else {
      for (var key in orderButtonsType.value) {
        if (key == orderName) {
          if (orderRule == "asc") {
            orderButtonsType.value[key] = "primary"
          } else if (orderRule == "desc") {
            orderButtonsType.value[key] = "success"
          } else {
            orderButtonsType.value[key] = "tertiary"
          }
        } else {
          orderButtonsType.value[key] = "tertiary"
        }
      }
    }
    /* 3.执行查询 */
    fetchList()
  }


  //上海国际招标（用于地址本限制可选部门）
  const shgjzbOrg = reactive([])
  var param = [{
      "eq": {
        "fName": "上海国际招标有限公司"
      }
    },
    {
      "eq": {
        "fType": "2"
      }
    }
  ]
  var query = {
    "and": param
  }
  api.elementList({
      query: query
    })
    .then(function(res) {
      shgjzbOrg.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        shgjzbOrg.push(res.data.list[i])
      }
    })
</script>

<style>
  .container {
    display: flex;
    justify-content: flex-start;
    margin-left: 50px;
  }

  .date-picker-container {
    flex-basis: 350px;
    margin-right: 16px;
    /* 添加一些右边距以分隔日期选择器和其他内容 */
  }
</style>
