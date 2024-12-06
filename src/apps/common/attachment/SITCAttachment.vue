<!-- 附件控件 -->
<!-- 控件参数
	disabled : 布尔值；非必填；默认为false；决定控件为编辑或查看页面；(true=view; false=edit)
	extraButtons : 对象数组；非必填；额外的批量区操作按钮；
		[{label:显示文字; click:点击事件; editShow:布尔值，是否在编辑页面显示，默认false; viewShow：布尔值，是否在查看页面显示，默认false}]
	extraLineButtons : 对象数组；非必填；额外的单附件操作按钮；
		[{label:显示文字; icon:图标; click:点击时间; tooltip:悬停信息;  editShow:布尔值，是否在编辑页面显示，默认false; viewShow：布尔值，是否在查看页面显示，默认false}]（图标优先文字显示）
	fkey : 字符串；必填；附件组fkey
	modelName : 字符串；必填；附件所属表
	modelId ： 字符串；必填；附件所属表单
	linkPackage : 布尔值，非必填，默认为false；为true时自动增加“批量修改包件”和“修改包件”按钮，并且在上传附件时，增加选择关联包件
  projectId : 字符串；linkPackage为true时必填，用于获取AppProjectMain的所有包件，当modelName不为projectMain时，实际可选包件会再根据modelId做删减
	hasApproval : 布尔值，非必填，默认为false；为true时自动增加“审批”按钮
  title : 字符串，用于产品成果校验流程的名称，传递给产品成果校验流程，字段内容为该附件组的名称
  // 2024-10-10 修改
  //fileType : 字符串 传入ppt/pdf 校验只能上传该类文件 目前只有ppt/pdf判断
  fileType : 字符串，非必填，传入带"."，以","分割的文件后缀名，限制上传文件格式，不填时不限制
  multiple : 布尔值，非必填，最多文件数，不填时默认为多选
 -->
<template>
  <attachment
    :disabled="$props.disabled"
    :files="files"
    :fkey="$props.fkey"
    :title="$props.title"
    :extraButtons="extraButtons"
    :extraLineButtons="extraLineButtons"
    :modelId="$props.modelId"
    :linkPackage="$props.linkPackage"
    :modelName="$props.modelName"
    ref="baseAttachment"
    :picture="false"
    @afterSaveAttachment="saveAttachmentPackage"
    @loadPackageFunc="initPackages"
    :fileType="$props.fileType"
    :multiple="$props.multiple"
  >
  </attachment>
  <n-modal
    v-model:show="selectPackage"
    style="width: 60%"
    preset="dialog"
    title="选择关联包件"
    :mask-closable="false"
  >
    <n-space vertical>
      <span>此处选择关联包件</span>
      <n-checkbox
        value="all"
        label="全选"
        @update:checked="changeAll"
        :checked="packageAll"
      ></n-checkbox>
      <n-checkbox-group
        v-model:value="selectedPackages"
        @update:value="updateSelect"
      >
        <n-checkbox
          v-for="baojian in baojians"
          :value="baojian.value"
          :label="baojian.name"
        >
        </n-checkbox>
      </n-checkbox-group>
      <n-space>
        <n-button type="primary" @click="shouUploadModal">确认</n-button>
        <n-button type="error" @click="closeSelectPackage">取消</n-button>
      </n-space>
    </n-space>
  </n-modal>

  <n-modal
    v-model:show="selectPackage1"
    style="width: 80%"
    preset="dialog"
    title="修改关联包件"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="false"
  >
    <n-card :bordered="false">
      <n-form ref="formRef" label-placement="left" label-width="150px">
        <n-grid :x-gap="12" :y-gap="8" :cols="2">
          <n-grid-item span="2">
            <n-table :bordered="false">
              <thead>
                <tr>
                  <th>文件名称</th>
                  <th>所关联包件</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="val in updateAttPackageList">
                  <td>
                    {{ val.fileInfo.fFileName }}
                  </td>
                  <td>
                    <n-checkbox-group v-model:value="val.package">
                      <n-space>
                        <n-checkbox
                          v-for="baojian in baojians"
                          :value="baojian.value"
                          >包件{{ baojian.index }}:{{
                            baojian.name
                          }}</n-checkbox
                        >
                      </n-space>
                    </n-checkbox-group>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-grid-item>

          <n-grid-item style="display: flex; justify-content: center" span="2">
            <n-space>
              <n-button type="primary" @click="updateAttPackage">
                确认
              </n-button>
              <n-button type="error" @click="closeAttPackage"> 关闭 </n-button>
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script setup>
import { computed, defineComponent, getCurrentInstance, reactive } from 'vue'
import {
  Document,
  MusicalNotes,
  Videocam,
  Text,
  Trash,
  Reader,
  ListCircle,
  Image,
  Film,
  Eye,
  Download,
  Pencil,
} from '@vicons/ionicons5'
import { useMessage, useDialog } from 'naive-ui'
import attachment from '@/apps/common/attachment/attachment.vue'
import MyUploader from '@/apps/common/attachment/my-uploader.vue'
import createApi from './api'
import moment from 'moment'
import { useRoute, useRouter } from 'vue-router'
import baseUrl from '@/utils/baseUrl'

