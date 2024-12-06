<template>
  <!--<div v-if="data.length > 0">
     <div v-if="data[0].status === '未创建'">
      <n-button v-if="!showActions " @click="addInfo">文件创建</n-button>
    </div>
  </div>-->
  <n-data-table :columns="columns" :data="data" :row-key="rowKey" @update:checked-row-keys="handleCheck" />
</template>

<script setup>
  import {
    defineComponent,
    ref
  } from "vue";
  import {
    useDialog,
    useMessage
  } from "naive-ui";
  import storage from '@/utils/storage.js'
  import supplierUtil from '../supplier/js/supplierUtil.js';
  import context from '@/context.js'

  import layout from "@/layout/layout";
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const isMultiple = ref(false);
  const showActions = ref(true); // 控制 true-模糊匹配 /false-精确匹配
  const route = useRoute();
  const id = route.query.noticeId; //ekp公告id 对应我们公告
  const message = useMessage();
  const dialog = useDialog();

  function renderTooltip(trigger, content) {
    return h(NTooltip, null, {
      trigger: () => trigger,
      default: () => content
    })
  }

  const columns = [{
    key: "file",
    title(row) {
      return renderTooltip(h('div', {
        style: {
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      }, "资格预审申请文件"))
    },
    children: [{
      title: "包件列表",
      key: "packageName"
    }, {
      title: "状态",
      key: "status",
      width: 200,
    }, {
      title: '操作',
      key: 'actions',
      width: 200,
      render(row) {
        return [
          (timeoutFlag.value && row.status !== '未创建') && (
            h(
              NButton, {
                onClick: () => {
                  viewInfo(row);
                }
              }, '文件查看',
            )
          ),
          (row.supplierId !== undefined && !timeoutFlag.value) && (
            h(
              NButton, {
                onClick: () => {
                  editInfo(row);
                }
              }, '查看',
            )
          ),
          (row.supplierId === undefined && !timeoutFlag.value) && (
            h(
              NButton, {
                onClick: () => {
                  addInfo(row);
                }
              }, '创建资格预审申请文件',
            )
          )
        ];
      }
    }]
  }];

  const rowKey = (row) => row.id;
  const checkedRowKeysRef = ref([]);
  const handleCheck = (rowKeys) => {
    checkedRowKeysRef.value = rowKeys;
  }

  //查看
  const viewInfo = (row) => {
    window.open(context.path+"/view/supplier-view?fId=" + row.supplierId)
  }

  //编辑按钮 事件
  const editInfo = (row) => {
    window.open(context.path+"/view/supplier-edit?fId=" + row.supplierId)
  }
  //新增按钮 事件
  const addInfo = async (row) => {
    //模糊匹配 提醒
    // if (showActions.value) {
    // dialog.warning({
    //   title: '提示',
    //   content: '仅支持此公告下所有包件同时生成在线文档，已默认选中全部包件，请熟知！',
    //   positiveText: '确定',
    //   onPositiveClick: async () => {
    //     saveInfo(row)
    //   }
    // })
    // } else { //精确匹配 不提醒
    saveInfo(row)
    // }
  }

  const timeoutFlag = ref(false);
  const saveInfo = async (row) => {
    const PackageIds = [];
    if (showActions.value) { //模糊匹配
      for (var i = 0; i < row.packageId.length; i++) {
        PackageIds.push(row.packageId[i])
      }
    } else {
      PackageIds.push(row.packageId)
    }
    //创建
    await api.supplierMainSave({
      fProjectMain: {
        fId: row.mainId
      },
      fPackageIds: PackageIds,
      fNotice: {
        fId: row.noticeId
      },
      fSupplier: {
        fId: context.user()
      }
    }).then(result => {
      //fmainid 是资格申请id
      window.open(context.path+"/view/supplier-edit?fId=" + result.data.fMainId)
    });
  }

  const data = reactive([])
  //页面进入 判断是否超时,以及获取匹配模式
  const init = async () => {
    if (id === undefined) {
      return
    }
    // 根据公告的 申请文件截至日期 进行判断 是否可以进入该页面
    await api.noticeMainList({
      "query": [{
        "and": [{
          "eq": {
            "fEkpId": id
          }
        }]
      }]
    }).then(result => {
      const dataList = result.data.list;
      //判断是否在截至日期内
      if (dataList) {
        const deadline = new Date(dataList[0].fApplicationDocumentDeadline)
        const now = new Date();
        if (deadline >= now) {
          // 判断 是什么匹配方式  精确匹配/模糊匹配  公告里找
          if (dataList[0].fIsAccurateMatching === 'true') {
            showActions.value = true
          } else {
            showActions.value = false
          }
        } else { //超出提交日期
          timeoutFlag.value = true;
          // utils.handleError("超出申请文件提交日期！", 'package-view');
        }
      } else { //没有记录表示 错误
        handleError("没有找到公告记录！", 'package-view');
      }
    }).catch(err => {
      console.log(err)
    });

    //错误时限制弹窗
    function handleError(msg, tabKey) {
      dialog.error({
        title: "错误",
        content: msg,
        positiveText: "关闭",
        maskClosable: false,
        onEsc: () => {
          layout.close(tabKey);
        },
        onPositiveClick: () => {
          layout.close(tabKey);
        },
        onClose: () => {
          layout.close(tabKey);
        }
      });
    }

    //查询当前供应商 该项目所购买的包件
    const requestData = {
      "loginId": context.user(),
      "ekpId": id
    }

    await api.supplierMainPackageList(requestData).then(result => {
      const dataList = result.data;
      if (showActions.value) { //模糊匹配就合并成一个
        const object = {}; //模糊匹配 使用
        const packageIds = [];
        const packageNames = [];
        dataList.map(function(item, index) {
          object.index = 1 //序号
          packageIds.push(item.fPackage.fId);
          packageNames.push(item.fPackage.fName + ";");
          object.mainId = item.fProjectMain.fId //项目id
          object.noticeId = item.fNoticeMain.fId //公告id
          object.supplierId = item.supplierId; //供应商主表id
          if (item.status === 0) {
            object.status = '已创建' //状态
          } else if (item.status === 1) {
            object.status = '已保存' //状态
          } else if (item.status === 2) {
            object.status = '已递交' //状态
          } else {
            object.status = '未创建' //状态
          }
        });
        object.packageId = packageIds;
        object.packageName = packageNames;
        data.push(object)
      } else {
        dataList.map(function(item, index) {
          const obj = {};
          obj.index = index //序号
          obj.packageId = item.fPackage.fId //包件id
          obj.packageName = item.fPackage.fName //包件名称
          obj.mainId = item.fProjectMain.fId //项目id
          obj.noticeId = item.fNoticeMain.fId //公告id
          obj.supplierId = item.supplierId; //供应商主表id
          if (item.status === 0) {
            obj.status = '已创建' //状态
          } else if (item.status === 1) {
            obj.status = '已保存' //状态
          } else if (item.status === 2) {
            obj.status = '已递交' //状态
          } else {
            obj.status = '未创建' //状态
          }
          data.push(obj)
        });
      }
    }).catch(err => {
      console.log(err)
    });
  }

  //初始化调用
  onMounted(() => {
    init();
  })
</script>

<style>
</style>
