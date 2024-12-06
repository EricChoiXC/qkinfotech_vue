<template>
	<n-space vertical size="large">
		<n-layout>
			<div style="text-align: center; width: 80%;margin: auto; padding: 20px;">
				<n-form ref="formRef" :model="userInfo" :rules="rules">
					<div style="display: none;">
						<n-input v-model:value="userInfo.fType" ></n-input>
						<n-date-picker v-model:value="userInfo.fCreateTime" type="datetime" :default-value="Date.now()"></n-date-picker>
					</div>
					<n-form-item label="名称" path="fName">
						<n-input v-model:value="userInfo.fName"></n-input>
					</n-form-item>
					<n-form-item label="编号" path="fCode">
						<n-input v-model:value="userInfo.fCode"></n-input>
					</n-form-item>
					<n-form-item label="管理员" path="fOwner">
						<formAddress :fElement="userInfo.fOwner" orgType="ORG_TYPE_PERSON"></formAddress>
					</n-form-item>
					<n-form-item label="成员" path="fMembers">
						<formAddress :fElement="userInfo.fMembers" orgType="ORG_TYPE_ALL" multi></formAddress>
					</n-form-item>
					<n-form-item label="等级" path="fLevel">
						<n-input v-model:value="userInfo.fLevel"></n-input>
					</n-form-item>
				</n-form>
				<n-button @click="add">提交</n-button>
			</div>
		</n-layout>
	</n-space>
</template>
<script lang="ts">
	import { ref, defineComponent, h, reactive } from 'vue'
	import { FormInst, useMessage } from 'naive-ui'
  import createApi from './api'

	export default defineComponent({
		props : {
			fId : String
		},
		emits: ['onClose'],
		setup(props, context) {
      const api = createApi(getCurrentInstance())
			const userInfo = ref({
					fId : "",
					fName : "",
					fType : 3,
					fCode : "",
					fLevel : "",
					fCreateTime : (new Date()).getTime(),
					fOwner : {
						fId : "",
						fName : ""
					},
					fMembers : []
				})
			const formRef = ref<FormInst | null>(null)

			if (props.fId) {
        api.load({fId: props.fId})
					.then((value) => {
						if (value.status == 200) {
							userInfo.value = value.data
							userInfo.value.fCreateTime = Date.parse(value.data.fCreateTime)
							if (!userInfo.value.fOwner) {
								userInfo.value.fOwner = {fId : "", fName : ""}
							}
						}
					})
			} else {
        api.init()
					.then((value) => {
						if (value.status == 200) {
							userInfo.value.fId = value.data.fId
						}
					})
			}

			function parseObject(obj, onlyId){
				var form = {}
				for (var key in obj) {
					if (typeof obj[key] == "object") {
						form[key] = parseObject(obj[key], true)
					} else {
						if (onlyId) {
							if (key == "fId") {
								form[key] = obj[key];
							}
						} else {
							form[key] = obj[key];
						}
					}
				}
				return form
			}

			function add(){
				var form = parseObject(userInfo.value, false)
        api.save(form)
					.then(function(res){
						if (res.status == 200) {
							alert("提交成功")
							context.emit('onClose', form);
						} else {
							alert("error status : " + res);
						}
					})
					.catch(function(error){
						alert(error)
					});
			}

			return {
				userInfo,
				onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
				add,
				parseObject,
				rules : {
					fName : {
						retuired : true,
						message : '请输入名称',
						trigger : 'blur'
					}
				}
			};
		}
	});


</script>

<style>
</style>