const props = defineProps([
  'disabled',
  'extraButtons',
  'extraLineButtons',
  'title',
  'fkey',
  'linkPackage',
  'modelName',
  'modelId',
  'projectId',
  'hasApproval',
  'fileType',
  'multiple'
])

const api = createApi(getCurrentInstance())
const route = useRoute()

if (props.disabled == undefined) {
  props.disabled = false
}

const { proxy } = getCurrentInstance()

//附件，在attachment.vue中加载初始化
const files = reactive([])

//包件
const baojians = ref([])
provide('attachmentPackages', baojians)
//选择的关联包件
const selectedPackages = ref([])
//是否全选包件
const packageAll = ref(true)

//包件信息初始化
function initPackages() {
  baojians.value.length = 0
  selectedPackages.value.length = 0
  var param = {}
  var query = []
  query.push({
    eq: {
      'fMainId.fId': props.projectId,
    },
  })
  param['and'] = query
  api
    .projectPackageList({
      query: param,
    })
    .then(function (response) {
      if (response.status == 200) {
        var list = response.data.list
        for (var i = 0; i < list.length; i++) {
          baojians.value.push({
            value: list[i].fId,
            name: list[i].fName,
            index: list[i].fIndex,
          })
        }
        // 在非AppsProjectMain中，实际可选包件需要根据实际表处理，因此需要进行去不可选择包件计算
        if (
          props.modelName !=
            'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain' &&
          props.modelId
        ) {
          /* 非项目附件*/
          // var url = '/pm'
          var query2 = {}
          var param2 = []
          if (
            props.modelName ==
            'com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff'
          ) {
            /* 启动会附件 */
            // url += '/meeting/package/list'
            param2.push({
              eq: {
                'fMeetingId.fId': props.modelId,
              },
            })
          } else if (
            props.modelName ==
            'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult'
          ) {
            /* 征集结果附件 */
            // url += '/meeting/package/list'
            param2.push({
              eq: {
                'fMeetingId.fModelId': props.modelId,
              },
            })
          } else if (
            props.modelName ==
            'com.qkinfotech.core.tendering.model.apps.report.AppsReport'
          ) {
            /* 汇报评审附件 */
            // url += '/meeting/package/list'
            param2.push({
              eq: {
                'fMeetingId.fModelId': props.modelId,
              },
            })
          } else if (
            props.modelName ==
            'com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting'
          ) {
            // url += '/meeting/package/list'
            param2.push({
              eq: {
                'fMeetingId.fModelId': props.modelId,
              },
            })
          }
          if (param2.length > 0) {
            query2['and'] = param2
            api
              .meetingPackageList({
                query: query2,
              })
              .then(function (res2) {
                if (res2.status == 200) {
                  var list2 = res2.data.list
                  if (list2.length > 0) {
                    baojians.value.length = 0
                  }
                  for (var i = 0; i < list2.length; i++) {
                    var bj = {}
                    bj["value"] = list2[i].fPackageId.fId
                    bj["name"] = list2[i].fPackageId.fName
                    bj["index"] = list2[i].fPackageId.fIndex
                    baojians.value.push(bj)
                  }
                }
                changeAll(true)
              })
              .catch(function (err) {
                changeAll(true)
              })
          } else {
            changeAll(true)
          }
        } else {
          changeAll(true)
        }
      }
    })
}
if (props.projectId) {
  initPackages()
}

