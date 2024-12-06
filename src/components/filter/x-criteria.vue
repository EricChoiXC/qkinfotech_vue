<template>
    <div v-show="textSearch" style="display:flex;flex-wrap: nowrap; align-items:center">
      <span style="flex-grow: 1;">
        <n-input style="width: 508px" v-model:value="ftsearch" @input="emitChange" :placeholder="fplaceholder"></n-input>
      </span>
      <span style="flex-grow: 0;width: 8em;text-align:right;padding-right:1em;">
        <n-button size="tiny" type="info" text @click="handleToggle">
          <span v-if="show">收起筛选</span>
          <span v-if="!show">展开筛选</span>
        </n-button>
      </span>
    </div>
    <div v-show="textSearch && show" style="padding-top: 0.5em;">
      <n-tag style="margin-left: 0.5em;" type="success" v-for="filter in filters.filter(x => x.visible && x.props.value != null)" @close="handleClose(filter)" closable>
        {{filter.props.label}}:{{filterRefs[filter.props.field].displayText}}
      </n-tag>
    </div>
    <div v-show="!textSearch || (textSearch && show)" style="padding-top: 0.5em;">
      <component v-for="filter in filters.filter(x => x.visible)"  :ref="(el) => handleFilterRef(filter, el) " :is="filter.type" v-bind="filter.props" @change="handleChange"></component>
    </div>
</template>

<script setup>
    import {ref, reactive} from 'vue';

    const filterRefs = reactive({});
    const handleFilterRef = (filter, el) => {
      filterRefs[filter.props.field] = el;
    }

    const emit = defineEmits(['change']);

    const props = defineProps(["filters", "name", "text", "textSearch", "placeholder"]);

    const ftsearch = ref(props.text);
    const fplaceholder = ref(props.placeholder);

    const show = ref(false);
    if(!props.textSearch) {
      show.value = true;
    }

    const emitChange = () => {
      // let value = [];
      // for(let i=0; i < props.filters.length; ++ i){
      //   if(props.filters[i].props.value !== null) {
      //     value.push({field: props.filters[i].props.field, value: props.filters[i].props.value})
      //   }
      // }
      let value = props.filters.filter(x => x.props.value !== null).map(x => {return {field: x.props.field, value: x.props.value} });
      value.push({ftsearch: ftsearch.value});
      emit('change', value);
    }

    const handleToggle = () => {
      show.value = !show.value;
    }

    const handleClose = (filter) => {
      filter.props.value = null;
      emitChange();
    }

    const handleChange = (v) => {
      for(let i=0; i < props.filters.length; ++ i){
        if(props.filters[i].props.field == v.field) {
          props.filters[i].props.value = v.value;
          break;
        }
      }
      emitChange();
    }
</script>

<style>
</style>
