<script setup>

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

</script>

<template>
  <iframe :src="src"></iframe>
</template>
