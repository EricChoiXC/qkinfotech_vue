<template>
  <div>
    <n-space>
      <n-button type="info" @click="download">下载</n-button>
    </n-space>
  </div>
  <vue-office-docx
    :src="attachmentViewLink"
    @rendered="renderedHandler"
    @error="errorHandler"
    style="height: 80vh; width: 80vw"
    v-if="type == 'docx'"
  ></vue-office-docx>
  <vue-office-excel
    :src="attachmentViewLink"
    @rendered="renderedHandler"
    @error="errorHandler"
    style="height: 80vh; width: 80vw"
    v-else-if="type == 'xlsx'"
  ></vue-office-excel>
  <vue-office-pdf
    :src="attachmentViewLink"
    @rendered="renderedHandler"
    @error="errorHandler"
    style="height: 80vh; width: 80vw"
    v-else-if="type == 'pdf' || type == 'pptx' || type == 'ppt' || type == 'doc' || type == 'xls'"
  ></vue-office-pdf>
<!--  <div>
    <iframe
      style="height: 80vh; width: 80vw"
      id="pptIframe"
      :src="attachmentViewLink"
    ></iframe>
  </div>-->
  <n-alert type="error" v-else
    >很抱歉，该类型文档当前不支持在线预览，请下载查看！</n-alert
  >
</template>

<script setup>
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'
import Viewer from 'viewerjs'
import { useMessage } from 'naive-ui'
import baseUrl from '@/utils/baseUrl'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import createApi from './api'

const api = createApi(getCurrentInstance())
const message = useMessage()
const route = useRoute()

const attachmentViewLink = ref('')
const id = ref(route.query.fId)
const type = ref('')

onMounted(() => {
  loadAttachment()
})

function loadAttachment() {
  if (id.value) {
    api.sysFileLoad({ fId: id.value }).then(function (res) {
      if (res.status == 200) {
        var file = res.data
        try {
          type.value = file.fFileName.split('.').pop()
          if (type.value == 'pptx' || type.value == 'ppt') {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openPptToPdf?fId=' + id.value
          } else if (type.value == 'doc') {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openDocToHtml?fId=' + id.value
          } else if (type.value == 'xls') {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/openXlsToHtml?fId=' + id.value
          } else {
            attachmentViewLink.value =
              baseUrl.pmUrl + '/pm/file/open?fId=' + id.value
          }
        } catch (e) {}
      }
    })
  }
}

message.info('大文件预览加载需要一段时间，请稍候')

function download() {
  window.open(baseUrl.pmUrl + '/pm/file/download?fId=' + id.value)
}
</script>

<style></style>
