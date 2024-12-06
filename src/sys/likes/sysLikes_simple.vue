<!-- 点赞机制 -->
<!-- 传入modelName, modelId -->
<template>
  <n-button-group>
    <n-button text :color="likes != 'like' ? buttonColor.unClick : buttonColor.click" ghost @click="click('fIsLike')">
      <template #icon>
        <n-icon>
          <thumbs-up></thumbs-up>
        </n-icon>
      </template>
      {{sysLikesCount.fLikeCount + '&nbsp;&nbsp;'}}
    </n-button>
    <n-button text :color="likes != 'unlike' ? buttonColor.unClick : buttonColor.click" ghost @click="click('fIsUnlike')">
      <template #icon>
        <n-icon>
          <thumbs-down></thumbs-down>
        </n-icon>
      </template>
    </n-button>
  </n-button-group>
</template>

<script setup>
import {
  defineProps,
  getCurrentInstance
} from 'vue'
import {
  ThumbsUp,
  ThumbsUpOutline,
  ThumbsDown,
  ThumbsDownOutline
} from '@vicons/ionicons5'
import createApi from './api'
import context from '@/context.js'

const api = createApi(getCurrentInstance())
const buttonColor = reactive({
  "unClick" : "#808080",
  "click" : "#026df9",
})

const props = defineProps(["modelId", "modelName"])
const likes = ref("")

const sysLikesCount = ref({
  fId : "",
  fModelId : props.modelId,
  fModelName : props.modelName,
  fLikeCount : 0,
  fUnlikeCount : 0
})

const sysLikesMain = ref({
  fId: "",
  fPerson: {
    fId: '170ae6ff735e2df096472cf4bdba7da9'
  },
  fLikeTime: "",
  fUnlikeTime: "",
  fIsLike: false,
  fIsUnlike: false,
  fModelId: props.modelId,
  fModelName: props.modelName
})

function init() {
  method.list()
  method.load()
  method.countList()
}

onMounted(() => {
  init()
})

const method = {
  list : function(){
    api.list({
      query: {
        and: [
          {eq: {"fModelName": props.modelName}},
          {eq: {"fModelId": props.modelId}}
        ]
      }
    }).then(function (res) {

    })
  },

  countList : function(){
    api.countList({
      query: {
        and: [
          {eq: {"fModelName": props.modelName}},
          {eq: {"fModelId": props.modelId}}
        ]
      }
    }).then(function (res) {
      if (res.status == 200 && res.data.list.length > 0) {
        sysLikesCount.value = res.data.list[0]
      } else {
        api.countInit().then(function(res2){
          sysLikesCount.value.fId = res2.data.fId
          api.countSave(sysLikesCount.value)
        })
      }
    })
  },

  load : function(){
    if (context.user()) {
      api.list({
        query: {
          and: [
            {eq: {"fModelName": props.modelName}},
            {eq: {"fModelId": props.modelId}},
            {eq: {"fPerson.fId": sysLikesMain.value.fPerson.fId}},
          ]
        }
      }).then(function(res){
        if (res.status == 200 && res.data.list.length > 0) {
          for (var key in res.data.list[0]) {
            sysLikesMain.value[key] = res.data.list[0][key]
          }
          likes.value = (sysLikesMain.value.fIsLike ? "like" : (sysLikesMain.value.fIsUnlike ? "unlike" : ""))
        } else {
          api.init().then(function(res2){
            sysLikesMain.value.fId = res2.data.fId
          })
        }
      })
    }
  },
}

async function click(method) {
  if (context.user()) {
    var otherMethod = (method == "fIsLike" ? "fIsUnlike" : "fIsLike")
    var methodTime = (method == "fIsLike" ? "fLikeTime" : "fUnlikeTime")
    if (method == "fIsLike") {
      if (sysLikesMain.value[method] == false) {
        sysLikesCount.value.fLikeCount++
        if (sysLikesMain.value[otherMethod] == true) {
          sysLikesCount.value.fUnlikeCount--
        }
      } else {
        sysLikesCount.value.fLikeCount--
      }
    } else {
      if (sysLikesMain.value[method] == false) {
        sysLikesCount.value.fUnlikeCount++
        if (sysLikesMain.value[otherMethod] == true) {
          sysLikesCount.value.fLikeCount--
        }
      } else {
        sysLikesCount.value.fUnlikeCount--
      }
    }
    await api.countSave(sysLikesCount.value)
    sysLikesMain.value[method] = !sysLikesMain.value[method]
    if (sysLikesMain.value[method]) {
      sysLikesMain.value[methodTime] = (new Date()).getTime()
      sysLikesMain.value[otherMethod] = !sysLikesMain.value[method]
    }
    await api.save(sysLikesMain.value)
    init()
  }
}


</script>

<style scoped>

</style>
