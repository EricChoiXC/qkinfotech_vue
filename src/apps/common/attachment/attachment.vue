<!-- 附件控件 -->
<!-- 控件参数
	disabled : 布尔值；非必填；默认为false；决定控件为编辑或查看页面；；(true=view; false=edit)
	extraButtons : 对象数组；非必填；额外的批量区操作按钮；
		[{label:显示文字; click:点击事件; editShow:布尔值，是否在编辑页面显示，默认false; viewShow：布尔值，是否在查看页面显示，默认false}]
		2024-05-29：增加key值，当key为upload, delete, download时，会将其对象的属性替换默认的上传附件，批量删除，批量下载按钮
	extraLineButtons : 对象数组；非必填；额外的单附件操作按钮；
		[{label:显示文字; icon:图标; click:点击时间; tooltip:悬停信息;  editShow:布尔值，是否在编辑页面显示，默认false; viewShow：布尔值，是否在查看页面显示，默认false}]（图标优先文字显示）
	fkey : 字符串；必填；附件组fkey
	modelName : 字符串；必填；附件所属表
	modelId ： 字符串；必填；附件所属表单
	picture: Boolean，非必填，为true时为单图片附件，默认为false
	size : Number，非必填，仅在picture=true时生效，为图片显示的尺寸大小，默认200(px)
  @afterSaveAttachment : 提交attachment_main保存后调用方法，如果有额外定制功能需要实现，可调用此：如附件关联项目包件信息
  // 2024-10-10 修改
  //fileType : 字符串 传入ppt/pdf 校验只能上传该类文件 目前只有ppt/pdf判断
  fileType : 字符串，非必填，传入带"."，以","分割的文件后缀名，限制上传文件格式，不填时不限制
  multiple : 布尔值，非必填，最多文件数，不填时默认为多选
 -->
