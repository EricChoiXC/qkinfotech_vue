<script setup>
const props = defineProps(['value']);

const output = ref(props.value || 'lorem');

defineExpose({
  output: () => {
    return {value: output.value}
  }
});

</script>

<template>
  <div>
    <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem iusto aut laboriosam vero ipsam odit itaque
      consequatur voluptatum, voluptate possimus sunt, quia architecto adipisci totam nihil quis, dicta sit atque! </p>
  </div>
</template>

<style scoped lang="scss"></style>