//包件全选，取消全选
function changeAll(val) {
  packageAll.value = val
  selectedPackages.value.length = 0
  if (val) {
    for (var i = 0; i < baojians.value.length; i++) {
      selectedPackages.value.push(baojians.value[i].value)
    }
  }
}
//包件选择
function updateSelect(value, action) {
  if (action.actionType == 'uncheck') {
    packageAll.value = false
  } else if (
    action.actionType == 'check' &&
    value.length == baojians.value.length
  ) {
    packageAll.value = true
  }
}

const selectPackage = ref(false)
const selectPackage1 = ref(false)
const message = useMessage()
const dialog = useDialog()
const extraButtons = reactive([])
const extraLineButtons = reactive([])

if (props.extraButtons) {
}
if (props.linkPackage) {
  //2024-09-11 不再多进行一次包件选择，而是直接用上传附件进行包件选择
  /*extraButtons.push({
      click: function() {
        selectPackage.value = true
        initPackages()
      },
      key: 'upload'
    })*/
  extraButtons.push({
    label: '批量修改关联包件',
    click: function () {
      initPackages()
      openUpdateAttPackage()
    },
    editShow: true,
    viewShow: false,
  })
  extraButtons.push({
    key: 'delete',
    click: async function () {
      if (proxy.$refs.baseAttachment.attachmentCheckboxs.length == 0) {
        message.error('请选择要删除的附件')
        return
      }
      //先删除关联包件信息，才能删除附件信息
      dialog.warning({
        title: '警告',
        content: '是否删除所选附件？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          message.info('批量删除中，请稍候！')
          var deleteNum = 0
          var isoCantDelText = ''
          for (
            var i = 0;
            i < proxy.$refs.baseAttachment.attachmentCheckboxs.length;
            i++
          ) {
            var attId = proxy.$refs.baseAttachment.attachmentCheckboxs[i]
            if (attId == 'all') {
              deleteNum++
              continue
            }

            if (props.hasApproval) {
              var attMain
              for (
                var j = 0;
                j < proxy.$refs.baseAttachment.files.length;
                j++
              ) {
                if (proxy.$refs.baseAttachment.files[j].fId == attId) {
                  attMain = proxy.$refs.baseAttachment.files[j]
                }
              }

              //只要有发起iso审批的就不能删除该附件
              var isoQuery = { eq: { 'fAttachments.fId': attId } }
              var isoRes = await api
                .isoApprovalList({ query: isoQuery })
                .then(function (res) {
                  return res
                })
              if (isoRes.status == 200 && isoRes.data.total == 0) {
              } else {
                isoCantDelText += attMain.fFileName + '；'
                continue
              }
            }

            var param = {}
            var query = []
            query.push({
              eq: {
                'fAttachmentId.fId': attId,
              },
            })
            param['and'] = query
            await api
              .packageList({
                query: param,
              })
              .then(async function (res) {
                var attId2 = attId
                if (res.status == 200) {
                  var list = res.data.list
                  var ids = []
                  for (var j = 0; j < list.length; j++) {
                    ids.push(list[j].fId)
                  }
                  await api
                    .packageDelete({ fId: ids })
                    .then(async function (res2) {
                      await api
                        .attachmentControllerDelete({ id: attId2 })
                        .then(function (response) {
                          if (response.status == 200) {
                            deleteNum++
                          }
                        })
                    })
                }
              })
          }
          if (isoCantDelText != '') {
            dialog.warning({
              content: isoCantDelText + '已被关联，无法删除',
            })
          }
          message.success('批量删除完成!')
          proxy.$refs.baseAttachment.init()
        },
      })
    },
  })
}
if (props.hasApproval) {
  extraButtons.push({
    label: '成果产品检验流转',
    click: function () {
      //必须选择附件进行检验流转
      if (proxy.$refs.baseAttachment.attachmentCheckboxs.length == 0) {
        message.error('请先选择需要校验的附件！')
      } else {
        if (
          proxy.$refs.baseAttachment.attachmentCheckboxs.length == 1 &&
          proxy.$refs.baseAttachment.attachmentCheckboxs[0] == 'all'
        ) {
          message.error('请先选择需要校验的附件！')
        } else {
          var attIds = []
          for (
            var i = 0;
            i < proxy.$refs.baseAttachment.attachmentCheckboxs.length;
            i++
          ) {
            if (proxy.$refs.baseAttachment.attachmentCheckboxs[i] != 'all') {
              attIds.push(proxy.$refs.baseAttachment.attachmentCheckboxs[i])
            }
          }
          //已经发起检验流转的附件，不可再选择，在发起流转时校验并提示
          var query = { in: { 'fAttachments.fId': attIds } }
          var param = { query: query, distinct: true }
          api.isoApprovalList(param).then(function (res) {
            if (res.status == 200) {
              var isoList = res.data.list
              if (isoList.length > 0) {
                var checkedFileNames = []
                for (var i = 0; i < isoList.length; i++) {
                  for (var j = 0; j < isoList[i].fAttachments.length; j++) {
                    var attId = isoList[i].fAttachments[j].fId
                    var attFileName = isoList[i].fAttachments[j].fFileName
                    if (attIds.indexOf(attId) >= 0) {
                      if (checkedFileNames.indexOf(attFileName) < 0) {
                        checkedFileNames.push(attFileName)
                      }
                    }
                  }
                }
                dialog.warning({
                  title: '以下附件已发起检验流转，请移除！',
                  content: checkedFileNames.join('；\r\n'),
                  positiveText: '确认',
                })
              } else {
                if (
                  props.modelName ==
                  'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain'
                ) {
                  window.open(
                    baseUrl.pmUrl +
                      '/view/projectManagement/implementation/project-iso-edit?projectId=' +
                      props.modelId +
                      '&attIds=' +
                      attIds +
                      '&name=' +
                      (props.title ? props.title : '未命名'),
                    '_blank',
                  )
                } else {
                  window.open(
                    baseUrl.pmUrl +
                      '/view/projectManagement/implementation/project-iso-edit?projectId=' +
                      props.projectId +
                      '&attIds=' +
                      attIds +
                      '&name=' +
                      (props.title ? props.title : '未命名'),
                    '_blank',
                  )
                }
              }
            } else {
              message.error('校验附件是否已发起校验流转失败，请重试！')
            }
          })
        }
      }
    },
    editShow: true,
    viewShow: false,
  })
}

