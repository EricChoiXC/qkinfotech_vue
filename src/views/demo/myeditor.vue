<template>
  <n-input v-model:value="output"></n-input>
</template>

<script setup>
  const props = defineProps(['value']);

  const output = ref(props.value);

  defineExpose({output: () => {
    return { value: output.value }
  }});
</script>

<style>

</style>
