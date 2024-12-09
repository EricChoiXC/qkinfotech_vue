<!--简单分类选择弹窗-->
<template>
  <!-- 页面显示 -->
  <n-space>
    <n-tag
      v-if="values.multi" v-for="ele in props.fElements"
      :closable="props.status == 'edit'"
      @close="publicFunc.closeOnSelectedTags(ele)">
      {{ele.fName}}
    </n-tag>
    <n-tag
      v-else-if="props.fElement.fId" :closable="props.status == 'edit'"
      @close="publicFunc.closeOnSelectedTags(props.fElement)">
      {{props.fElement.fName}}
    </n-tag>
    <n-tag
      v-if="props.status == 'edit'" @click="publicFunc.openModal()">
      选择
    </n-tag>
  </n-space>

  <!-- 简单选择弹窗 -->
  <n-modal
    style="width: 60%; height: 60%"
    v-model:show="values.showModal"
    preset="dialog" title="分类"
    :mask-closable="false"
    :closable="false" :close-on-esc="false">
    <n-layout>
      <!-- 顶部栏 -->
      <n-layout-header style="height: 20%"> </n-layout-header>

      <!-- 分栏 -->
      <n-layout-content style="height: 60%">
        <n-card>
          <n-list bordered>
            <template v-if="values.multi">
              <n-list-item v-for="item in values.cateList">
                <n-checkbox-group :value="values.curIds" @update:value="publicFunc.clickCheckbox">
                  <n-checkbox :value="item.fId" :label="item.fName" :name="item.fName">
                  </n-checkbox>
                </n-checkbox-group>
              </n-list-item>
            </template>
            <template v-else>
              <n-list-item v-for="item in values.cateList">
                <n-radio-group :value="values.curId" @update:value="publicFunc.clickRadio">
                  <n-radio :value="item.fId" :label="item.fName" :name="item.fName">
                  </n-radio>
                </n-radio-group>
              </n-list-item>
            </template>
          </n-list>
        </n-card>
      </n-layout-content>

      <!-- 已选项，按钮 -->
      <n-layout-footer style="height: 20%">
        <n-space justify="start">
          已选：
          <n-tag
            v-if="values.multi"
            v-for="val in values.curSelected"
            closable
            @close="publicFunc.closeTags(val)"
          >
            {{ val.fName }}
          </n-tag>
          <n-tag
            v-else-if="values.curName"
            closable
            @close="publicFunc.closeTags(values.curName)"
          >
            {{ values.curName }}
          </n-tag>
        </n-space>
        <n-space justify="center">
          <n-button type="success" @click="publicFunc.closeModal(true)">确认</n-button>
          <n-button type="warning" @click="publicFunc.clean">清空</n-button>
          <n-button type="error" @click="publicFunc.closeModal(false)">取消</n-button>
        </n-space>
      </n-layout-footer>
    </n-layout>
  </n-modal>
</template>

<script setup>
import { ref, defineComponent, h, reactive } from 'vue'
import { Person } from '@vicons/ionicons5'
import createApi from './api'
import { useMessage, useDialog } from 'naive-ui'
import { repeat } from 'seemly'
import publicContext from '@/context.js'

const props = defineProps({
  /*单多选，默认false（单选）*/
  multi : Boolean,
  /*多选值*/
  fElements : Object,
  /*单选值*/
  fElement : Object,
  /*是否可编辑（edit/view），默认view*/
  status : String,
  /*分类名称，传入@SimpleModel的url*/
  categoryName : String
})

const api = createApi(getCurrentInstance())

const message = useMessage()
const dialog = useDialog()

