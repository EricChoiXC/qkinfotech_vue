<!--
	上传附件页面，该页面保存的附件记录在sysFile和sysFileSlice表中
	入参:
		url：江伟添加的，现在基于Nginx集成的话该入参暂未使用，非必填
		mode：布尔值，非必填，ture时为图片
		saveAttachment：必填，返回的方法，调用后会返回成功保存起来的附件对象列表
    fileType : 字符串 传入ppt/pdf 校验只能上传该类文件 目前只有ppt/pdf判断
 -->
<template>
  <div class="upload-container">
    <label ref="uploadLabel" class="uploader" v-if="$props.mode == true">
      <input
        style="display: none"
        type="file"
        ref="uploadPic"
        accept="image/*"
        @change="handlePicSelect"
      />
      <span class="upload-text">拖拽文件至此或点击上传</span>
      <img src="" alt="" id="uploadPicImg" style="display: none" />
      <n-avatar :size="72" :src="avaterSrc"></n-avatar>
    </label>
    <label ref="uploadLabel" class="uploader" v-else>
      <input
        style="display: none"
        type="file"
        ref="uploadFile"
        @change="handleFileSelect"
        :multiple="$props.multiple"
        :accept="$props.fileType"
      />
      <span class="upload-text">拖拽文件至此或点击上传</span>
    </label>
    <input
      style="display: none"
      type="file"
      ref="uploadFolder"
      @change="handleFolderSelect"
      webkitdirectory
    />
    <n-space>
      <n-button type="info" @click="selectFile">选择文件</n-button>
      <!-- <n-button type="info" @click="downloadFile(null)">全部下载</n-button> -->
    </n-space>
    <table class="file-list">
      <thead>
        <tr class="center-text">
          <th v-if="props.mode == 'pic'">图片预览</th>
          <th>文件名</th>
          <th>类型</th>
          <th>大小</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="fileInfo in fileInfoList"
          :key="fileInfo.name"
          class="center-text"
        >
          <td v-if="props.mode == 'pic'" class="list-image">
            <img
              v-if="fileInfo.img"
              :src="fileInfo.img"
              alt="Preview"
              class="preview-image"
            />
          </td>
          <td>{{ fileInfo.name }}</td>
          <td>{{ fileInfo.type }}</td>
          <td>{{ (fileInfo.size / 1024 / 1024).toFixed(2) }} MB</td>
          <td>
            <div
              v-if="fileInfo.status !== 'waiting'"
              class="progress-container"
            >
              <div
                class="progress-bar"
                v-if="
                  fileInfo.status === 'progress' || fileInfo.status === 'abort'
                "
              >
                <div
                  class="progress"
                  :style="{ width: fileInfo.progress * 100 + '%' }"
                ></div>
              </div>
              <span
                class="progress-text-success"
                v-if="fileInfo.status === 'success'"
                >已完成</span
              >
              <span
                class="progress-text"
                v-if="
                  fileInfo.status === 'progress' || fileInfo.status === 'abort'
                "
              >
                {{ (fileInfo.progress * 100).toFixed(2) + '%' }}
              </span>
              <span
                class="progress-text-error"
                v-if="
                  fileInfo.status === 'error' || fileInfo.status === 'timeout'
                "
              >
                {{ fileInfo.msg }}
              </span>
            </div>
            <div
              v-if="fileInfo.status === 'waiting'"
              class="progress-container"
            >
              <span class="progress-text-wait">待上传</span>
            </div>
          </td>
          <td>
            <n-space>
              <n-button
                v-if="fileInfo.status === 'progress'"
                @click="pauseUpload(fileInfo)"
                type="error"
                >暂停</n-button
              >
              <n-button
                v-if="fileInfo.status === 'abort'"
                @click="resumeUpload(fileInfo)"
                type="primary"
                >继续</n-button
              >
              <!-- <n-button @click="removeFile(fileInfo)" type="error">删除</n-button> -->
              <n-button
                v-if="fileInfo.status === 'success'"
                @click="downloadFile(fileInfo)"
                type="info"
                >下载</n-button
              >
            </n-space>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="info">
      <span
        >文件数量:
        <span class="file-count">{{ fileInfoList.length }}</span></span
      >
      <span class="success-count"
        >成功上传: <span>{{ successCount }}</span></span
      >
      <span
        >总大小: <span class="total-size">{{ totalSize }} MB</span></span
      >
    </div>
    <n-space justify="center">
      <n-button type="primary" @click="startUpload">重新上传</n-button>
      <n-button type="primary" @click="close">关闭</n-button>
      <!-- <n-button type="primary" v-if="canReuploadFile" @click="saveAttachment">保存成功附件</n-button> -->
    </n-space>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import ProcessQueue from './queue.js'