if (props.extraLineButtons) {
}
if (props.linkPackage) {
  extraLineButtons.push({
    label: '删除',
    icon: Trash,
    click: function (target) {
      dialog.warning({
        title: '警告',
        content: '是否删除此附件？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          if (props.hasApproval) {
            var attMain
            for (var j = 0; j < proxy.$refs.baseAttachment.files.length; j++) {
              if (proxy.$refs.baseAttachment.files[j].fId == target.fId) {
                attMain = proxy.$refs.baseAttachment.files[j]
              }
            }
            //只要有发起iso审批的就不能删除该附件
            var isoQuery = { eq: { 'fAttachments.fId': target.fId } }
            var isoRes = await api
              .isoApprovalList({ query: isoQuery })
              .then(function (res) {
                return res
              })
            if (isoRes.status == 200 && isoRes.data.size == 0) {
            } else {
              dialog.warning({
                content: '该附件已被关联，无法删除',
              })
              return
            }
          }

          var param = {}
          var query = []
          query.push({
            eq: {
              'fAttachmentId.fId': target.fId,
            },
          })
          param['and'] = query
          await api
            .packageList({
              query: param,
            })
            .then(function (res) {
              if (res.status == 200) {
                var list = res.data.list
                var ids = []
                for (var j = 0; j < list.length; j++) {
                  ids.push(list[j].fId)
                }
                api.packageDelete({ fId: ids }).then(function (res2) {
                  api
                    .attachmentControllerDelete({ id: target.fId })
                    .then(function (response) {
                      message.success('删除成功!')
                      proxy.$refs.baseAttachment.files.splice(
                        proxy.$refs.baseAttachment.files.indexOf(target),
                        1,
                      )
                    })
                    .catch(function (error) {
                      message.error(error.message, {
                        closable: true,
                        duration: 0,
                      })
                    })
                })
              }
            })
        },
      })
    },
    tooltip: '删除',
    editShow: true,
    viewShow: false,
    key: 'delete',
  })
}

function shouUploadModal() {
  if (selectedPackages.value.length == 0) {
    message.warning('请关联包件！')
    return
  }
  proxy.$refs.baseAttachment.openUploader()
  selectPackage.value = false
}

function closeSelectPackage() {
  selectPackage.value = false
}

//关联附件信息
function saveAttachment(file) {
  //selectPackage.value = false
  var form = {
    fFileName: file.name,
    fFile: {
      fId: file.fId,
    },
    fKey: props.fkey,
    fModelName: props.modelName,
    fModelId: props.modelId,
    fId: '',
  }
  api.mainInit().then(function (res) {
    form.fId = res.data.fId
    api.mainSave(form).then(function (res) {
      files.push({
        fFileName: file.name,
        fCreateTime: getNowTime(),
        fId: form.fId,
        fFileId: file.fId,
      })
    })
  })
}

