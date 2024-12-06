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
                <n-input placeholder="请输入项目名称" @blur="handleFilterChange" v-model:value="filters.fProjectName"
                  style="width: 300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>项目编号：</span>
                <n-input placeholder="请输入项目编号" @blur="fProjectNoFilterChange" v-model:value="filters.fProjectNo"
                  style="width:300px;" />
              </n-space>
            </n-gi>
            <n-gi>
              <n-space style="align-items:center">
                <span>公告名称：</span>
                <n-input placeholder="请输入公告名称" @blur="fNoticeFilterChange" v-model:value="filters.fNoticeName"
                  style="width: 300px;" />
              </n-space>
            </n-gi>
          </n-grid>
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
    useMessage,
    useDialog,
  } from "naive-ui";
  import storage from "@/utils/storage";
  import context from '@/context.js'

  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const dialog = useDialog();
  const emit = defineEmits(['change']);
  const fDeptManager = reactive({})
  const pagination = reactive({
    page: 1,
    pageSize: 50,
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

  const filters = reactive({
    fProjectName: "",
    fProjectNo: "",
    fNoticeName: "",
  })

  const columns = [{
    title: '序号',
    key: 'index',
    render(row, index) {
      return index + 1;
    }
  }, {
    title: '项目编号',
    key: 'fProjectId.fProtocolNo'
  }, {
    title: '项目名称',
    key: 'fProjectId.fName'
  }, {
    title: '业主',
    key: 'fProjectId.fOwner'
  }, {
    title: '公告名称',
    key: 'fNotice.fAnnouncementTitle'
  }, {
    title: '操作',
    key: 'options',
    render(row) {
      return [h(
        NButton, {
          onClick: async () => {
            dialog.warning({
              title: '提示',
              content: '导入后会覆盖现有填写内容，是否确认导入？',
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: async () => {
                //选择创建联合体对应关系
                const response = await api.mainGetHistoryData({
                  historyId: row.fId,
                  fId: props.fMainId,
                  companyId: context.user(),
                });
                //TODO 刷新页面
                // emit('update-fHistoryMainId', row.fId);
                emit('update-historyShow');
              }
            })
          }
        }, '选择',
      ), ]
    }
  }]


  const props = defineProps({
    fHistoryMainId: String,
    fMainId: String,
    fIsUnion: String //公告是否 支持联合体
  })

  const showModal = ref(false)
  const message = useMessage();
  const data = ref([]);


  const fetchList = async (query) => {
    try {
      var or = [];
      var query = {
        'query': [{
          'and': or
        }, {
          'and': [{
            'eq': {
              'fSupplier.fId': context.user()
            },
          }, {
            'eq': {
              'fNotice.fIsUnion': props.fIsUnion
            },
          }, {
            'eq': {
              'fCurrentStatus': 2
            },
          }, {
            'lteq': {
              'fNotice.fApplicationDocumentDeadline': new Date()
            },
          }]
        }]
      }
      if (filters.fProjectName !== "") {
        or.push({
          'contains': {
            'fProjectId.fName': filters.fProjectName
          },
        })
      }
      if (filters.fProjectNo !== "") {
        or.push({
          'contains': {
            'fProjectId.fProtocolNo': filters.fProjectNo
          },
        })
      }
      if (filters.fNoticeName !== "") {
        or.push({
          'contains': {
            'fNotice.fAnnouncementTitle': filters.fNoticeName
          },
        })
      }
      if (or.length === 0) {
        data.value.length = 0
        otherList()
        return
      }
      const response = await api.supplierMainList(query);
      if (response.data.list) {
        data.value = response.data.list
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const otherList = async () => {
    try {
      const response = await api.supplierMainList({
        'query': [{
          'and': [{
            'eq': {
              'fSupplier.fId': context.user()
            },
          }, {
            'eq': {
              'fNotice.fIsUnion': props.fIsUnion
            },
          }, {
            'eq': {
              'fCurrentStatus': 2
            },
          }, {
            'lteq': {
              'fNotice.fApplicationDocumentDeadline': new Date()
            },
          }]
        }]
      });
      if (response.data.list) {
        data.value.push(...response.data.list)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  onMounted(async () => {
    otherList();
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
  const fNoticeFilterChange = (v) => {
    fetchList();
  };
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