import createApi from './api'
import { useMessage, useDialog } from 'naive-ui'
import baseUrl from '@/utils/baseUrl'

const api = createApi(getCurrentInstance())
const message = useMessage()
const dialog = useDialog()
const props = defineProps([
  'mode',
  'url',
  'modalShow',
  'modelId',
  'modelName',
  'fkey',
  'fileType',
  'multiple',
])
const emit = defineEmits(['saveAttachment', 'closeUploadModal'])

const existAttNames = []
const addFileNames = []

const uploadLabel = ref()
const uploadFile = ref()
const uploadFolder = ref()
const uploadPic = ref()
const fileInfoList = ref([])
const queue = new ProcessQueue()
const canReuploadFile = ref(false)
const avaterSrc = ref('')

const successCount = computed(
  () => fileInfoList.value.filter((file) => file.status === 'success').length,
)
const totalSize = computed(() =>
  (
    fileInfoList.value.reduce((total, file) => total + file.size, 0) /
    1024 /
    1024
  ).toFixed(2),
)

onMounted(async () => {
  uploadLabel.value.addEventListener('dragenter', handleEvent)
  uploadLabel.value.addEventListener('dragover', handleEvent)
  uploadLabel.value.addEventListener('drop', handleEvent)
  uploadLabel.value.addEventListener('dragleave', handleEvent)

  var existAttachments = await api.mainList({
    query: {
      and: [
        {
          eq: {
            fModelId: props.modelId,
          },
        },
        {
          eq: {
            fModelName: props.modelName,
          },
        },
        {
          eq: {
            fKey: props.fkey,
          },
        },
      ],
    },
  })
  if (
    existAttachments.status == '200' &&
    existAttachments.data.list.length > 0
  ) {
    existAttachments.data.list.forEach((val) => {
      if (!existAttNames.includes(val.fFileName)) {
        existAttNames.push(val.fFileName)
      }
    })
  }
})

function handleEvent(e) {
  e.preventDefault()
  if (e.type === 'drop') {
    uploadLabel.value.style.borderColor = '#d9d9d9'
    uploadLabel.value.style.color = '#d9d9d9'
    upload(e.dataTransfer.files)
  } else if (e.type === 'dragleave') {
    uploadLabel.value.style.borderColor = '#d9d9d9'
    uploadLabel.value.style.color = '#d9d9d9'
  } else {
    uploadLabel.value.style.borderColor = '#1890ff'
    uploadLabel.value.style.color = '#1890ff'
  }
}

function handleFileSelect(e) {
  upload(e.target.files)
}

function handleFolderSelect(e) {
  upload(e.target.files)
}

function selectFile() {
  if (props.mode) {
    uploadPic.value.click()
  } else {
    uploadFile.value.click()
  }
}

function selectFolder() {
  uploadFolder.value.click()
}

function upload(fileList) {
  const files = Array.from(fileList)
  if (props.mode === 'pic') {
    var allPic = true
    files.every((file) => {
      if (!/image/.test(file.type)) {
        allPic = false
        alert('请上传图片')
        return
      }
    })
    if (!allPic) {
      return
    }
  }
  var errorMessage = ''
  files.forEach((file) => {
    let fileInfo = reactive({
      file: file,
      name: file.name,
      type: file.type,
      size: file.size,
      fId: '',
      msg: '',
      progress: 0,
      status: 'waiting',
    })
    if (props.mode === 'pic') {
      queue.add(preview, fileInfo)
      fileInfoList.value.push(fileInfo)
      //transfer(fileInfo);
    } else {
      //校验：未允许格式
      if (props.fileType) {
        if (!checkStrEndWith(fileInfo.name, props.fileType.split(","))) {
          errorMessage += file.name + '不是可上传的格式文件！'
          return
        }
      }
      //校验：单文件上传
      if (props.multiple == false) {
        if (existAttNames.length > 0 || addFileNames.length > 0) {
          errorMessage += '只可上传一个附件，请先删除已有附件！'
          return
        }
      }
      //校验：同名文件
      if (existAttNames.includes(file.name) || addFileNames.includes(file.name)) {
        errorMessage += file.name + '与已上传文件同名，请勿重复上传！'
        return
      }
      addFileNames.push(file.name)
      fileInfoList.value.push(fileInfo)
      queue.add(transfer, fileInfo)
    }
  })
  if (errorMessage) {
    dialog.warning({
      content : errorMessage
    })
  }

  uploadFile.value.value = ''
}