//关联附件包件信息
async function saveAttachmentPackage(form) {
  for (var i = 0; i < selectedPackages.value.length; i++) {
    await api.packageList().then(function (res) {
      var packageId = selectedPackages.value[i]
      var packageForm = {}
      packageForm.fId = res.data.fId
      packageForm.fAttachmentId = {
        fId: form.fId,
      }
      packageForm.fPackageId = {
        fId: packageId,
      }
      api.packageSave(packageForm).then(function (res2) {})
    })
  }
}

function getNowTime() {
  moment().locale('zn-cn')
  return moment().format('YYYY-MM-DD')
}

const updateAttPackageList = ref([])
//打开批量修改包件弹窗，需要校验是否勾选附件，读取附件，读取附件包件
async function openUpdateAttPackage() {
  updateAttPackageList.value.length = 0
  if (proxy.$refs.baseAttachment.attachmentCheckboxs.length == 0) {
    message.warning('请先勾选需要修改包件信息的附件！')
    return
  }
  for (var i = 0; i < proxy.$refs.baseAttachment.files.length; i++) {
    var file = proxy.$refs.baseAttachment.files[i]
    if (proxy.$refs.baseAttachment.attachmentCheckboxs.indexOf(file.fId) >= 0) {
      //读取当前关联包件
      var param = {}
      var query = []
      query.push({
        eq: {
          'fAttachmentId.fId': file.fId,
        },
      })
      param['and'] = query
      await api
        .packageList({
          query: param,
        })
        .then(function (res) {
          if (res.status == 200) {
            var list = res.data.list
            var packageIds = []
            var linkIds = []
            for (var j = 0; j < list.length; j++) {
              packageIds.push(list[j].fPackageId.fId)
              linkIds.push({
                packId: list[j].fPackageId.fId,
                linkId: list[j].fId,
              })
            }
            var info = {
              fileInfo: {
                fId: file.fId,
                fFileName: file.fFileName,
              },
              package: packageIds,
              oldPackage: linkIds,
            }

            updateAttPackageList.value.push(info)
          }
        })
    }
  }
  selectPackage1.value = true
}

function updateAttPackage() {
  //校验：批量修改包件要保证至少关联一个包件
  for (var i=0; i<updateAttPackageList.value.length; i++) {
    if (updateAttPackageList.value[i].package.length == 0) {
      message.error("附件至少需要关联一个包件")
      return
    }
  }
  var deleteIds = []
  var newForms = []
  for (var i = 0; i < updateAttPackageList.value.length; i++) {
    var tempVal = updateAttPackageList.value[i]
    //1.找出被移除的包件
    for (var j = 0; j < tempVal.oldPackage.length; j++) {
      var oldPack = tempVal.oldPackage[j]
      if (tempVal.package.indexOf(oldPack.packId) < 0) {
        deleteIds.push(oldPack.linkId)
      }
    }
    //2.添加新加的包件
    for (var j = 0; j < tempVal.package.length; j++) {
      var id = tempVal.package[j]
      var isOld = false
      for (var k = 0; k < tempVal.oldPackage.length; k++) {
        if (tempVal.oldPackage[k].packId == id) {
          isOld = true
        }
      }
      if (!isOld) {
        var form = {
          fId: '',
          fAttachmentId: {
            fId: tempVal.fileInfo.fId,
          },
          fPackageId: {
            fId: id,
          },
        }
        newForms.push(form)
      }
    }
  }
  api.packageDelete({ fId: deleteIds })
  if (newForms.length == 0) {
    message.info('操作完成')
    selectPackage1.value = false
  }
  var doneCount = 0
  for (var i = 0; i < newForms.length; i++) {
    api
      .packageSave(newForms[i])
      .then(function (res) {
        doneCount++
        if (doneCount == newForms.length) {
          message.info('操作完成')
          selectPackage1.value = false
        }
      })
      .catch(function (error) {
        message.error('发生错误！')
        message.error(error)
      })
  }
}

function closeAttPackage() {
  dialog.warning({
    title: '警告',
    content: '是否不进行保存，离开修改页面？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      selectPackage1.value = false
    },
  })
}
</script>

<style></style>
