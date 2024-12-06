<script setup>
import xSelectorVue from '@/components/filter/x-selector.vue';
import { NButton, tagDark } from 'naive-ui';
import Sortable from 'sortablejs/modular/sortable.complete.esm.js'
import { onMounted, onBeforeUnmount, ref, h, render, toRefs, reactive } from 'vue';
import XDate from '../../components/filter/x-date.vue'
import XSelector from '../../components/filter/x-selector.vue'
import XUploader from '../../components/x-uploader.vue'
import myeditor from './myeditor.vue';
import MyUploader from './my-uploader.vue';

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
/*
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

*/

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
  console.log('a', value)
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

const steps = reactive([{
  name: "项目登记",
  href: "step1",
  active: true
},{
  name: "资格评审",
  href: "step2",
  active: true
},{
  name: "征集文件",
  href: "step3",
  active: true
},{
  name: "项目启动会",
  href: "step4",
  active: true
},{
  name: "汇报评审",
  href: "step5",
  active: false
},{
  name: "征集结果",
  href: "step6",
  active: false
},{
  name: "归档信息",
  href: "step7",
  active: false
}]);

const stepContainer = ref();
const scrollToStep = (index) => {

  if(index == 0) {
      stepContainer.value.parentNode.parentNode.scrollTop = 0;
  } else {
    let item = document.getElementById("step" + index);
    stepContainer.value.parentNode.parentNode.scrollTop = item.offsetTop + item.clientHeight - 126
  }

}

</script>

<template>

  <my-uploader url="http://localhost:8080" mode="pic"></my-uploader>
  <!--
  <div style="width:100%;padding:0 10%; position:absolute;top:0;background-color:#f5f7f9">
      <table style="width:100%" cellspacing=0 cellpadding=0 border=0>
       <tr>
         <td align="center" v-for="(item, index) in steps" :class="item.active? 'active step-cell' : 'step-cell'" style="position:relative">
             <span class="step-line"></span>
             <a href="javascript:void(0)"  class="step-node" @click="scrollToStep(index)" >{{index+1}}</a>
         </td>
       </tr>
       <tr>
         <td align="center" v-for="(item, index) in steps" :class="item.active? 'active' : ''" style="position:relative">
             <a href="javascript:void(0)" @click="scrollToStep(index)"><span class="step-label">{{item.name}}</span></a>
         </td>
       </tr>
     </table>
  </div>
  <div class="step-container" ref="stepContainer">
    <div id="step1" class="step-content">step1</div>
    <div id="step2" class="step-content">step2</div>
    <div id="step3" class="step-content">step3</div>
    <div id="step4" class="step-content">step4</div>
    <div id="step5" class="step-content">step5</div>
    <div id="step6" class="step-content">step6</div>
    <div id="step7" class="step-content">step7</div>
  </div>


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
 -->


</template>

<style scoped>
  .step-node {
    display:inline-block;
    width: 2.4em;
    height: 2.4em;
    border-radius:50%;
    line-height: 2.4em;
    text-align: center;
    color: black;
    background-color: lightgray;
    cursor:pointer;
    z-index: 10;
    position:relative;
  }

  .step-label {
    display:inline-block;
    padding-top: 10px;

  }
  .step-line {
    display:inline-block;
    position:absolute;
    top: 50%;
    left: 0;
    right:0;
    height:2px;
    background-color:lightgray;
  }
  .step-cell:first-child .step-line {
    left: 50%;
  }

  .step-cell:last-child .step-line {
    right: 50%;
  }

  .active .step-node {
    color: white;
    background-color: #13aaff!important;
  }

  .active .step-line {
    background-color:#13aaff!important
  }

  .step-container {
    padding-top: 9em;
  }
  .step-content {
    height:20em;
    border:1px solid black;
  }

</style>