function preview(fileInfo) {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsDataURL(fileInfo.file)
    reader.onload = (e) => {
      fileInfo.img = e.target.result
    }
    reader.onloadend = (e) => {
      resolve(fileInfo)
    }
  })
}

function removeFile(fileInfo) {
  const index = fileInfoList.value.indexOf(fileInfo)
  if (index > -1) {
    fileInfoList.value.splice(index, 1)
  }
}

function startUpload() {
  fileInfoList.value.forEach((fileInfo) => {
    if (
      fileInfo.status === 'waiting' ||
      fileInfo.status == 'error' ||
      fileInfo.status == 'timeout'
    ) {
      queue.add(transfer, fileInfo)
    }
  })
}

// 传输入口
function transfer(fileInfo) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    fileInfo.xhr = xhr

    // 配置上传事件
    xhr.upload.addEventListener('progress', (e) => {
      fileInfo.status = 'progress'
      if (e.lengthComputable) {
        var percentage = Math.round((e.loaded * 100) / e.total)
        if (percentage == 100) {
          percentage = 99
        }
        fileInfo.progress = percentage / 100
      }
    })

    xhr.upload.addEventListener('loadstart', (e) => {
      fileInfo.status = 'started'
    })

    xhr.upload.addEventListener('error', (e) => {
      fileInfo.status = 'error'
      fileInfo.msg = '出错了'
    })

    xhr.upload.addEventListener('abort', (e) => {
      fileInfo.status = 'abort'
    })

    xhr.upload.addEventListener('timeout', (e) => {
      fileInfo.status = 'timeout'
      fileInfo.status = '连接超时'
    })

    /* xhr.upload.addEventListener('load', e => {
        fileInfo.status = "success";
      }); */

    xhr.upload.addEventListener('loadend', (e) => {
      resolve(fileInfo)
    })

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          fileInfo.fId = JSON.parse(xhr.responseText).data.fId // 将服务器返回的响应数据存储到 fileInfo 中
          fileInfo.status = 'success'
          saveAttachment(fileInfo)
        } else {
          fileInfo.status = 'error'
          fileInfo.msg = xhr.statusText
        }
      }
    })

    let formData = new FormData()
    formData.append('file', fileInfo.file)
    // 配置请求
    //xhr.open('POST', props.url+"/file/upload", true);
    xhr.open('POST', baseUrl.pmUrl + '/pm/file/upload', true)
    // xhr.withCredentials = true; // 设置允许发送 cookie
    // 发送请求
    xhr.send(formData)
    // 对外 显示 pause，resume, cancel 按钮，
    // 点击后  xhr.abort， 列表 删除等等
  })
}

function pauseUpload(fileInfo) {
  if (fileInfo) {
    fileInfo.xhr.abort()
  }
}

function resumeUpload(fileInfo) {
  if (fileInfo) {
    queue.add(transfer, fileInfo)
  }
}

function downloadFile(fileInfo) {
  return new Promise((resolve, reject) => {
    // 如果 fileInfo 为空，则使用 fileInfoList 作为文件列表
    let files = fileInfo ? fileInfo : fileInfoList.value

    // 将 files 转换为数组
    let fileList = Array.isArray(files) ? [...files] : [files]
    let fIds = []

    // 如果 fileList 存在，则提取每个文件的 fId并且过滤掉为传输完毕的文件
    if (fileList) {
      fIds = fileList
        .filter((file) => file.status === 'success')
        .map((file) => file.fId)
    }

    let url = ''
    let params

    if (fileInfo) {
      url = baseUrl.pmUrl + '/pm/file/download?fId=' + fileInfo.fId
      params = {
        fId: fIds,
      }
    } else {
      url = baseUrl.pmUrl + '/pm/file/downloadAll?fIds=' + fIds
      params = {
        fIds: fIds,
      }
    }

    window.open(url, '_target')
  })
}

function saveAttachment(file) {
  emit('saveAttachment', file)
}

function handlePicSelect(e) {
  const reader = new FileReader()
  reader.onload = function (e) {
    document.getElementById('uploadPicImg').src = e.target.result
    avaterSrc.value = e.target.result
  }
  reader.readAsDataURL(e.target.files[0])
}

