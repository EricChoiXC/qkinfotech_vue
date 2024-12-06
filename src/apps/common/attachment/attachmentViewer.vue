<template>
  <div>
    <n-space>
      <n-button type="info" @click="download">下载</n-button>
    </n-space>
  </div>
  <div style="text-align: center; display: flex; justify-content: center; align-items: center">
    <vue-office-docx :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
                     style="height: 80vh; width: 80vw" v-if="props.type == 'docx'"></vue-office-docx>
    <vue-office-excel :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
                      style="height: 80vh; width: 80vw" v-else-if="props.type == 'xlsx'"></vue-office-excel>
    <vue-office-pdf :src="attachmentViewLink" @rendered="renderedHandler" @error="errorHandler"
                    style="height: 80vh; width: 80vw"
                    v-else-if="props.type == 'pdf' || props.type == 'pptx' || props.type == 'ppt' || props.type == 'doc' || props.type == 'xls'"></vue-office-pdf>
    <!--        <div
              v-else-if="">
              <iframe style="height: 80vh; width: 80vw" id="pptIframe" :src="attachmentViewLink"></iframe>
            </div>-->
    <n-alert type="error" v-else>很抱歉，该类型文档当前不支持在线预览，请下载查看！</n-alert>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
import VueOfficeDocx from '@vue-office/docx'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficePdf from '@vue-office/pdf'
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'
import Viewer from 'viewerjs'
import {useMessage} from 'naive-ui'
import baseUrl from '@/utils/baseUrl'

const message = useMessage()

const props = defineProps(['id', 'link', 'type'])
const attachmentViewLink = ref("")

if (props.type == "pptx" || props.type == "ppt") {
  attachmentViewLink.value =
    baseUrl.pmUrl + "/pm/file/openPptToPdf?fId=" + props.id
} else if (props.type == "doc") {
  attachmentViewLink.value =
    baseUrl.pmUrl + "/pm/file/openDocToHtml?fId=" + props.id
} else if (props.type == "xls") {
  attachmentViewLink.value =
    baseUrl.pmUrl + "/pm/file/openXlsToHtml?fId=" + props.id
} else {
  attachmentViewLink.value =
    baseUrl.pmUrl + "/pm/file/open?fId=" + props.id
}
message.info("大文件预览加载需要一段时间，请稍候")

function download() {
  window.open(baseUrl.pmUrl + "/pm/file/download?fId=" + props.id)
}

</script>

<style>
</style>
