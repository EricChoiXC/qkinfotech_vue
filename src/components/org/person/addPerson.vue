<template>
	<n-space vertical size="large">
		<n-layout>
			<div style="text-align: center; width: 80%;margin: auto; padding: 20px;">
				<n-form ref="formRef" :model="userInfo" :rules="rules" label-placement="left" label-width="150px">
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
					<n-form-item label="登录名" path="fUser.fLoginName">
						<n-input v-model:value="userInfo.fUser.fLoginName"></n-input>
					</n-form-item>
					<n-form-item label="性别" path="fGender">
						  <n-radio-group v-model:value="userInfo.fGender" name="radiogroup">
							<n-space>
								<n-radio v-for="gender in genders" :key="gender.label" :value="gender.value">
									{{gender.label}}
								</n-radio>
							</n-space>
						</n-radio-group>
					</n-form-item>
					<n-form-item label="手机号" path="fMobile">
						<n-input v-model:value="userInfo.fMobile" style="width: 100%;" :allow-input="onlyAllowNumber"></n-input>
					</n-form-item>
					<n-form-item label="座机" path="fTel">
						<n-input v-model:value="userInfo.fTel" style="width: 100%;" :allow-input="onlyAllowNumber"></n-input>
					</n-form-item>
					<n-form-item label="邮箱" path="fEmail">
						<n-input v-model:value="userInfo.fEmail"></n-input>
					</n-form-item>
					<n-form-item label="是否业务人员" path="fIsBusiness">
						  <n-radio-group v-model:value="userInfo.fIsBusiness" name="radiogroup">
							<n-space>
								<n-radio v-for="tf in TorF" :key="tf.label" :value="tf.value">
									{{tf.label}}
								</n-radio>
							</n-space>
						</n-radio-group>
					</n-form-item>
					<n-form-item label="所属部门" path="fParentId">
						<form-address :fElement="userInfo.fParent" orgType="ORG_TYPE_DEPT" status="edit"></form-address>
						<!-- <qk-address :fElement="fElement" :fElements="fElements" status="edit" :multi="false"></qk-address> -->
					</n-form-item>
				</n-form>
				<n-button @click="add">提交</n-button>
			</div>
		</n-layout>
	</n-space>
</template>
<script>
	import { ref, defineComponent, h, reactive } from 'vue'
	import { useMessage } from 'naive-ui'
	import formAddress from '@/apps/common/address/formAddress.vue'
	import address from '@/apps/common/address/address.vue'
  import createApi from './api'

	const genders = [
		{
			value : "1",
			label : "男"
		},
		{
			value : "2",
			label : "女"
		}
	];

	const TorF = [
		{
			value : true,
			label : "是"
		},
		{
			value : false,
			label : "否"
		}
	]


	export default defineComponent({
		components: {
			'form-address' : formAddress,
			'qk-address' : address
		},
		props : {
			fId : String
		},
		emits: ['onClose'],
		setup(props, context) {
      const api = createApi(getCurrentInstance())
			const fElement = reactive({
				fId : "DGSFWL",
				fName : "财务部门"
			})
			const fElements = reactive([{
				fId : "DGSFWL",
				fName : "财务部门"
			},{
				fId : "17b7c6ea47379f2b4b9fadf4a1590e0b",
				fName : "软件部门"
			}])
			const userInfo = reactive({
					fId : "",
					fName : "",
					fType : 80,
					fCode : "",
					fCreateTime : (new Date()).getTime(),
					fGender : "",
					fMobile : "",
					fTel : "",
					fEmail : "",
					fIsBusiness : true,
					fParent : {
						fId : "",
						fName : ""
					},
					fUser : {
						fId : "",
						fLoginName : ""
					}
				})
			const formRef = ref(null)

			if (props.fId) {
        api.load({fId : props.fId})
					.then((value) => {
						if (value.status == 200) {
							var data = value.data;
							for (var tmp in data) {
								userInfo[tmp] = data[tmp]
							}
							if (data.fParent && data.fParent.fId){
                api.orgDeptLoad({fId : data.fParent.fId})
									.then(function(response) {
										if (response.status == 200) {
											var dept = response.data
											userInfo.fParent.fId = dept.fId
											userInfo.fParent.fName = dept.fName
										}
									})
							}
						}
					})
			} else {
        api.init()
					.then((value) => {
						if (value.status == 200) {
							userInfo.fId = value.data.fId
						}
					})
			}

			function parseObject(obj, onlyId){
				var form = {}
				for (var key in obj) {
					if (typeof obj[key] == "object") {
						form[key] = parseObject(obj[key], key != "baseInfo")
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
				userInfo.fUser.fId = userInfo.fId
				userInfo.fUser.fAlias = userInfo.fName
				userInfo.fId = userInfo.fId
				/* 1.保存sysUser */
        api.sysUserSave(userInfo.fUser)
					.then(function(res){
						if (res.status == 200) {
              /* 2.保存orgPerson */
              var temp = {}
              for (var key in userInfo) {
                temp[key] = userInfo[key]
                if (key == "fParent") {
                  if (temp.fParent.fId == "") {
                    temp.fParent = null
                  }
                }
              }
              console.log(userInfo)
              api.save(temp)
                .then(function(res3){
                  if (res3.status == 200) {
                    alert("提交成功")
                    context.emit('onClose');
                  } else {
                    alert("error status : " + res3);
                  }
                })
                .catch(function(error){
                  alert(error)
                });
            } else {
              alert("error status : " + res2);
            }
          })
			}


			return {
				fElement,fElements,
				genders,
				TorF,
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