function close() {
  emit('closeUploadModal')
}

function checkStrEndWith(str, suffixs) {
  var result = false
  for (var i in suffixs) {
    if (str.endsWith(suffixs[i])) {
      result = true
    }
  }
  return result
}
</script>

<style scoped>
.upload-container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  font-family: SimSun, sans-serif;
  /* 更改字体为宋体 */
}

.uploader {
  width: 100%;
  height: 200px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.3s;
  color: #999;
  position: relative;
  margin-bottom: 20px;
  background: #f9f9f9;
}

.uploader:hover {
  border-color: #1890ff;
}

.uploader .upload-text {
  font-size: 16px;
  text-align: center;
  color: #666;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buttons button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buttons button:hover {
  background-color: #40a9ff;
}

/* 调整表格样式 */
.file-list {
  width: 100%;
  border-collapse: separate;
  /* 分离边框 */
  border-spacing: 0 10px;
  /* 增加行间距 */
  margin-bottom: 20px;
}

.list-image {
  align-content: center;
  text-align: center;
  width: 70px;
}

.file-list th,
.file-list td {
  padding: 10px;
  text-align: center;
  /* 保持文字居中 */
  border: none;
  /* 去掉单元格边框 */
}

.file-list th {
  background-color: #f2f2f2;
  border-bottom: 2px solid #d9d9d9;
}

.file-list td {
  background-color: white;
}

.file-list tr:nth-child(even) td {
  background-color: #f9f9f9;
}

.file-list tr td {
  border-radius: 8px;
  /* 添加圆角 */
}

.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 2px;
}

.info {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 16px;
}

.info .file-count,
.info .total-size {
  color: black;
}

.info .success-count {
  color: green;
}

.start-upload {
  display: flex;
  justify-content: flex-start;
}

.start-upload button {
  background-color: #52c41a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-upload button:hover {
  background-color: #73d13d;
}

/* 调整整体字体大小 */
.upload-container {
  font-size: 14px;
  /* 调整为较小字体 */
}

/* 表格文字居中 */
.file-list th,
.file-list td {
  text-align: center;
}

/* 增加行类名居中 */
.center-text th,
.center-text td {
  vertical-align: middle;
}

/* 按钮对齐 */
.buttons {
  justify-content: flex-start;
}

/* 信息对齐 */
.info {
  justify-content: flex-start;
}

/* 上传按钮对齐 */
.start-upload {
  justify-content: flex-start;
}

/* Operation buttons */
.pause-btn,
.progress-text-wait,
.download-btn {
  background-color: rgba(24, 144, 255, 0.3);
  /* 浅一点带透明的蓝色背景 */
  color: #002766;
  /* 深一点的蓝色文字 */
  border: 1px solid rgba(24, 144, 255, 0.3);
  /* 边框颜色与背景色一致 */
  padding: 2px 4px;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 5px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.pause-btn:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.download-btn:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.resume-btn,
.progress-text-success {
  background-color: rgba(82, 196, 26, 0.3);
  /* 浅一点带透明的绿色背景 */
  color: #006400;
  /* 深一点的绿色文字 */
  border: 1px solid rgba(82, 196, 26, 0.3);
  /* 边框颜色与背景色一致 */
  padding: 2px 4px;
  border-radius: 2px;
  cursor: pointer;
  margin-right: 5px;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.resume-btn:hover {
  background-color: #73d13d;
  border-color: #73d13d;
}

.delete-btn,
.progress-text-error {
  background-color: rgba(245, 34, 45, 0.3);
  /* 浅一点带透明的红色背景 */
  color: #8b0000;
  /* 深一点的红色文字 */
  border: 1px solid rgba(245, 34, 45, 0.3);
  /* 边框颜色与背景色一致 */
  padding: 2px 4px;
  border-radius: 2px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.delete-btn:hover {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 新增进度条样式 */
.progress-container {
  //display: flex;
  align-items: center;
  text-align: center;
}

.progress-bar {
  width: 70%;
  background-color: #f3f3f3;
  border-radius: 2px;
  overflow: hidden;
  height: 10px;
  margin-right: 10px;
}

.progress {
  height: 100%;
  background-color: #40a9ff;
  /* 绿色 */
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #40a9ff;
  /* 绿色 */
}

.progress-text.completed {
  color: #52c41a;
  /* 绿色 */
  font-weight: bold;
  border: 1px solid #52c41a;
  padding: 2px 4px;
  border-radius: 2px;
}
</style>