<template>
  <div v-if="$props.picture">
    <!--    <n-avatar bordered=true :size="size" :src="picSrc" @click="changePic"></n-avatar>-->
    <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
      ">
      <div :style="{
          width: size + 'px',
          height: size + 'px',
          display: 'flex',
          background: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px dashed rgb(32, 56, 100)',
        }" @click="changePic">
        <img :src="picSrc" style="max-width: 100%; max-height: 100%" />
      </div>
      <div style="margin-top: 5px">
        <n-button v-if="!$props.disabled" type="info" style="width: 100px" @click="changePic">上传图片</n-button>
      </div>
    </div>
    <!-- <div :id="$props.modelName + $props.modelId + $props.fkey + 'div'" class="changePicDiv" style="display: none">更换图片</div> -->

    <n-modal v-model:show="uploadPicModal" style="width: 300px" preset="dialog" title="上传图片" :mask-closable="false">
      <pic-uploader :mode="$props.picture" @saveAttachment="saveAttachment"></pic-uploader>
    </n-modal>
  </div>
  <div v-else style="width: 100%">
    <n-grid :cols="1">
      <n-gi>
        <div style="padding: 5px">
          <n-space>
            <n-checkbox-group v-model:value="attachmentCheckboxs" @update:value="clickAttachmentCheckbox">
              <n-checkbox value="all">全选</n-checkbox>
            </n-checkbox-group>
            <div v-for="button in buttons">
              <n-button @click="button.click" text type="info" v-if="showButton(button)">
                {{ button.label }}
              </n-button>
            </div>
          </n-space>
        </div>
      </n-gi>
      <n-gi v-for="file in files" v-show="showAttachment(file)">
        <div style="padding: 5px">
          <n-grid :cols="4">
            <n-gi :span="3">
              <n-space>
                <p>
                  <n-checkbox-group v-model:value="attachmentCheckboxs" @update:value="clickAttachmentCheckbox">
                    <n-checkbox :value="file.fId"></n-checkbox>
                  </n-checkbox-group>
                </p>
                <p>
                  <n-icon v-if="fileSuffix(file) == 'doc'" size="20" :component="Document">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'ppt'" size="20" :component="Film">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'xls'" size="20" :component="ListCircle">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'img'" size="20" :component="Image">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'music'" size="20" :component="MusicalNotes">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'video'" size="20" :component="Videocam">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'txt'" size="20" :component="Text">
                  </n-icon>
                  <n-icon v-else-if="fileSuffix(file) == 'other'" size="20" :component="Reader">
                  </n-icon>
                </p>
                <p>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button text type="info">{{ file.fFileName }}</n-button>
                    </template>
                    {{ file.tooltip ? file.tooltip : file.fFileName }}
                  </n-tooltip>
                </p>
                <p>
                  {{ file.fCreateTime }}
                </p>
              </n-space>
            </n-gi>
            <n-gi>
              <n-space>
                <p v-for="button in lineButtons">
                  <n-tooltip trigger="hover" v-if="
                      (!$props.disabled && button.editShow) ||
                      ($props.disabled && button.viewShow)
                    ">
                    <template #trigger>
                      <!-- 		<n-button round circle @click="button.click" v-if="button.icon != ''">
												<template #icon>
													<n-icon :component="button.icon"></n-icon>
												</template>
											</n-button> -->
                      <n-button text circle @click="button.click(file)" v-if="button.icon != ''">
                        {{ button.label }}
                      </n-button>
                      <n-button round @click="button.click(file)" v-else-if="button.icon == ''">
                        {{ button.label }}
                      </n-button>
                    </template>
                    {{ button.tooltip }}
                  </n-tooltip>
                </p>
              </n-space>
            </n-gi>
          </n-grid>
        </div>
      </n-gi>
    </n-grid>
    <n-modal v-if="$props.linkPackage === false" v-model:show="uploadModal" style="width: 60%" preset="dialog"
      title="上传附件" :mask-closable="false" :close-on-esc="false" @after-hide="init">
      <my-uploader :multiple="$props.multiple" :fileType="$props.fileType" :mode="$props.picture" @saveAttachment="saveAttachment"
        :modelId="$props.modelId" :modelName="$props.modelName" :fkey="$props.fkey" @closeUploadModal="closeUploadModal"
        on-after-leave="closeUploadModal"></my-uploader>
    </n-modal>
    <n-modal v-if="$props.linkPackage === true" v-model:show="uploadModal" style="width: 60%" preset="dialog"
      title="上传附件" :mask-closable="false" :close-on-esc="false" :closable="false">
      <sitc-uploader @saveAttachment="savePackageAttachment" @closeUploadModal="closeUploadModal" @init="init"
        :modelName="$props.modelName" :modelId="$props.modelId" :fkey="$props.fkey" :linkPackage="$props.linkPackage"
        :multiple="$props.multiple" :fileType="$props.fileType"></sitc-uploader>
    </n-modal>
    <n-modal v-model:show="viewAttachment" style="width: 85%; height: 85%" preset="dialog" :mask-closable="false">
      <template #header>
        <n-button type="info" @click="openDownload">下载</n-button>
      </template>
      <div style="text-align: center; display: flex; justify-content: center; align-items: center">
        <vue-office-docx :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
          style="height: 80vh; width: 80vw" v-if="attachmentViewType == 'docx'"></vue-office-docx>
        <vue-office-excel :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
          style="height: 80vh; width: 80vw" v-else-if="attachmentViewType == 'xlsx'"></vue-office-excel>
        <vue-office-pdf :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
          style="height: 80vh; width: 80vw"
          v-else-if="attachmentViewType == 'pdf' || attachmentViewType == 'pptx' || attachmentViewType == 'ppt' || attachmentViewType == 'doc' || attachmentViewType == 'xls'"></vue-office-pdf>
        <!--        <div
          v-else-if="">
          <iframe style="height: 80vh; width: 80vw" id="pptIframe" :src="attachmentViewLink"></iframe>
        </div>-->
        <n-alert type="error" v-else>很抱歉，该类型文档当前不支持在线预览，请下载查看！</n-alert>
      </div>
    </n-modal>
  </div>
</template>

