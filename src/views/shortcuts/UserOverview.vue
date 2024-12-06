<!--我的流程-->
<template>
  <n-card v-if="userType!=='2'" :segmented="{
            content: true,
            header: 'soft',
          }" size="small">
    <template #header>
      <div class="header-div">
        <div style="font-weight: bold">
          <n-icon style="padding-top:4px" size="20">
            <Notifications style="color:blue"/>
          </n-icon>
          近期工作概况
        </div>
      </div>
    </template>
    <n-grid :cols="4" :y-gap="16" :x-gap="16">
      <n-gi>
        <n-tag class="tag-title" type="success" @click="funcs.openEkp('/sitc/project/sitc_project_visit_main/index.jsp?j_iframe=true&j_aside=false')">
          <div class="tag-text">
            开拓中的项目
          </div>
          <div class="tag-two-text">
            <span>{{workBenchValue.openingProject}}</span>
            <span class="tag-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                   y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"
                   width="20px" height="20px" color="#18a058">
                <g><path d="M48,256c0,114.9,93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48C141.1,48,48,141.1,48,256z M292.5,256
		l-81.9-81.1c-7.5-7.5-7.5-19.8,0-27.3c7.5-7.5,19.8-7.5,27.3,0l95.4,95.7c7.3,7.3,7.5,19.1,0.6,26.6l-94,94.3
		c-3.8,3.8-8.7,5.7-13.7,5.7c-4.9,0-9.9-1.9-13.6-5.6c-7.5-7.5-7.6-19.7,0-27.3L292.5,256z" style="fill:#18a058;"></path></g></svg>
            </span>
          </div>
        </n-tag>
      </n-gi>
      <n-gi>
        <n-tag class="tag-title" type="info" @click="funcs.openOa('/j/sitc/prj/prj_list_process.jsp')">
          <div class="tag-text">
            进行中的项目
          </div>
          <div class="tag-two-text">
            <span>{{workBenchValue.processProject}}</span>
            <span class="tag-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                   y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"
              width="20px" height="20px" color="#18a058">
                <g><path d="M48,256c0,114.9,93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48C141.1,48,48,141.1,48,256z M292.5,256
		l-81.9-81.1c-7.5-7.5-7.5-19.8,0-27.3c7.5-7.5,19.8-7.5,27.3,0l95.4,95.7c7.3,7.3,7.5,19.1,0.6,26.6l-94,94.3
		c-3.8,3.8-8.7,5.7-13.7,5.7c-4.9,0-9.9-1.9-13.6-5.6c-7.5-7.5-7.6-19.7,0-27.3L292.5,256z" style="fill:#2080f0;"></path></g></svg></span>
          </div>
        </n-tag>
      </n-gi>
      <n-gi>
        <n-tag class="tag-title" type="warning" @click="funcs.openOa('/j/sitc/prj/limit_date_list.jsp')">
          <div class="tag-text">
            临近结束的项目
          </div>
          <div class="tag-two-text">
            <span>{{workBenchValue.limitedProject}}</span>
            <span class="tag-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                   y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"
              width="20px" height="20px" color="#18a058">
                <g><path d="M48,256c0,114.9,93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48C141.1,48,48,141.1,48,256z M292.5,256
		l-81.9-81.1c-7.5-7.5-7.5-19.8,0-27.3c7.5-7.5,19.8-7.5,27.3,0l95.4,95.7c7.3,7.3,7.5,19.1,0.6,26.6l-94,94.3
		c-3.8,3.8-8.7,5.7-13.7,5.7c-4.9,0-9.9-1.9-13.6-5.6c-7.5-7.5-7.6-19.7,0-27.3L292.5,256z" style="fill:#f0a020;"></path></g></svg></span>
          </div>
        </n-tag>
      </n-gi>
      <n-gi>
        <n-tag class="tag-title" type="error" @click="funcs.openOa('/j/sitc/prj/limit_date_list_100.jsp')">
          <div class="tag-text">
            终止的项目
          </div>
          <div class="tag-two-text">
            <span>{{workBenchValue.finishProject}}</span>
            <span class="tag-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                   y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"
              width="20px" height="20px" color="#18a058">
                <g><path d="M48,256c0,114.9,93.1,208,208,208c114.9,0,208-93.1,208-208S370.9,48,256,48C141.1,48,48,141.1,48,256z M292.5,256
		l-81.9-81.1c-7.5-7.5-7.5-19.8,0-27.3c7.5-7.5,19.8-7.5,27.3,0l95.4,95.7c7.3,7.3,7.5,19.1,0.6,26.6l-94,94.3
		c-3.8,3.8-8.7,5.7-13.7,5.7c-4.9,0-9.9-1.9-13.6-5.6c-7.5-7.5-7.6-19.7,0-27.3L292.5,256z" style="fill:#d03050;"></path></g></svg></span>
          </div>
        </n-tag>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script>
import {defineComponent, onMounted, ref, computed, getCurrentInstance} from 'vue'
import {DiceSharp, MoveOutline, EllipsisHorizontal, Notifications} from '@vicons/ionicons5'
import createApi from './api'
import storage from '@/utils/storage'
import baseUrl from '@/utils/baseUrl'
import context from '@/context.js'

