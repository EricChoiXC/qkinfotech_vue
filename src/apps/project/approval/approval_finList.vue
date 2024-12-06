<template>
	<n-space vertical size="large">
		<n-layout>
			<n-layout-header>
			</n-layout-header>
			<n-layout-content>
				  <XCritera text="" name="list" :filters="filters" :textSearch="true"
				   placeholder="请输入" @change="(value)=>handleFilterChange(value)"></XCritera>
				<div style="text-align: center; width: 100%;margin: auto;">
					<n-data-table :columns="columns" :data="data" :pagination="page" :row-key="rowKey" @update:checked-row-keys="handleCheck" >
					</n-data-table>
				</div>
			</n-layout-content>
		</n-layout>
	</n-space>
	<n-modal v-model:show="showModal" style="width : 60%; height: 80%" preset="dialog" title="项目审批">
		<projectNodes></projectNodes>
	</n-modal>
</template>
+
<script setup>
	import { h, defineComponent, reactive } from "vue";
	import { NButton, useMessage } from "naive-ui";
	import approvalview from '@/apps/project/approval/approval_view.vue'
	import projectNodes from '@/apps/project/project_nodes.vue'
	import XCritera from '@/apps/common/filter/x-criteria.vue'
	import XDate from '@/apps/common/filter/x-date.vue'
	import XFilterItem from '@/apps/common/filter/x-filter-item.vue'
	import XSelector from '@/apps/common/filter/x-selector.vue'
	
	const page = reactive({
		page : 1,
		pageSize : 5,
		showSizePicker : true,
		pageSizes: [3, 5, 7],
		onChange: (page) => {
			paginationReactive.page = page;
		},
		onUpdatePageSize: (pageSize) => {
			paginationReactive.pageSize = pageSize;
			paginationReactive.page = 1;
		}
	});
	
	const columns = [
		{
			title : '序号',
			key : 'index'
		},{
			title : '类别',
			key : 'type'
		},{
			title : '项目编号',
			key : 'fNo'
		},{
			title : '项目名称',
			key : 'fName'
		},{
			title : '业主',
			key : 'fOwner'
		},{
			title : '项目经理',
			key : 'fDeptManager'
		},{
			title : '基本结束时间',
			key : '1'
		},{
			title : '限制结束时间',
			key : '2'
		},{
			title : '达标日期',
			key : '3'
		}/* ,{
			title : '操作',
			key : 'options'
		} */
	]
	

		
	const showModal = ref(false)
	const message = useMessage();
	function approval(row) {
		console.log("approval")
	}
	
	const data = [
		{index:1, fNo:"P20250001", fName:'项目A', fEngName:'Project Abandon', fOwner:"张三", fCreateTime:'2025-05-01', fDept:'业务部', fDeptManager:'李四', fProjectManagers:'王五', fProjectNature:'方案', fInvestment:'￥10,000', fBudget:'￥10,000', fType:'方案征集', fTag:'世界500强', fApprovalTime:'2024-05-06',
		options : [
			h(
			  NButton, {
				onClick: () => {
					showModal.value = true
				}
			  },'查看'
			)
		]},
		{index:2, fNo:"P20250002", fName:'项目B', fEngName:'Project Bana', fOwner:"张三", fCreateTime:'2025-05-01', fDept:'业务部', fDeptManager:'李四', fProjectManagers:'王五', fProjectNature:'方案', fInvestment:'￥10,000', fBudget:'￥10,000', fType:'方案征集', fTag:'世界500强', fApprovalTime:'2024-05-06',
		options : [
			h(
			  NButton, {
				onClick: () => {
					showModal.value = true
				}
			  },'查看'
			)
		]},
	]
	for (var i=0; i<data.length; i++) {
		var d = data[i]
	}
	
	
	const filters = ref([{
	      type: XDate,
	      visible: true,
	      props: {
	        "field" : "time",
	        "label" : "登记日期",
	        "value" : null,
	      }
	  },{
	      type: XSelector,
	      visible: true,
	      props: {
	        "field" : "fType",
	        "label" : "项目类型",
	        "value" : null,
			"options" : [{
			  label: "16 方案征集",
			  value: 1
			}]
	      }
	  }]);
</script>

<style>
</style>