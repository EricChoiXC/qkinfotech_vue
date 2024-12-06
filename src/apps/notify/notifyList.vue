<template>

	<n-data-table v-model:data="notifys" :columns="columns">
	</n-data-table>

</template>

<script setup>
import { reactive } from "vue"

	const columns = [{
		key : 'fTitle',
		title : '标题',
		width : '60%'
	}, {
		key : 'projectName',
		title : '项目简称',
		width : '10%'
	},{
		key : 'projectNo',
		title : '项目编号',
		width : '10%'
	},{
		key : 'time',
		title : '时间',
		width : "20%"
	},{
		key : 'options',
		title : '操作',
		width : '10%'
	}]

	const notifys = reactive([{
		fTitle : '一个跳转到联合申请的待办',
		creator : '人员A',
		time : '2024-05-27 15:00:00',
		projectName : "中央公园综合体",
		projectNo : '2207040001',
		options : [
			h(
			  NButton, {
				onClick: () => {
					window.open("/opdesk/projectManagement/implementation/supplier-union-view")
				}
			  },'查看'
			)
		]
	}])

</script>

<style>
</style>
