<template>
	<n-space vertical size="large">
		<n-layout>
			<n-layout-header>
			</n-layout-header>
			<n-layout>
				<n-layout>
					<n-layout-header>
						<n-layout>
							<n-layout-header>
								<n-flex justify="end">
									<n-button type="primary" @click="add">新建</n-button>
								</n-flex>
							</n-layout-header>
						</n-layout>
					</n-layout-header>
					<n-layout-content>
						<div style="text-align: center; width: 100%;margin: auto;">
							<n-data-table :columns="columns" :data="data" :pagination="page" :row-key="rowKey" @update:checked-row-keys="handleCheck" >
							</n-data-table>
						</div>
					</n-layout-content>
				</n-layout>
			</n-layout>
		</n-layout>
	</n-space>
	<n-modal v-model:show="showModal" style="width : 60%; height: 80%" preset="dialog" title="角色管理">
		<orgAuthEdit :fId="rowdata.fId" @onClose="update"></orgAuthEdit>
	</n-modal>
</template>

<script lang="ts">
	import { ref, defineComponent, h, reactive } from 'vue'
	import { NTag, NButton, useMessage, NRadio, NDropdown, NDatePicker, NInput, NButtonGroup, NRadioGroup, NModal, DataTableColumns, DataTableRowKey  } from "naive-ui";
  import createApi from './api'
	import {useTableDate} from '@/apps/common/actionButton.js'

	type RowData = {
		key : number
		fName : string
		fRoles : [{
			fId : string,
			fRole : {
				fName : string
			}
		}]
		fElements : [{
			fId : string,
			fElement : {
				fName : string
			}
		}]
	}

	export default {
		methods : {
		},
		setup(){
      const api = createApi(getCurrentInstance())
			const columsName = [{
					title : '名称',
					key : 'fName',
				},{
					title : '权限',
					key : 'fRoles.fRole.fName',
				}];

			const data = ref([]);
			const checkedRowKeysRef = ref<DataTableRowKey[]>([])

			const showModal = ref(false)
      api.list({query : []})
				.then(function(res){
					if (res.status == 200) {
						for (var i=0; i<res.data.list.length; i++) {
							var temp = res.data.list[i];
							temp["key"] = i;
							data.value.push(temp)
						}
					}
				});

			const method = ref()
			const rowdata = ref()
			const { columns } = useTableDate({ showModal, method, rowdata, data, columsName})

			const paginationReactive = reactive({
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

			return {
				columns,
				checkedRowKeys: checkedRowKeysRef,
				rowKey: (row : RowData) => row.key,
				handleCheck(rowKeys : DataTableRowKey[]) {
					checkedRowKeysRef.value = rowKeys
				},
				data,
				showModal,
				page : paginationReactive,
				rowdata,
				method,
				add(){
					showModal.value = true
					method.value = "add"
					rowdata.value = {}
				},
				update(updated)  {
					showModal.value = false
					data.value = []
          api.list({query : []})
						.then(function(res){
							if (res.status == 200) {
								for (var i=0; i<res.data.list.length; i++) {
									var temp = res.data.list[i];
									temp["key"] = i;
									data.value.push(temp)
								}
							}
						});
				}

			}
		}
	}

</script>

<style>
</style>
