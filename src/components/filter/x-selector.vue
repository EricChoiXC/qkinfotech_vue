<template>
  <x-filter-item>
    <template #label>
 <n-icon v-show="!multi" color="#18a058" size="20" style="height:0.8em" @click="switchChange">
     <radio-button-on />
 </n-icon>
 <n-icon v-show="multi" color="#18a058" size="20" style="height:0.8em" @click="switchChange">
     <checkbox-outline />
 </n-icon>
      {{label}}
    </template>
    <template #input>
      <n-button type="primary" text style="margin-right: 0.5em" @click="handleClear">
        清空
      </n-button>
      <n-tag style="margin-left:0.5em" v-for="option in options" @click="handleChange(option)" :type="checked(option)<0? 'default' : 'success'">{{option.label}}</n-tag>
    </template>
  </x-filter-item>
</template>

<script setup>
  import {ref, computed} from 'vue';
  import { CheckboxOutline, RadioButtonOn } from '@vicons/ionicons5'

  const props = defineProps(["field","label","value","options"]);

  const emit = defineEmits(['change'])

  const selected = ref(props.value);

  const multi = ref();

  multi.value = (props.value == null || props.value.length == 1);

  const checked = (option) => {
    if(selected.value != null) {
      for(let i = 0; i < selected.value.length; ++ i) {
        if(selected.value[i].value == option.value) {
          return i;
        }
      }
    }
    return -1;
  }

  const switchChange = () => {
    multi.value = !multi.value;
    if(!multi.value) {
      if(selected.value != null && selected.value.length > 1) {
        selected.value = [selected.value[0]];
      }
    }
  }

  const handleClear = () => {
    selected.value = null;
  }

  const handleChange = (option) => {
    if(selected.value == null) {
      selected.value = [option];
    } else {
      let index = checked(option);
      if(index >= 0) {
        selected.value.splice(index, 1);
      } else {
        if(multi.value) {
          selected.value.push(option);
        } else {
          selected.value = [option];
        }
      }
    }
    emit('change', {field: props.field, value: selected});
  }

  const displayText = computed(()=>{
    if(selected.value != null && selected.value.length > 0) {
      let items = []
      for(let i = 0; i < selected.value.length; ++ i) {
        items.push(selected.value[i].label);
      }
      return "[" + items.join(";") + "]";
    }
    return '';
  })

  defineExpose({displayText: displayText});

</script>

<style>
</style>
