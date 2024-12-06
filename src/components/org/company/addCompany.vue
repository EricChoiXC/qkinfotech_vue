<template>
	<n-space vertical size="large">
		<n-layout>
			<n-layout-header>
			</n-layout-header>
			<n-layout>
				<div style="text-align: center; width: 80%;margin: auto;">
					<n-form ref="formRef" :model="orgInfo" label-placement="left" label-width="150px">
						<div style="display : none">
							<n-input v-model:value="orgInfo.fType" ></n-input>
						</div>
						<n-form-item label="名称" path="fName">
							<n-input v-model:value="orgInfo.fName"></n-input>
						</n-form-item>
						<n-form-item label="编号" path="fCode">
							<n-input v-model:value="orgInfo.fCode"></n-input>
						</n-form-item>
						<n-form-item label="座机" path="fTel">
							<n-input v-model:value="orgInfo.fTel" style="width: 100%;" :allow-input="onlyAllowNumber"></n-input>
						</n-form-item>
						<n-form-item label="公司地址" path="fAddr">
							<n-input v-model:value="orgInfo.fAddr"></n-input>
						</n-form-item>
						<n-form-item label="所属部门" path="fParentId">
							<form-address :fElement="orgInfo.fParent" orgType="ORG_TYPE_ORG" status="edit"></form-address>
						</n-form-item>
					</n-form>
					<n-button @click="add">新建</n-button>
				</div>
			</n-layout>
		</n-layout>
	</n-space>
</template>
<script>
	import { ref, defineComponent, h } from 'vue'
	import { useMessage } from 'naive-ui'
  import createApi from './api'

	var orgInfo = ref({
		fName : "",
		fType : 1,
		fCode : "",
		fCreateTime : (new Date()).getTime(),
		fTel : "",
		fAddr : "",
		fParent : ref({
			fId : ""
		}),
	});


	export default defineComponent({
		setup() {
      const api = createApi(getCurrentInstance())
      api.init().then((value) => {
					if (value.status == 200) {
						orgInfo.fId = value.data.fId
					}
				})
			return {
				orgInfo,
				onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
				add() {
					var form = {}
					for (var key in orgInfo.value) {
						form[key] = orgInfo.value[key];
					}
					if (form.fParent.fId == "") {
						form.fParent = null;
					}
					orgInfo.value.fId = orgInfo.fId

          api.save(form).then(function(res){
							if (res.status == 200) {
								alert("添加成功")
							} else {
								alert("status : " + res);
							}
						});
				}
			};
		}
	});


</script>

<style>
</style>
