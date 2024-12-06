<template>
	<n-space vertical size="large">
		<n-layout>
			<n-layout-header>
			</n-layout-header>
			<n-layout>
				<div style="text-align: center; width: 80%;margin: auto;">
					<n-form ref="formRef" :model="orgInfo">
						<div style="display : none">
							<n-input v-model:value="orgInfo.fType"></n-input>
							<n-date-picker v-model:value="orgInfo.fCreateTime"></n-date-picker>
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
						<n-form-item label="部门地址" path="fAddr">
							<n-input v-model:value="orgInfo.fAddr"></n-input>
						</n-form-item>
						<n-form-item label="所属部门ID" path="fParentId">
							<n-input v-model:value="orgInfo.fParent.fId"></n-input>
						</n-form-item>
						<n-form-item label="所属公司ID" path="fCompanyId">
							<n-input v-model:value="orgInfo.fCompany.fId"></n-input>
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
		fType : 2,
		fCode : "",
		fCreateTime : (new Date()).getTime(),
		fTel : "",
		fAddr : "",
		fParent : ref({
			fId : ""
		}),
		fCompany : ref({
			fId : ""
		})
	});


	export default defineComponent({
		setup() {
      const api = createApi(getCurrentInstance())
			return {
				orgInfo,
				onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
				add() {
					var form = {}
					for (var key in orgInfo.value) {
						form[key] = orgInfo.value[key];
					}
					/* 处理一下所属部门和所属公司二填一时，另一项为空导致保存出现随机生产fId而保存出错问题 */
					if (form.fCompany.fId == "") {
						form.fCompany = null;
					}
					if (form.fParent.fId == "") {
						form.fParent = null;
					}
					console.log(form);
          api.save(form)
						.then(function(res){
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
