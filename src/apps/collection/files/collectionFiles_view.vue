<template>
	<n-table :single-line="false">
		<tr>
			<td colspan="2" class="td_title">
				征集文件
			</td>
			<td class="td_title">
				操作
			</td>
		</tr>
		<tr>
			<td class="td_title">
				包件信息
			</td>
			<td>
				<n-checkbox-group v-model:value="checkVal">
					<n-space>
						<n-checkbox v-for="item in items" :value="item.fName" disabled>
							{{item.fName}}
						</n-checkbox>
					</n-space>
				</n-checkbox-group>
			</td>
			<td rowspan="5">
				<n-space justify="center">
					<n-button>
						修改
					</n-button>
				</n-space>
			</td>
		</tr>
		<tr>
			<td class="td_title">
				征集文件
			</td>
			<td>
				<attachment status=""></attachment>
			</td>
		</tr>
		<tr>
			<td colspan="2" class="td_title">
				附件上传
			</td>
		</tr>
		<tr>
			<td class="td_title">
				文件类型
			</td>
			<td>
				<attachment status=""></attachment>
			</td>
		</tr>
		<tr>
			<td class="td_title">
				答疑文件
			</td>
			<td>
				<attachment status=""></attachment>
			</td>
		</tr>
		<tr>
			<td class="td_title">
				技术资料
			</td>
			<td>
				<attachment status=""></attachment>
			</td>
		</tr>
	</n-table>
</template>

<script>
	import { ref, defineComponent, h, reactive } from 'vue'
	import formAddress from '@/apps/common/address/formAddress.vue'
	import attachment from '@/apps/common/attachment/attachment.vue'
	
	export default defineComponent({
		setup() {
			const checkVal = ref(['包件1'])
			const items = ref([{
				fName : '包件1'
			},{
				fName : '包件2'
			},{
				fName : '包件3'
			}])
			
			return {
				checkVal,
				items
			}
		}
	})
</script>

<style>
</style>