/*基础方法*/
const baseFunc = {
  /*初始化vue数据*/
  initVue : async function(){
    values.value.multi = (props.multi === true)
    values.value.status = (props.status === "edit") ? "edit" : "view"
  },

  /*初始化olsSelected, curSelected数值*/
  initSelected : function(){
    values.value.oldSelected.length = 0
    values.value.oldIds.length = 0
    values.value.curSelected.length = 0
    values.value.curIds.length = 0
    if (values.value.multi) {
      for (var i=0; i<props.fElements.length; i++){
        values.value.oldSelected.push(props.fElements[i])
        values.value.curSelected.push(props.fElements[i])
        values.value.oldIds.push(props.fElements[i].fId)
        values.value.curIds.push(props.fElements[i].fId)
      }
    } else {
      values.value.oldSelected.push(props.fElement)
      values.value.curSelected.push(props.fElement)
      values.value.oldIds.push(props.fElement.fId)
      values.value.curIds.push(props.fElement.fId)
      values.value.oldId = props.fElement.fId
      values.value.curId = props.fElement.fId
      values.value.curName = props.fElement.fName
    }
  },

  /*加载分类选项*/
  loadCategory : async function(){
    values.value.cateList.length = 0
    values.value.cateNameMap = {}
    if (props.categoryName) {
      await api.simpleCateList(props.categoryName).then(function(res){
        var datas = res.data.list
        for (var i=0; i<datas.length; i++) {
          values.value.cateList.push(datas[i])
          values.value.cateNameMap[datas[i].fId] = datas[i].fName
        }
      })
    }
  }
}

/*公共方法*/
const publicFunc = {
  /*打开弹窗*/
  openModal : async function() {
    values.value.showModal = true
    baseFunc.initSelected()
    await baseFunc.loadCategory()
  },
  /*关闭弹窗*/
  closeModal : function(isConfirm) {
    if (isConfirm) {
      if (values.value.multi) {
        props.fElements.length = 0
        for (var i=0; i<values.value.curSelected.length; i++) {
          props.fElements.push(values.value.curSelected[i])
        }
      } else {
        props.fElement.fId = ''
        props.fElement.fName = ''
        if (values.value.curSelected.length == 1) {
          props.fElement.fId = values.value.curSelected[0].fId
          props.fElement.fName = values.value.curSelected[0].fName
        }
      }
    } else {
      if (values.value.multi) {
        props.fElements.length = 0
        for (var i=0; i<values.value.oldSelected.length; i++) {
          props.fElements.push(values.value.oldSelected[i])
        }
      } else {
        props.fElement.fId = ''
        props.fElement.fName = ''
        if (values.value.oldSelected.length == 1) {
          props.fElement.fId = values.value.oldSelected[0].fId
          props.fElement.fName = values.value.oldSelected[0].fName
        }
      }
    }
    values.value.showModal = false
  },

  clean : function() {
    values.value.curSelected.length = 0
    values.value.curIds.length = 0
    values.value.curId = ''
    values.value.curName = ''
  },

  clickCheckbox : function(target, option){
    if (option.actionType == "check") {
      values.value.curIds.push(option.value)
      values.value.curSelected.push({
        fId : option.value,
        fName : values.value.cateNameMap[option.value]
      })
    } else {
      values.value.curIds = target
      values.value.curSelected.length = 0
      for (var i=0; i<target.length; i++) {
        values.value.curSelected.push({
          fId : target[i],
          fName : values.value.cateNameMap[target[i]]
        })
      }
    }
  },

  clickRadio : function(target){
    values.value.curId = target
    values.value.curSelected[0] = {
      fId : target,
      fName : values.value.cateNameMap[target]
    }
    values.value.curName = values.value.cateNameMap[target]
  },

  closeOnSelectedTags : function(target) {
    if (values.value.multi) {
      var newElements = []
      for (var i=0; i<props.fElements.length; i++) {
        if (props.fElements[i].fId != target.fId) {
          newElements.push(props.fElements[i])
        }
      }
      props.fElements.length = 0
      for (var i=0; i<newElements.length; i++) {
        props.fElements.push(newElements[i])
      }
    } else {
      props.fElement.fId = ''
      props.fElement.fName = ''
    }
  },

  closeTags : function(target) {
    console.log(target)
    if (values.value.multi) {

    } else {
      values.value.curId = ''
      values.value.curName = ''
    }
  }
}

/*数据字段*/
const values = ref({
  /*选择框*/
  showModal : ref(false),
  /*原本的已选择数据*/
  oldSelected : ref([]),
  oldIds : ref([]),
  oldId : ref(""),
  /*当前的已选择数据*/
  curSelected : ref([]),
  curIds : ref([]),
  curId : ref(""),
  curName : ref(""),
  /*单多选*/
  multi : ref(false),
  /*编辑状态*/
  status : ref("view"),
  /*待选列表*/
  cateList : ref([]),
  cateNameMap : reactive({})
})

baseFunc.initVue()


</script>

<style scoped>

</style>
