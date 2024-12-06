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
                  style="width: 300px" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>业主：</span>
                <n-input placeholder="请输入业主" @blur="handleBlur" @focus="handleFocus" @change="handleFocus"
                  @keyup="handleKeyUp" @input="handleFilterOwner" v-model:value="filters.fOwner"
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
          </n-grid>
        </div>
        <n-divider />
        <div style="margin-top: 30px; margin-left: 15px;">
          <n-space style="align-items:center">
            排序：
            <n-button secondary :type="orderButtonsType['fSubmittalTime']" @click="changeOrder('fSubmittalTime')"
              icon-placement="right">
              送达时间
              <template #icon>
                <n-icon v-if="orderButtonsType['fSubmittalTime'] == 'primary'">
                  <ArrowUp></ArrowUp>
                </n-icon>
                <n-icon v-else-if="orderButtonsType['fSubmittalTime'] == 'success'">
                  <ArrowDown></ArrowDown>
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </div>
        <n-divider />
        <div style="text-align: center; width: 100%;margin: auto;">
          <!-- <n-data-table :columns="columns" :data="data" :pagination="pagination" :row-key="rowKey"
            @update:checked-row-keys="handleCheck">
          </n-data-table> -->
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
    computed
  } from "vue";
  import {
    NButton,
    useMessage
  } from "naive-ui";
  import formAddress from '@/apps/common/address/formAddress.vue'

  import XCritera from '@/apps/common/filter/x-criteria.vue'
  import XDate from '@/apps/common/filter/x-date.vue'
  import XFilterItem from '@/apps/common/filter/x-filter-item.vue'
  import XSelector from '@/apps/common/filter/x-selector.vue'
  import Index from "@/layout/opdesk/index.vue";
  import storage from '@/utils/storage.js'
  import {
    ArrowUp,
    ArrowDown
  } from '@vicons/ionicons5'
  import context from '@/context.js'

  import layout from "@/layout/layout";
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const range = ref([118313526e4, Date.now()])
  const columns = [{
      title: '序号',
      key: 'index',
      render(row, index) {
        return index + 1;
      }
    },
    {
      title: '类别',
      key: 'fProjectCategory.fName'
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
      title: "送审时间",
      key: 'fSubmittalTime'
    }, {
      title: '操作',
      key: 'options',
      render(row) {
        return [h(
          NButton, {
            onClick: () => {
              const url =
                context.path+`/view/approval?fId=${encodeURIComponent(row.fId)}`;
              window.open(url);

              // layout.open({
              //   label: "项目详情",
              //   key: "approval",
              //   component: '/apps/project/approval/approval_view.vue',
              //   urlParams: {
              //     fId: row.fId
              //   }
              // });
            }
          }, '审批',
        ), ]
      }, // 使用公共函数



    }
  ]

  /* 排序按钮 */
  const orderButtonsType = ref({
    "fSubmittalTime": "tertiary"
  })

  /* 当前排序项 */
  const orderBy = ref(["fSubmittalTime desc"])

  const showModal = ref(false)
  const message = useMessage();
  //排序状态
  var sortStatus = 0;

  const filters = reactive({
    fProjectName: '',
    fOwner: '',
    fManager: ''
  })

  const data = ref([]);

  const pagination = reactive({
    page: 1,
    pageSize: 15,
    showSizePicker: true,
    pageSizes: [15, 30, 50],
    onChange: (newPage) => {
      pagination.page = newPage; // 直接更新 page 对象内的 page 属性
      fetchListWithPagination();
    },
    onUpdatePageSize: (newPageSize) => {
      pagination.pageSize = newPageSize; // 更新 pageSize
      pagination.page = 1; // 重置 page 到第一页
      fetchListWithPagination();
    }
  }); //时间筛选
  const onChange3 = (v) => {
    var timeQuery = [{
      "and": [{
          "gt": {
            "fSubmittalTime": v[0]
          }
        }, {
          "lt": {
            "fSubmittalTime": v[1]
          }
        },
        {
          "eq": {
            "fCurrentProcessorId": context.user()
          }
        }
      ]
    }]
    api.projectMainList( {
      query: timeQuery
    }).then(response => {
      data.value = response.data.list;
    });
  }

  // 分页相关方法
  const fetchListWithPagination = async () => {
    var auths = storage.get("auths")
    var param = {}

    //排序条件数组
    var sort = [];
    //总的query
    var queryAnd = {}
    var query = []
    //2024-09-08 管理员不受当前处理人条件控制
    if (storage.get("auths") && storage.get("auths").includes("AUTH_ADMIN")) {
    } else {
      query.push({
        "eq": {
          "fCurrentProcessorId": context.user()
        }
      })
    }
    query.push({
      "neq": {
        "fAuditStatus": "1"
      }
    })
    if (filters.fProjectName !== "") {
      query.push({
        "contains": {
          "fName": filters.fProjectName
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
    // queryAnd = [{ "and": query }]
    queryAnd.query = query;


    /* if(sortStatus==1){
      sort.push("fSubmittalTime desc")
    }else if(sortStatus==2){
      sort.push("fSubmittalTime asc")
    } */

    /* 排序 */
    if (orderBy.value.length != 0) {
      param.sort = orderBy.value
    }
    // if (sort.length == 0) {
    //   queryAnd = []
    // } else {
    //   queryAnd = [{ "and": query }]
    // }
    param.query = query
    const response = await api.projectMainList(param);
    if (response.data.list) {
      data.value = response.data.list
    }
  }



  onMounted(() => {
    fetchListWithPagination();
  });

  const handleFilterChange = async (v) => {
    fetchListWithPagination();
  };


  const handleFilterOwner = () => {
    fetchListWithPagination();
  }

  const handleFilterManager = () => {
    fetchListWithPagination();
  }

  /**项目经理排序 */
  //项目经理
  const fDeptManager = reactive({})
  const projectManagerFilter = () => {
    if (fDeptManager.fId == null || fDeptManager.fId == "") {
      alert("未选择项目经理")
      return;
    }
    var query = [{
      "and": [{
          "eq": {
            "fDeptManager.fId": fDeptManager.fId
          }
        }, {
          "eq": {
            "fCurrentProcessorId": context.user()
          }
        },
        {
          "neq": {
            "fAuditStatus": "1"
          }
        }
      ]
    }]
    api.projectMainList( {
      query: query
    }).then(response => {
      data.value = response.data.list;
    });
  }

  const fSubmittalTime = () => {
    sortStatus = sortStatus + 1
    if (sortStatus == 3) {
      sortStatus = 0;
    }
    fetchListWithPagination();

  }

  /* 排序相关 */

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
    fetchListWithPagination()
  }
</script>

<style></style>
