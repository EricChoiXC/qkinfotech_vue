<!--
	上传附件页面，该页面保存的附件记录在sysFile和sysFileSlice表中
	入参:
		saveAttachment：必填，返回的方法，调用后会返回成功保存起来的附件对象列表
 -->
<template>
	<div class="upload-container">
		<label ref="uploadLabel" class="uploader" v-if="$props.mode == true" style="width: 146px; height: 146px">
			<input style="display:none" type="file" ref="uploadPic" accept="image/*" @change="handlePicSelect"/>
			<span class="upload-text" v-if="avaterSrc == ''">点击上传</span>
			<img src="" alt="" id="uploadPicImg" style="display: none"/>
			<n-avatar :size="144" :src="avaterSrc" v-if="avaterSrc != ''"></n-avatar>
		</label>
	</div>
	<div class="upload-container">
		<n-space>
			<!-- <n-button type="info" @click="selectFile">选择文件</n-button> -->
			<n-button type="primary" :disabled="picDisabled" :loading="picLoading" @click="saveAttachment">上传</n-button>
		</n-space>
	</div>
</template>

<script setup>
	import {
		computed,
		onMounted,
		reactive,
		ref
	} from 'vue';
	import ProcessQueue from './queue.js';
	import baseUrl from '@/utils/baseUrl';

	const props = defineProps(["mode"]);
	const emit = defineEmits(["saveAttachment"])

	const uploadLabel = ref();
	const uploadPic = ref();
	const fileInfoList = ref([]);
	const queue = new ProcessQueue();
	const canReuploadFile = ref(false)
	const avaterSrc = ref("")
	const picLoading = ref(false)
	const picDisabled = ref(true)

	const successCount = computed(() => fileInfoList.value.filter(file => file.status === 'success').length);
	const totalSize = computed(() => (fileInfoList.value.reduce((total, file) => total + file.size, 0) / 1024 / 1024)
		.toFixed(2));

	// 传输入口
	function transfer(fileInfo) {
		return new Promise((resolve, reject) => {
			picLoading.value = true
			let xhr = new XMLHttpRequest();
			fileInfo.xhr = xhr;

			// 配置上传事件
			xhr.upload.addEventListener('progress', e => {
				fileInfo.status = "progress";
				if (e.lengthComputable) {
					var percentage = Math.round((e.loaded * 100) / e.total);
					if (percentage == 100) {
						percentage = 99
					}
					fileInfo.progress = percentage / 100;
				}
			});

			xhr.upload.addEventListener('loadstart', e => {
				fileInfo.status = "started";
			});

			xhr.upload.addEventListener('error', e => {
				fileInfo.status = "error";
				fileInfo.msg = "出错了";
				picLoading.value = false
			});

			xhr.upload.addEventListener('abort', e => {
				fileInfo.status = "abort";
				picLoading.value = false
			});

			xhr.upload.addEventListener('timeout', e => {
				fileInfo.status = "timeout";
				fileInfo.status = "连接超时";
				picLoading.value = false
			});

			/* xhr.upload.addEventListener('load', e => {
			  fileInfo.status = "success";
			}); */

			xhr.upload.addEventListener('loadend', e => {
				resolve(fileInfo);
			});

			xhr.addEventListener('readystatechange', () => {
				if (xhr.readyState === 4) {
					if (xhr.status == 200) {
						fileInfo.fId = (JSON.parse(xhr.responseText)).data
						.fId; // 将服务器返回的响应数据存储到 fileInfo 中
						fileInfo.status = "success"
						picDisabled.value = false
					} else {
						fileInfo.status = "error"
						fileInfo.msg = xhr.statusText
						picDisabled.value = true
					}

					picLoading.value = false
				}
			});

			let formData = new FormData();
			formData.append('file', fileInfo.file);
			// 配置请求
			//xhr.open('POST', props.url+"/file/upload", true);
			xhr.open('POST', baseUrl.pmUrl + "/pm/file/upload", true)
			// xhr.withCredentials = true; // 设置允许发送 cookie
			// 发送请求
			xhr.send(formData);
			// 对外 显示 pause，resume, cancel 按钮，
			// 点击后  xhr.abort， 列表 删除等等
		});
	}

	function saveAttachment() {
		/* 关联附件 */
		var result = []
		for (var i=0; i<fileInfoList.value.length; i++) {
			var file = fileInfoList.value[i]
			if (file.status == "success" && file.fId != "") {
				file.src = avaterSrc.value
				result.push(file)
			}
		}
		emit('saveAttachment', result)
	}


	function handlePicSelect(e) {
		picDisabled.value = true
		/* 页面显示图片 */
		const reader = new FileReader()
		reader.onload = function(e) {
			document.getElementById("uploadPicImg").src = e.target.result
			avaterSrc.value = e.target.result
		}
		reader.readAsDataURL(e.target.files[0])
		/* 保存附件到数据库 */
		const file = e.target.files[0]
		let fileInfo = reactive({
			file: file,
			name: file.name,
			type: file.type,
			size: file.size,
			fId: "",
			msg: "",
			progress: 0,
			status: "waiting",
		});
		fileInfoList.value.push(fileInfo)
		transfer(fileInfo)
	}
</script>

<style scoped>

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
		transition: background-color 0.3s, border-color 0.3s;
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
		transition: background-color 0.3s, border-color 0.3s;
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
		transition: background-color 0.3s, border-color 0.3s;
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
