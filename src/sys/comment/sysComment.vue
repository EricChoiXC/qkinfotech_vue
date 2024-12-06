<!-- 评论机制 -->
<!-- 传入modelId, modelName -->
<template>
  <n-space vertical style="min-width: 60%; max-width: 60%; justify-content: center; margin: auto">
    <div v-if="comments.length > 0">
      <n-h3>评论：{{comments.length}}</n-h3>
    </div>
    <!-- 1.评论 -->
    <div v-for="(comment, index) in comments" v-if="comments.length > 0">
      <n-thing content-indented>
        <template #avatar>
          <n-avatar round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"/>
        </template>
        <template #header>
          {{comment.fPerson ? comment.fPerson.fName : ''}}
          <br/>
          {{comment.fCreateTime}}
        </template>
        {{comment.fContent}}
        <template #footer>
          <n-space vertical>
            <n-space>
              <sysLikesSimple :modelId="comment.fId" modelName="sysCommentMain"></sysLikesSimple>
              <n-button text v-if="comment.fChildren.length > 0 && comment.show == false" @click="method.showChildren(comment)" type="info">
                展开
              </n-button>
              <n-button text v-if="comment.fChildren.length > 0 && comment.show == true" @click="method.hideChildren(comment)" type="info">
                折叠
              </n-button>
              <n-button text @click="method.openReply(comment)" type="info">
                回复
              </n-button>
              <n-button text v-if="comment.fPerson.fId == context.user()" @click="method.deleteComment(comment)" type="error">
                删除
              </n-button>
            </n-space>
            <!-- 回复评论 -->
            <div v-for="(children, index) in comment.fChildren" v-if="comment.show">
              <n-thing content-indented>
                <template #avatar>
                  <n-avatar round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"/>
                </template>
                <template #header>
                  {{children.fPerson ? children.fPerson.fName : ''}}
                  <br/>
                  {{children.fCreateTime}}
                </template>
                回复：{{children.fReply.fPerson.fName}}<br/>
                {{children.fContent}}
                <template #footer>
                  <n-space>
                    <sysLikesSimple :modelId="children.fId" modelName="sysCommentMain"></sysLikesSimple>
                    <n-button text @click="method.openReply(children)" type="info">
                      回复
                    </n-button>
                    <n-button text v-if="children.fPerson.fId == context.user()" @click="method.deleteComment(children)" type="error">
                      删除
                    </n-button>
                  </n-space>
                </template>
              </n-thing>
              <br/>
            </div>
          </n-space>
          <n-divider></n-divider>
        </template>
      </n-thing>
    </div>
    <div v-else>
      <n-thing>
        <n-h3>暂无评论</n-h3>
      </n-thing>
    </div>
    <!-- 2.分页 -->
    <n-pagination v-model:page="pageInfo.pageNo" v-model:page-count="pageInfo.counts" @update:page="init()"></n-pagination>
    <!-- 3.填写评论 -->
    <n-card v-if="sysCommentMain.fPerson.fId">
      <n-space vertical>
        <n-input type="textarea" style="width: 100%" v-model:value="sysCommentMain.fContent"></n-input>
        <n-space justify="end">
          <n-button type="info" @click="method.submit()" :disabled="sysCommentMain.fContent.length <= 0">评论</n-button>
        </n-space>
      </n-space>
    </n-card>
    <n-card v-else>
      <n-h3>请先登陆</n-h3>
    </n-card>
  </n-space>
  <n-modal preset="dialog" :mask-closable=false v-model:show="showReply" style="width: 40%" title="回复">
    <n-card>
      <n-space vertical>
        <n-input type="textarea" style="width: 100%" v-model:value="sysCommentReply.fContent"></n-input>
        <n-space justify="end">
          <n-button type="info" @click="method.replySubmit()" :disabled="sysCommentReply.fContent.length <= 0">回复评论</n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script setup>
import {
  defineProps,
  getCurrentInstance
} from 'vue'
import {
  useDialog
} from 'naive-ui'
import createApi from './api'
import context from '@/context.js'
import sysLikesSimple from '@/sys/likes/sysLikes_simple.vue'

const dialog = useDialog()

const api = createApi(getCurrentInstance())
const props = defineProps(["modelId", "modelName"])

const pageInfo = ref({
  pageNo: 1,
  pageSize: 15,
  counts: 0
})

const comments = ref([])
const sysCommentMain = ref({
  fId: "",
  fPerson: {
    fId: '170ae6ff735e2df096472cf4bdba7da9'
  },
  fCreateTime: new Date(),
  fContent: "",
  fModelId: props.modelId,
  fModelName: props.modelName,
})

const showReply = ref(false)
const sysCommentReply = ref({
  fId: "",
  fPerson: {
    fId: '170ae6ff735e2df096472cf4bdba7da9'
  },
  fCreateTime: new Date(),
  fContent: "",
  fModelId: props.modelId,
  fModelName: props.modelName,
  fParent: {
    fId: ""
  },
  fReply: {
    fId: ""
  }
})

onMounted(() => {
  init()
})

function init(){
  method.list()
}

const method = {
  list : function(){
    api.list({
      query: {
        and: [
          {eq: {"fDelFlag": false}},
          {eq: {"fModelName": props.modelName}},
          {eq: {"fModelId": props.modelId}},
          {null: "fParent"}
        ]
      },
      pagenum: pageInfo.value.pageNo,
      pagesize: pageInfo.value.pageSize,
      order: ["fCreateTime asc"],
      output: ["?", "fPerson.?", "fChildren.?", "fChildren.fPerson.?", "fChildren.fParent.?", "fChildren.fReply.?", "fChildren.fReply.fPerson.?"]
    }).then(function(res) {
      if (res.status == 200) {
        var data = res.data
        pageInfo.value.counts = Math.ceil((data.total / data.size))
        comments.value.length = 0
        for (var i=0; i<data.list.length; i++) {
          comments.value.push(data.list[i])
          comments.value[i].show = false
          if (sysCommentReply.value.fParent.fId == comments.value[i].fId) {
            comments.value[i].show = true
          }
        }
      }
    })
  },

  submit : function(){
    method.init(sysCommentMain.value)
    sysCommentMain.value.fCreateTime = new Date()
    api.save(sysCommentMain.value).then(function(res){
      init()
    })
  },

  init : function(comment) {
    api.init().then(function(res){
      comment.fId = res.data.fId
    })
  },

  showChildren : function(comment) {
    comment.show = true
  },

  hideChildren : function(comment){
    comment.show = false
  },

  openReply : function(comment) {
    if (comment.fParent) {
      sysCommentReply.value.fParent.fId = comment.fParent.fId
    } else {
      sysCommentReply.value.fParent.fId = comment.fId
    }
    sysCommentReply.value.fReply.fId = comment.fId
    sysCommentReply.value.fContent = "@" + comment.fPerson.fName + " "
    showReply.value = true
  },

  replySubmit : function() {
    method.init(sysCommentReply.value)
    api.save(sysCommentReply.value).then(function(res){
      init()
      showReply.value = false
    })
  },

  deleteComment : function(comment) {
    dialog.warning({
      content : "是否要删除该评论！",
      negativeText : "取消",
      positiveText : "确认",
      onPositiveClick : function() {
        comment.fDelFlag = true
        api.save(comment).then(function(res){
          init()
        })
      }
    })
  }
}





</script>

<style scoped>

</style>
