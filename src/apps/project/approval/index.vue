<template>
	<div id="approvalIndexDiv">
	</div>
</template>

<script setup>
	import {createApp} from 'vue'
	import approvalApp from './App.vue'
	import approvalRouter from './router'
	import {store} from '@/store'
	
	const approvalIndexDiv = createApp(approvalApp)
	approvalIndexDiv.use(store)
	approvalIndexDiv.use(approvalRouter)
	approvalIndexDiv.mount("#approvalIndexDiv")
</script>

<style>
</style>