<!--我的流程-->
<template>
  <n-card :footer-style="{ justifyContent: 'end' }" header-style="">
    <template #header>
      <div class="header-div">
        <div style="padding-left: 20px;font-weight: bold">
          <n-icon style="padding-top:4px" size="20">
            <Notifications />
          </n-icon>
          {{ AssemblyName }}
        </div>
      </div>
    </template>
    <div v-if="dataworp.data.length == 0">
      <div style="width:100%; display:flex; justify-content: center;">
        <img src="/public/noData.jpg" style="max-height: 300px">
      </div>
    </div>
    <n-list hoverable clickable>
      <n-list-item v-for="(item, index) in dataworp.data" :key="index">
        <n-button text @click="clickSchedule(item)" style="display:inline-block; width:100%">
          <span class="cate" style="color:brown">[{{item.taskType}}]</span>【
          <n-ellipsis>
            {{item.proj_id}}】{{ item.proj_name }}
          </n-ellipsis>
          <span style="color: darkgreen">{{item.date}}</span>
        </n-button>
      </n-list-item>
    </n-list>
  </n-card>
</template>
<script>
  import { defineComponent, onMounted, ref, computed } from 'vue'
  import { DiceSharp, MoveOutline, EllipsisHorizontal, Notifications } from '@vicons/ionicons5'
  import createApi from './api'
  import storage from '@/utils/storage'
  import baseUrl from '@/utils/baseUrl'
  import context from '@/context.js'

  import layout from "@/layout/layout";


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
      MaxItems: { type: Number, default: 7, required: false },
    },
    components: {
      DiceSharp,
      Notifications,
      MoveOutline,
      EllipsisHorizontal,
    },
    setup(props) {
      const api = createApi(getCurrentInstance())
      const dataworp = ref({
        data: [],
        host: null,
        url: null,
      })
      const loadData = () => {
        var param = {}
        param.s = context.user()
        param.date = (new Date()).toISOString().substr(0, 10)
        //param.date = '2024-08-11'
        param.day = 7
        api.oaQuestMap(param)
          .then(function(res) {
            var url = baseUrl.oaUrl + "/j/api/sitc/jy/prj/get_project_task_by_date.jsp"
            api.getProjectTaskByDate(res.oaQuest)
              .then(function(res2) {
                for (var i=0; i<res2.list.length; i++) {
                  var temp = res2.list[i]
                  dataworp.value.data.push(temp)
                }
                var form = {
                  fCreateTime : new Date(),
                  fInterfaceName : "近期日程接口",
                  fInterfaceUrl : url,
                  fInterfaceInfo : JSON.stringify(res2),
                  fInputParameter : JSON.stringify(param),
                  fInterfaceStatus : "1"
                }
                api.interfaceLogSave(form)
              }).catch(function(error){
                var form = {
                  fCreateTime : new Date(),
                  fInterfaceName : "近期日程接口",
                  fInterfaceUrl : url,
                  fInterfaceInfo : JSON.stringify(error),
                  fInputParameter : JSON.stringify(param),
                  fInterfaceStatus : "2"
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
      onMounted(() => {
        loadData()
      })

      //跳转日程
      function clickSchedule(schedule) {
        if (schedule.jyProjId){
         var param = [{"eq" : {"fProtocolNo" : schedule.jyProjId}}]
          var query = {"and" : param}
          api.projectMainList({query : query})
            .then(function(res){
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
            id : context.user(),
            url : baseUrl.oaUrl + "/a/project/proj_simple.asp?id=" + schedule.proj_id
          }
          api.oaQuest(param)
            .then(function(result){
              var oaQuest = result.oaQuest
              window.open(baseUrl.oaUrl + "/j/sitc/jy_sign.jsp?" + oaQuest, "_blank")
            })
        }
      }

      return {
        dataworp,
        limitedItems,
        handleLink,
        clickSchedule
      }
    },
  })
</script>