<script>
  import {
    defineComponent,
    reactive,
    getCurrentInstance
  } from 'vue'
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
  } from '@vicons/ionicons5'
  import {
    useMessage,
    useDialog
  } from 'naive-ui'
  import MyUploader from '@/apps/common/attachment/my-uploader.vue'
  import PicUploader from '@/apps/common/attachment/picUploader.vue'
  import moment from 'moment'
  import createApi from './api'
  import VueOfficeDocx from '@vue-office/docx'
  import VueOfficeExcel from '@vue-office/excel'
  import VueOfficePdf from '@vue-office/pdf'
  import '@vue-office/docx/lib/index.css'
  import '@vue-office/excel/lib/index.css'
  import baseUrl from '@/utils/baseUrl'
  import SitcUploader from '@/apps/common/attachment/sitcUploader.vue'

  export default defineComponent({
    components: {
      'sitc-uploader': SitcUploader,
      'my-uploader': MyUploader,
      'pic-uploader': PicUploader,
      VueOfficeDocx,
      VueOfficeExcel,
      VueOfficePdf,
    },
    props: {
      disabled: Boolean,
      /* 布尔值；非必填；默认为false；决定控件为编辑或查看页面 */
      files: Object,
      /* 附件数据（对象数组）（suffix:后缀名，fFileName:文件名，fCreateTime:创建时间） */
      extraButtons: Object,
      /* 对象数组；非必填；额外的批量区操作按钮 */
      extraLineButtons: Object,
      /* 对象数组；非必填；额外的单附件操作按钮； */
      title: String,
      /* 附件组名称*/
      fkey: String,
      /* 附件组关键字*/
      modelName: String,
      modelId: String,
      picture: Boolean,
      size: Number,
      linkPackage: {
        type: Boolean,
        default: false,
      },
      fileType: String,
      multiple: {
        type: Boolean,
        default: true,
      },
    },
    emits: ['afterSaveAttachment', 'loadPackageFunc'],
    setup(props, context) {
      const api = createApi(getCurrentInstance())
      const files = reactive([])
      const attachmentCheckboxs = ref([])
      if (props.files) {
        for (var i = 0; i < props.files.length; i++) {
          files.push(props.files[i])
        }
      }
      if (props.disabled == undefined) {
        props.disabled = false
      }
      if (props.picture == undefined) {
        props.picture = false
      }
      const size = ref(200)
      const picId = ref('')
      const picSrc = ref('')
      if (props.picture && props.size != undefined) {
        size.value = props.size
      }
      const editStatus = ref(props.status == 'edit')
      const buttons = reactive([]) /* 批量区按钮 */
      const message = useMessage()
      const dialog = useDialog()
      const uploadModal = ref(false)
      const uploadPicModal = ref(false)
      const viewAttachment = ref(false)

      async function openUploader() {
        var pptNumFlag = true;
        if (props.multiple == false) {
          //ppt只能上传一个附件 校验 之前是否已经上传过附件
          var param = []
          var eq = []
          if (props.modelName && props.modelId && props.fkey) {
            eq.push({
              eq: {
                fModelName: props.modelName,
              },
            })
            eq.push({
              eq: {
                fModelId: props.modelId,
              },
            })
            eq.push({
              eq: {
                fKey: props.fkey,
              },
            })
            eq.push({
              neq: {
                fDisplay: 1,
              },
            })
            param.push({
              and: eq,
            })
            await api
              .mainList({
                query: param,
                distinct: true,
              }).then(function(response) {
                if (response.data.list.length > 0) {
                  pptNumFlag = false;
                  message.warning("只能上传一个附件!")
                }
              })
          }
        }
        if (!pptNumFlag) {
          return
        }
        if (props.linkPackage) {
          context.emit('loadPackageFunc')
        }
        uploadModal.value = true
      }
      /* 批量区默认的三个按钮 */
      const uploadButton = reactive({
        label: '上传附件',
        click: function() {
          openUploader()
        },
        editShow: true,
        viewShow: false,
      })

      function deleteAll() {
        if (attachmentCheckboxs.value.length == 0) {
          message.info('请勾选要删除的文件')
          return
        }
        dialog.warning({
          title: '警告',
          content: '是否删除所选附件？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            message.info('批量删除中，请稍候！')
            var ids = []
            for (var i = 0; i < attachmentCheckboxs.value.length; i++) {
              if (attachmentCheckboxs.value[i] != 'all') {
                ids.push(attachmentCheckboxs.value[i])
              }
            }
            if (ids.length > 0) {
              api.mainDelete({
                fId: ids
              }).then(function(response) {
                if (response.status == 200) {
                  message.success('批量删除成功!')
                  init()
                }
              })
            }
          },
        })
      }
      const deleteAllButton = reactive({
        label: '批量删除',
        click: function() {
          deleteAll()
        },
        editShow: true,
        viewShow: false,
      })
      const downloadAllButton = reactive({
        label: '批量下载',
        click: function() {
          if (attachmentCheckboxs.value.length == 0) {
            message.info('请勾选要下载的文件')
            return
          }
          var ids = []
          for (var i = 0; i < files.length; i++) {
            if (attachmentCheckboxs.value.indexOf(files[i].fId) >= 0) {
              ids.push(files[i].fFileId)
            }
          }
          if (ids.length > 0) {
            var url = baseUrl.pmUrl + '/pm/file/downloadAll?fIds=' + ids
            window.open(url, '_target')
          }
        },
        editShow: true,
        viewShow: true,
      })
      buttons.push(uploadButton)
      buttons.push(deleteAllButton)
      buttons.push(downloadAllButton)

      /* 批量区的额外按钮，与自定义化后的默认按钮 */
      if (props.extraButtons) {
        for (var i = 0; i < props.extraButtons.length; i++) {
          var ext = props.extraButtons[i]
          if (!ext.key) {
            buttons.push({
              label: ext.label,
              click: ext.click,
              editShow: ext.editShow ? ext.editShow : false,
              viewShow: ext.viewShow ? ext.viewShow : false,
            })
          } else {
            if (ext.key == 'upload') {
              uploadButton.label = ext.label ? ext.label : uploadButton.label
              uploadButton.click = ext.click ? ext.click : uploadButton.click
              uploadButton.editShow = ext.editShow ?
                ext.editShow :
                uploadButton.editShow
              uploadButton.viewShow = ext.viewShow ?
                ext.viewShow :
                uploadButton.viewShow
            } else if (ext.key == 'delete') {
              deleteAllButton.label = ext.label ?
                ext.label :
                deleteAllButton.label
              deleteAllButton.click = ext.click ?
                ext.click :
                deleteAllButton.click
              deleteAllButton.editShow = ext.editShow ?
                ext.editShow :
                deleteAllButton.editShow
              deleteAllButton.viewShow = ext.viewShow ?
                ext.viewShow :
                deleteAllButton.viewShow
            } else if (ext.key == 'download') {
              downloadAllButton.label = ext.label ?
                ext.label :
                downloadAllButton.label
              downloadAllButton.click = ext.click ?
                ext.click :
                downloadAllButton.click
              downloadAllButton.editShow = ext.editShow ?
                ext.editShow :
                downloadAllButton.editShow
              downloadAllButton.viewShow = ext.viewShow ?
                ext.viewShow :
                downloadAllButton.viewShow
            }
          }
        }
      }

      const attachmentViewLink = ref('')
      const attachmentViewType = ref('docx')
      const attachmentViewDownloadLink = ref('')
      const attachmentViewOnloading = ref(false)
      const lineButtons = ref([]) /* 单附件操作按钮 */
      lineButtons.value.push({
        label: '预览',
        icon: Eye,
        click: function(target) {
          attachmentViewOnloading.value = true
          attachmentViewType.value =
            target.fFileName?.split('.')[target.fFileName.split('.').length - 1]
          attachmentViewDownloadLink.value =
            baseUrl.pmUrl + '/pm/file/download?fId=' + target.fFileId
          if (
            attachmentViewType.value == 'pptx' ||
            attachmentViewType.value == 'ppt'
          ) {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openPptToPdf?fId=' + target.fFileId
            message.info('大文件预览加载需要一段时间，请稍候')
          } else if (attachmentViewType.value == 'doc') {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openDocToHtml?fId=' + target.fFileId
            message.info('大文件预览加载需要一段时间，请稍候')
          } else if (attachmentViewType.value == 'xls') {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openXlsToHtml?fId=' + target.fFileId
            message.info('大文件预览加载需要一段时间，请稍候')
          } else {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/open?fId=' + target.fFileId
          }
          viewAttachment.value = true
        },
        tooltip: '预览',
        editShow: true,
        viewShow: true,
      })
      lineButtons.value.push({
        label: '下载',
        icon: Download,
        click: function(target) {
          window.open(baseUrl.pmUrl + '/pm/file/download?fId=' + target.fFileId)
        },
        tooltip: '下载',
        editShow: true,
        viewShow: true,
      })
      var deleteButton = {
        label: '删除',
        icon: Trash,
        click: function(target) {
          dialog.warning({
            title: '警告',
            content: '是否删除此附件？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              api.mainDelete({
                fId: target.fId
              }).then(function(response) {
                if (response.status == 200) {
                  files.splice(files.indexOf(target), 1)
                }
              })
            },
          })
        },
        tooltip: '删除',
        editShow: true,
        viewShow: false,
      }
      lineButtons.value.push(deleteButton)
      if (props.extraLineButtons) {
        for (var i = 0; i < props.extraLineButtons.length; i++) {
          var ext = props.extraLineButtons[i]
          if (ext.key == 'delete') {
            deleteButton.label = ext.label ? ext.label : deleteButton.label
            deleteButton.icon = ext.icon ? ext.icon : deleteButton.icon
            deleteButton.click = ext.click ? ext.click : deleteButton.click
            deleteButton.tooltip = ext.tooltip ?
              ext.tooltip :
              deleteButton.tooltip
            deleteButton.editShow = ext.editShow ?
              ext.editShow :
              deleteButton.editShow
            deleteButton.viewShow = ext.viewShow ?
              ext.viewShow :
              deleteButton.viewShow
          } else {
            lineButtons.value.push({
              label: ext.label,
              icon: ext.icon ? ext.icon : '',
              click: ext.click,
              tooltip: ext.tooltip ? ext.tooltip : ext.label,
              editShow: ext.editShow ? ext.editShow : false,
              viewShow: ext.viewShow ? ext.viewShow : false,
            })
          }
        }
      }

      function fileSuffix(file) {
        var suffix
        if (!file.suffix) {
          suffix =
            file.fFileName?.split('.')[file.fFileName.split('.').length - 1]
        } else {
          suffix = file.suffix
        }
        if (suffix == 'doc' || suffix == 'docx') return 'doc'
        else if (suffix == 'ppt' || suffix == 'pptx') return 'ppt'
        else if (suffix == 'xls' || suffix == 'xlsx') return 'xls'
        else if (suffix == 'pic' || suffix == 'img') return 'img'
        else if (suffix == 'mp3') return 'music'
        else if (suffix == 'mp4' || suffix == 'avi') return 'video'
        else if (suffix == 'txt' || suffix == 'sav') return 'txt'
        return 'other'
      }

      function showButton(button) {
        return (
          (!props.disabled && button.editShow) ||
          (props.disabled && button.viewShow)
        )
      }

      async function saveAttachment(file) {
        console.log(props.picture, picId.value)
        //只保留一个关联图片
        if (props.picture && picId.value !== '') {
          await api.mainDelete({
            fId: picId.value
          })
        }

        if (file.length > 0) {
          file = file[0]
        }
        var form = {
          fFileName: file.name,
          fFile: {
            fId: file.fId,
          },
          fKey: props.fkey,
          fModelName: props.modelName,
          fModelId: props.modelId,
        }
        await api.mainInit().then(function(response) {
          form.fId = response.data.fId
        })
        if (props.picture && picId.value != '') {
          form.fId = picId.value
        }
        form.fCreateTime = new Date()
        await api.mainSave(form).then(function(res) {
          if (props.picture) {
            picSrc.value = file.src
          } else {
            files.push({
              fFileName: file.name,
              fFileId: file.fId,
              fCreateTime: getNowTime(),
              fId: form.fId,
            })
          }
          message.info('提交成功！')
          //上传图片modal关闭
          uploadPicModal.value = false
          //init();
        })
        try {
          context.emit('afterSaveAttachment', form)
        } catch (e) {}
      }

      function getNowTime() {
        moment().locale('zn-cn')
        return moment().format('YYYY-MM-DD')
      }

      function changePic() {
        if (!props.disabled) {
          uploadPicModal.value = true
        }
      }

      /* 初始化后，显示图片 */
      function init() {
        var param = []
        var eq = []
        if (props.modelName && props.modelId && props.fkey) {
          eq.push({
            eq: {
              fModelName: props.modelName,
            },
          })
          eq.push({
            eq: {
              fModelId: props.modelId,
            },
          })
          eq.push({
            eq: {
              fKey: props.fkey,
            },
          })
          eq.push({
            neq: {
              fDisplay: 1,
            },
          })
          param.push({
            and: eq,
          })
          api
            .mainList({
              query: param,
              distinct: true,
            })
            .then(function(response) {
              files.length = 0
              attachmentCheckboxs.value.length = 0
              if (props.files) {
                for (var i = 0; i < props.files.length; i++) {
                  files.push(props.files[i])
                }
              }

              if (response.status == 200) {
                if (props.picture && response.data.list.length == 1) {
                  picId.value = response.data.list[0].fId
                  picSrc.value =
                    baseUrl.pmUrl +
                    '/pm/file/open?fId=' +
                    response.data.list[0].fFile.fId
                } else if (!props.picture) {
                  for (var i = 0; i < response.data.list.length; i++) {
                    var temp = response.data.list[i]
                    temp.fFileId = temp.fFile.fId
                    files.push(temp)
                  }
                }
              }
            })
        }
      }
      init()
      watch(
        () => props.modelId,
        () => {
          init()
        }, {
          deep: true,
        },
      )

      function clickAttachmentCheckbox(vals, target) {
        if (target.value == 'all') {
          attachmentCheckboxs.value.length = 0
          if (target.actionType == 'check') {
            attachmentCheckboxs.value.push('all')
            for (var i = 0; i < files.length; i++) {
              if (files[i].fId) {
                attachmentCheckboxs.value.push(files[i].fId)
              }
            }
          }
        } else {
          if (target.actionType == 'check') {
            if (attachmentCheckboxs.value.length == files.length) {
              attachmentCheckboxs.value.push('all')
            }
          } else {
            if (attachmentCheckboxs.value.indexOf('all') >= 0) {
              attachmentCheckboxs.value.splice(
                attachmentCheckboxs.value.indexOf('all'),
                1,
              )
            }
          }
        }
      }

      function openDownload() {
        window.open(attachmentViewDownloadLink.value)
      }

      function closeUploadModal() {
        //init()
        uploadModal.value = false
      }

      const selectedPackageId = inject('selectedPackageId')
      const selectedPackageName = inject('selectedPackageName')

      function showAttachment(file) {
        if (props.linkPackage != true) {
          return true
        }
        if (!selectedPackageId) {
          return true
        }
        if (selectedPackageId.value.length == 0) {
          return true
        }
        if (file.fPackages) {
          return (
            file.fPackages.filter((value) =>
              selectedPackageId.value.includes(value.fPackageId.fId),
            ).length > 0
          )
        }
        return true
      }

      //0911 基于新版附件上传做的含包件的附件提交
      async function savePackageAttachment(fileList) {
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i]
          if (file.status != 'success') {
            message.error(
              '文件：' + file.name + ' 未上传完成/上传失败，无法保存！', {
                duration: 0,
                closable: true,
              },
            )
            continue
          }
          var attachmentMainForm = {}
          await api.mainInit().then(function(response) {
            attachmentMainForm.fId = response.data.fId
          })
          attachmentMainForm.fFileName = file.name
          attachmentMainForm.fFile = {
            fId: file.fId,
          }
          attachmentMainForm.fKey = props.fkey
          attachmentMainForm.fModelName = props.modelName
          attachmentMainForm.fModelId = props.modelId
          attachmentMainForm.fPackages = file.packages.map((val) => {
            return {
              fPackageId: {
                fId: val,
              },
              fId: '',
              fAttachmentId: {
                fId: attachmentMainForm.fId,
              },
            }
          })
          attachmentMainForm.fCreateTime = new Date()
          await api.mainSave(attachmentMainForm).then(function(res) {
            if (res.status == '200') {
              files.push({
                fFileName: file.name,
                fFileId: file.fId,
                fCreateTime: getNowTime(),
                fId: attachmentMainForm.fId,
              })
            } else {
              message.error(file.name + '提交失败，请重试', {
                duration: 0,
                closable: true,
              })
            }
          })
        }
        closeUploadModal()
        init()
      }

      return {
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
        editStatus,
        fileSuffix,
        buttons,
        deleteButton,
        lineButtons,
        showButton,
        uploadModal,
        uploadPicModal,
        saveAttachment,
        getNowTime,
        changePic,
        picSrc,
        size,
        openUploader,
        deleteAll,
        picId,
        viewAttachment,
        attachmentViewLink,
        attachmentViewType,
        attachmentViewDownloadLink,
        attachmentViewOnloading,
        files,
        attachmentCheckboxs,
        clickAttachmentCheckbox,
        openDownload,
        init,
        closeUploadModal,
        selectedPackageId,
        selectedPackageName,
        showAttachment,
        savePackageAttachment,
      }
    },
  })
</script>

<style>
  .changePicDiv {
    background: #eee;
    top: -74px;
    height: 72px;
    width: 72px;
    position: relative;
    align-items: center;
    opacity: 0.9;
    text-align: center;
  }
</style>