import layout from "@/layout/layout";
import singleLoginApi from "@/utils/singleLogin";
import interfaceUtilApi from "@/utils/interfaceUtil";


export default defineComponent({
  name: 'UserProject',
  props: {
    AssemblyName: {
      type: String,
      default: '近期工作提醒',
      required: true,
    },
    DataKey: {
      type: String,
      default: 'UserProject',
      required: true,
    },
    AssemblyIcon: String,
    MaxItems: {type: Number, default: 7, required: false},
  },
  components: {
    DiceSharp,
    Notifications,
    MoveOutline,
    EllipsisHorizontal,
  },
  setup(props) {
    const userType = ref("0") //用户类型
    const currentInstance = getCurrentInstance()
    const api = createApi(currentInstance)
    const singleLogin = singleLoginApi(currentInstance)
    const interfaceUtil = interfaceUtilApi(currentInstance)
    const dataworp = ref({
      data: [],
      host: null,
      url: null,
    })
    const workBenchValue = ref({
      openingProject: 0,
      processProject: 0,
      limitedProject: 0,
      finishProject: 0
    })
    const loadData = () => {
      var param = {}
      param.s = context.user()
      param.date = (new Date()).toISOString().substr(0, 10)
      //param.date = '2024-08-11'
      param.day = 7
      api.oaQuestMap(param)
        .then(function (res) {
          var url = baseUrl.oaUrl + "/j/api/sitc/jy/prj/get_project_task_by_date.jsp"
          api.getProjectTaskByDate(res.oaQuest)
            .then(function (res2) {
              for (var i = 0; i < res2.list.length; i++) {
                var temp = res2.list[i]
                dataworp.value.data.push(temp)
              }
              var form = {
                fCreateTime: new Date(),
                fInterfaceName: "近期日程接口",
                fInterfaceUrl: url,
                fInterfaceInfo: JSON.stringify(res2),
                fInputParameter: JSON.stringify(param),
                fInterfaceStatus: "1"
              }
              api.interfaceLogSave(form)
            }).catch(function (error) {
            var form = {
              fCreateTime: new Date(),
              fInterfaceName: "近期日程接口",
              fInterfaceUrl: url,
              fInterfaceInfo: JSON.stringify(error),
              fInputParameter: JSON.stringify(param),
              fInterfaceStatus: "2"
            }
            api.interfaceLogSave(form)
          })
        })
    }
    const limitedItems = computed(() => {
      return dataworp.value.data.slice(0, props.MaxItems)
    })
    const handleLink = (url) => {
      window.open(`${dataworp.value.host}${url}`)
    }
    onMounted(async () => {
      await api.orgPersonLoad({fId:context.user()})
        .then(function (res) {
          userType.value = res.data.fEkpUserType
        })
      if (userType.value == "1") {
        loadData()
        funcs.loadProjectInfo()
      }
    })

    //跳转日程
    function clickSchedule(schedule) {
      if (schedule.jyProjId) {
        var param = [{"eq": {"fProtocolNo": schedule.jyProjId}}]
        var query = {"and": param}
        api.projectMainList({query: query})
          .then(function (res) {
            if (res.status == 200 && res.data.list.length == 1) {
              window.open(baseUrl.pmUrl + "/opdesk/projectManagement/implementation/project-view?fId=" + res.data.list[0].fId, "_blank")
            }
          })
        layout.open({
          label: "项目信息查询",
          key: "project-overview",
          component: "/apps/project/application/projectApplication_finishList.vue"
        });
      } else if (schedule.proj_id) {
        var param = {
          id: context.user(),
          url: baseUrl.oaUrl + "/a/project/proj_simple.asp?id=" + schedule.proj_id
        }
        api.oaQuest(param)
          .then(function (result) {
            var oaQuest = result.oaQuest
            window.open(baseUrl.oaUrl + "/j/sitc/jy_sign.jsp?" + oaQuest, "_blank")
          })
      }
    }

    const funcs = {
      openOa : function(target){
        singleLogin.oaJump(baseUrl.oaJumpUrl + target)
      },
      openEkp : function(target){
        singleLogin.ekpJump(baseUrl.ekpUrl + target)
      },
      loadProjectInfo : async function(){
        var res = await interfaceUtil.loadWorkbench()
        if (res.STATUS === "S") {
          res.list.forEach(temp => {
            if (temp.name === '临近限制日期项目') {
              workBenchValue.value.limitedProject = temp.count
            }
            if (temp.name === '终止项目') {
              workBenchValue.value.finishProject = temp.count
            }
            if (temp.name === '开拓中的项目') {
              workBenchValue.value.openingProject = temp.count
            }
            if (temp.name === '进行中的项目') {
              workBenchValue.value.processProject = temp.count
            }
          })
        }
      }
    }

    return {
      dataworp,
      limitedItems,
      handleLink,
      clickSchedule,
      funcs,
      workBenchValue,
      userType
    }
  },
})
</script>

<style>
.tag-title {
  height: 70px;
  width: 100%;
  border-radius: 10px;
  font-size: 16px;
  padding: 20px;

  .tag-text {
    color: #000;
    margin-bottom: 10px;
  }

  .tag-two-text {
    font-weight: bold;
  }

  .tag-icon {
    position: absolute;
    right: 10px;
    top: 26px;
  }
}
</style>
