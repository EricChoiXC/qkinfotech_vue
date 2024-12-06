<script setup>
import xSelectorVue from '@/components/filter/x-selector.vue';
import { NButton, tagDark } from 'naive-ui';
import Sortable from 'sortablejs/modular/sortable.complete.esm.js'
import { onMounted, onBeforeUnmount, ref, h, render, toRefs } from 'vue';
import XDate from '../../components/filter/x-date.vue'
import XSelector from '../../components/filter/x-selector.vue'
import XUploader from '../../components/x-uploader.vue'
import myeditor from './myeditor.vue';

const xform = defineComponent({
  props : ['form'],

  setup() {
    return  () => {

      function make(ary) {
        let list = [];
        if(typeof(ary) === 'string') {
          return ary;
        }
        if(ary?.length > 0) {
          for(let i=0; i < ary.length; ++ i) {
            list.push(h(ary[i].type, ary[i].prop, make(ary[i].children)));
          }
        }
        return list;
      }
      return h("div", {"class": "draggable"}, make(form.value));
    }
  }

})

const form = ref([{
  type: NButton, prop: {type: "primary", "design-type": "control"}, children: "1111"
}, {
  type: NButton, prop: {type: "primary", "design-type": "control"}, children: "bbbb"
}])

const xf = ref();

onMounted(() => {

  function endDrag(evt) {
      var itemEl = evt.item;  // dragged HTMLElement
      evt.to;    // target list
      evt.from;  // previous list
      evt.oldIndex;  // element's old index within old parent
      evt.newIndex;  // element's new index within new parent
      evt.clone // the clone element
      evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
      console.log(evt.item, evt.to, evt.from);
  };

  var dom = xf.value.$el;
  // var eis = dom.querySelectorAll("[design-type=control]");
  // for(var i=0; i < eis.length; ++ i) {
  //   eis[i].classname = "item";
  // }
  var els = dom.querySelectorAll(".draggable");
  for(var i=0; i < els.length; ++ i) {
    new Sortable(els[i], {
      group: "f",
      animation: 150,
      //draggable: ".item",
      onEnd: endDrag,
    });
  }
new Sortable(xf.value.$el, {
      group: "f",
      animation: 150,
      //draggable: ".item",
      onEnd: endDrag,
    });
})



const filters = ref([{
      type: XDate,
      visible: true,
      props: {
        "field" : "time",
        "label" : "创建日期",
        "value" : null,
      }
  },{
      type: XDate,
      visible: true,
      props: {
        "field" : "time2",
        "label" : "创建日期2",
        "value" : null,
      }
  }
  ,{
      type: XSelector,
      visible: true,
      props: {
        "field" : "type",
        "label" : "类型",
        "value" : null,
        "options" : [{
          label: "方",
          value: 1
        },{
          label: "圆",
          value: 2
        },{
          label: "三角",
          value: 3
        }]
      }
  },
  ]);


const handleFilterChange = (value) => {
  // console.log('a', value)
}

const uploadedFiles = [
      {
        id: "razars",
        name: "刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀刀",
        status: "finished",
        url: "http://localhost/download"
      },
      {
        id: "edge",
        name: "锋",
        status: "finished"
      }
    ];

const filelist = []

const showDialog = () => {
  window.$modal(myeditor, {value: 'aaaaa'}, {title: "编辑"}).then((v) => {
    window.$message.success(JSON.stringify(v));
  })
}

</script>

<template>
  <n-button @click="showDialog()">dialog</n-button>

  <xform ref="xf" form="form"></xform>

  <x-criteria text="abc" name="list" :filters="filters" :textSearch="true" placeholder="请输入" @change="(value)=>handleFilterChange(value)"></x-criteria>

  <n-upload
    action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    :default-file-list="uploadedFiles" :show-download-button="true"
  >
    <n-button>上传文件</n-button>
  </n-upload>

 <x-uploader action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    :default-file-list="uploadedFiles" :show-download-button="true">
   <n-button>上传文件</n-button>
  </x-uploader>


</template>

<style lang="scss" scoped></style>
