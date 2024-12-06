<template>
  <x-filter-item>
    <template #label>
      {{label}}
    </template>
    <template #input>
      <n-date-picker v-model:value="range" type="daterange" clearable @update:value="handleChange"/>
    </template>
  </x-filter-item>
</template>

<script setup>
  import {ref, computed} from 'vue';
  import { format } from "date-fns";

  const props = defineProps(["field","label","value"]);

  const emit = defineEmits(['change'])

  const range = ref(props.value);

  const handleChange = () => {
    emit('change', {field: props.field, value: range});
  }

  const displayText = computed(()=>{
    if(range.value != null) {
      let f = new Date(range.value[0]);
      let t = new Date(range.value[1]);
      return "[" + format(f, "yyyy-MM-dd") + " - " + format(t, "yyyy-MM-dd") + "]";
    }
    return '';
  })

  defineExpose({displayText: displayText});

</script>

<style>
</style>
