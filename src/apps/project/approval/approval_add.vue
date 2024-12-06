<template>
	<n-layout>
		<n-space vertical size="large">
			<n-layout-header>
			</n-layout-header>
			<n-layout-content>
				<n-card>
					<n-form ref="formRef" :model="approvalModel" label-placement="left" label-width="150px">
						<n-grid :cols="2">
							<n-gi :span="2">
								<p style="font-size: 16px; font-weight: bold;">基本信息</p>
							</n-gi>
							<n-gi>
								<n-form-item label="项目编号">
									项目审批通过后自动生成
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="类别">
									<n-input v-model:value="approvalModel.fProjectCategory" disabled></n-input>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="项目名称">
									<n-input v-model:value="approvalModel.fName" placeholder="请输入项目名称"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="英文名称">
									<n-input v-model:value="approvalModel.fEngName" placeholder="请输入项目英文名称"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="业主">
									<formAddress :fElement="fElements" multi status="edit"></formAddress>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="项目模式">
									<n-input v-model:value="approvalModel.fProjectMode"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="登记日期">
									<n-date-picker v-model:value="approvalModel.fRegisterTime" type="date"></n-date-picker>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="部门">
									<formAddress :fElement="fElement" status="edit"></formAddress>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="项目经理">
									<formAddress :fElement="fElement" status="edit"></formAddress>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="项目组成员">
									<formAddress :fElement="fElements" status="edit" multi></formAddress>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="项目性质">
									<n-select v-model:value="approvalModel.fProjectNature" :options="options" tag></n-select>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="审批投资预算">
									<n-input-number placeholder="审批投资预算" :show-button="false"></n-input-number>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="征集费预算">
									<n-input-number placeholder="征集费预算" :show-button="false"></n-input-number>
								</n-form-item>
							</n-gi>

							<n-gi>
								<n-form-item label="资金来源">
									<n-input placeholder="资金来源"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="预期收入">
									<n-input-number :show-button="false"></n-input-number>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="项目典型性">
									<n-input placeholder="项目典型性"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="开拓信息">
									<n-input placeholder="开拓信息"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi>
								<n-form-item label="项目执行地">
									<n-input placeholder="项目执行地"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="涉密项目">
									<n-radio-group v-model:value="isClassified">
										<n-space>
											<n-radio :value="true">是</n-radio>
											<n-radio :value="false">否</n-radio>
										</n-space>
									</n-radio-group>
								</n-form-item>
							</n-gi>
							<n-gi :span="2">
								<n-form-item label="TimeSheet用时">
									<n-input placeholder="TimeSheet" disabled></n-input>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<p style="font-size: 16px; font-weight: bold;">项目概况</p>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="项目地点">
									<n-input placeholder="项目地点"></n-input>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="项目类型">
									<n-select :options="options" tag multiple v-model:value="approvalModel.fProjectType" @update:value="updateFProjectType"></n-select>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="项目标签">
									<n-select :options="options" tag multiple></n-select>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item :label="'项目规模（'+fProjectScale.label+'）'" v-for="fProjectScale in approvalModel.fProjectScale">
									<div style="display: block;">
										<n-input-group v-for="t in fProjectScale.types">
											<n-input-number v-model:value="t.value" :show-button="false"></n-input-number>
											<n-input-group-label>{{t.unit}}</n-input-group-label>
										</n-input-group>
									</div>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="包件信息">
									<n-select placeholder="包件信息包件信息,按回车键生成一份包件" filterable multiple tag :show="false"></n-select>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<p style="font-size: 16px; font-weight: bold;">附件上传</p>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="项目建议书">
									<attachment status="edit" :files="items" title="项目建议书"></attachment>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="前期资料">
									<attachment status="edit" :files="items2" title="前期资料"></attachment>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="工作计划">
									<attachment status="edit" :files="items3" title="工作计划"></attachment>
								</n-form-item>
							</n-gi>
							<n-gi span=2>
								<n-form-item label="其他">
									<attachment status="edit" :files="items4" title="其他"></attachment>
								</n-form-item>
							</n-gi>
							<n-gi span=2>

									<n-space justify="center">
										<n-button type="primary">提交</n-button>
										<n-button type="primary">保存退出</n-button>
										<n-button type="error">关闭</n-button>
									</n-space>
							</n-gi>
						</n-grid>
					</n-form>
				</n-card>
			</n-layout-content>
		</n-space>
	</n-layout>
</template>

<script setup>
	import { ref, defineComponent, h, reactive } from 'vue'
	import { useMessage } from 'naive-ui'
	import formAddress from '@/apps/common/address/formAddress.vue'
	import attachment from '@/apps/common/attachment/attachment.vue'

	/*  */
	const approvalModel = ref({
		fName : "",
		fProjectCategory : "方案征集类",
		fProjectType : [],
		fProjectScale : []
	})
	const formRef = ref(null)
	const now = (new Date()).getTime()
	const fElement = ref({
		fId:"123",
		fName:"演示人员1"
	})
	const fElements = ref([{
		fId : "123",
		fName : "演示人员1"
	},{
		fId : "114",
		fName : "演示人员2"
	}])

	const isClassified = ref(true)

	/* 选择框演示数据项 */
	const options = ref([{
		label : '城市设计',
		value : '1',
		types : [{
			val : "",
			unit : "建筑面积（平方米）"
		},{
			val : "",
			unit : "高度（米）"
		}]
	},{
		label : '规划类',
		value : '2',
		types : [{
			val : "",
			unit : "研究范围（平方千米）"
		},{
			val : "",
			unit : "核心范围（平方千米）"
		}]
	},{
		label : '测试3',
		value : '3',
		types : [{
			val : "",
			unit : "研究范围（平方千米）"
		}]
	},{
		label : '测试4',
		value : '4',
		types : [{
			val : "",
			unit : "研究范围（平方千米）"
		}]
	},{
		label : '测试5',
		value : '5',
		types : [{
			val : "",
			unit : "研究范围（平方千米）"
		}]
	}])
	/* 附件演示数据 */
	const items = ref([{
		fName : "文件1.txt"
	},{
		fName : "文件2.doc"
	}])
	const items2 = ref([{
		fName : "文件3.ppt"
	},{
		fName : "文件4.pptx"
	}])
	const items3 = ref([{
		fName : "文件5.xls"
	}])
	const items4 = ref([{
		fName : "文件6.img"
	}])



	function updateFProjectType(vals, targets){
		console.log(vals)
		console.log(targets)
		var newVals = []
		// 1.先将已填写的数据暂存进options中
		for (var i=0; i<approvalModel.value.fProjectScale.length; i++) {
			var temp = approvalModel.value.fProjectScale[i]
			for (var j=0; j<options.value.length; j++) {
				if (options.value[j].value == temp.value) {
					options.value[j].types = temp.types
				}
			}
		}
		// 2.再将新添加数据取出到fProjectScale中
		approvalModel.value.fProjectScale = targets
	}
</script>

<style>
</style>
