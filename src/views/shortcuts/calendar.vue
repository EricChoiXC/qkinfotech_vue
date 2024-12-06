<template>
  <n-card
    :segmented="{
      content: true,
      header: 'soft',
    }"
    size="small"
    style="height: 100%"
  >
    <template #header-extra>
      <div @click="showMore()">更多</div>
    </template>
    <template #header>
      <div style="font-weight: bold">
        <n-icon style="padding-top: 4px" size="20">
          <ICalendar style="color: blue"></ICalendar>
        </n-icon>
        日程
      </div>
    </template>
    <div>
      <div
        style="display: flex; width: 100%; flex-direction: column; gap: 12px"
      >
        <VCalendar
          color="indigo"
          :attributes="attrs"
          title-position="left"
          @dayclick="dayclick"
          ref="calendar"
          style="width: 100%"
          @did-move="pageClick"
          borderless
        ></VCalendar>

        <hr/>


        <n-list>
          <template #header>
            <div>
              <span style="font-weight: bold; font-size: 16px">当日事项</span>&nbsp;
              <span style="font-weight: bold; font-size: 14px">{{ schedule.length }}</span>
            </div>
          </template>
          <n-scrollbar :style="{height: '100%', maxHeight: (userType == '1' ? '270px' : '120px')}" v-if="schedule.length > 0">
            <n-list-item v-for="sche in schedule" @click="clickSchedule(sche)" style="height: auto">
              <template #prefix>
              </template>
              <n-thing>
                <template #header>
                  <span style="color: blue"> ● </span>
                  <span v-if="sche.startTime">{{ sche.startTime }} ~ {{ sche.endTime }}</span>
                  <span v-else>{{sche.date}}</span>
                </template>
                <template #description>
                  {{ sche.type }}【{{ sche.projectId }}】
                </template>
                <span style="color: gray">
                  {{ sche.title }}
                </span>
              </n-thing>
            </n-list-item>
          </n-scrollbar>
          <n-empty v-if="schedule.length === 0" description="您当天没有日程 休息一下" size="huge"
                   :style="{height: '100%', maxHeight: (userType == '1' ? '270px' : '120px'), justifyContent: 'center'}">
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                    <path
                      d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1c.83-.642 2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1"></path>
                    <path d="M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2"></path>
                    <path d="M12 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2"></path>
                    <path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-5z"></path>
                    <path d="M16.746 16.726a3 3 0 1 0 .252-5.555"></path>
                  </g>
                </svg>
              </n-icon>
            </template>
          </n-empty>
        </n-list>
      </div>
    </div>

    <template #footer>
      <n-space justify="end">
        <n-button size="tiny" @click="pageClick(currentMonth)">
          <template #icon>
            <n-icon size="15">
              <MdRefresh/>
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-card>

  <n-modal v-model:show="showMoreModal" title="更多日程" preset="dialog" style="width: 40vw">
    <n-scrollbar style="max-height: 80vh" trigger="none">
      <n-list clickable hoverable>
        <n-list-item v-for="sche in moreDaily" @click="clickSchedule(sche)" style="height: auto">
          <template #prefix>
          </template>
          <n-thing>
            <template #description>
              <n-space>
                <span style="color: blue">●</span>
                <span>{{ sche.date }}</span>
                <span v-if="sche.startTime">{{sche.startTime}} ~ {{sche.endTime}}</span>
                <span>{{ sche.taskType }}【{{ sche.proj_id }}】</span>
                <span style="color: gray">
                  {{ sche.proj_name }}
                </span>
              </n-space>
            </template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-scrollbar>
  </n-modal>
</template>
<script setup>
import {ref, onMounted, getCurrentInstance} from 'vue'
import storage from '@/utils/storage' //随便写的
import {addDays, isYesterday} from 'date-fns/esm'
import {Calendar as VCalendar, DatePicker} from 'v-calendar'
import 'v-calendar/style.css'
import createApi from './api'
import {Calendar as ICalendar, EllipsisHorizontal} from '@vicons/ionicons5'
import baseUrl from '@/utils/baseUrl'
import context from '@/context.js'

import layout from '@/layout/layout'
import {MdRefresh} from "@vicons/ionicons4";

const api = createApi(getCurrentInstance())
const selectedDate = ref('') //当前选中日期
const currentMonth = ref('');//当前月份
const schedule = reactive([]) //日程信息
const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
])
const moreDaily = ref([])
const calendar = ref(null)

//点击日期，加载当日日程信息
function dayclick(date) {
  selectedDate.value = date.ariaLabel.split('星期')[0]
  loadSchedule(date)
}

//从attrs中读取当日日程信息
function loadSchedule(date) {
  schedule.length = 0
  var atts = calendar.value.attributes
  for (var i = 0; i < atts.length; i++) {
    var att = atts[i]
    if (att.key.indexOf(date.id) === 0) {
      for (var j = 0; j < att.label.length; j++) {
        schedule.push(att.label[j])
      }
    }
  }
}

// 切换月份，读取当月所有日程信息
function pageClick(date) {
  attrs.value.length = 0
  attrs.value.push({
    key: 'today',
    highlight: true,
    dates: new Date(),
  })
  if(date instanceof Array){
    currentMonth.value = date[0].id;
    loadMonthSchedule(date[0].id)
  }else{
    loadMonthSchedule(date)
  }
}

let url = ref('')
let host = ref('')

function handleUpdateValue(_, {year, month, date}) {
  // let url = "/km/calendar/";
  window.open(host + url)
}

// 读取当月所有日程信息
async function loadMonthSchedule(month) {
  moreDaily.value.length = 0
  if (userType.value != "1") {
    return
  }
  var param = {}
  param.s = context.user()
  param.month = month
  await api.oaQuestMap(param).then(async function (res) {
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/get_project_task_by_date.jsp'
    await api
      .getProjectTaskByDate(res.oaQuest)
      .then(function (res2) {
        var maps = {}
        for (var i = 0; i < res2.list.length; i++) {
          var temp = res2.list[i]
          moreDaily.value.push(temp)
          if (maps[temp.date]) {
            maps[temp.date].label.push({
              date: temp.date,
              startTime: temp.startTime,
              endTime: temp.endTime,
              type: temp.taskType,
              title: temp.proj_name,
              projectId: temp.proj_id,
              jyProId: temp.jyProId,
            })
          } else {
            maps[temp.date] = {
              key: temp.date,
              dot: 'red',
              dates: temp.date,
              label: [
                {
                  date: temp.date,
                  startTime: temp.startTime,
                  endTime: temp.endTime,
                  type: temp.taskType,
                  title: temp.proj_name,
                  projectId: temp.proj_id,
                  jyProjId: temp.jyProjId,
                },
              ],
            }
          }
        }
        for (var key in maps) {
          attrs.value.push(maps[key])
        }
        var form = {
          fCreateTime: new Date(),
          fInterfaceName: '日程接口',
          fInterfaceUrl: url,
          fInterfaceInfo: JSON.stringify(res2),
          fInputParameter: JSON.stringify(param),
          fInterfaceStatus: '1',
        }
        api.interfaceLogSave(form)
      })
      .catch(function (error) {
        var form = {
          fCreateTime: new Date(),
          fInterfaceName: '日程接口',
          fInterfaceUrl: url,
          fInterfaceInfo: JSON.stringify(error),
          fInputParameter: JSON.stringify(param),
          fInterfaceStatus: '2',
        }
        api.interfaceLogSave(form)
      })
  })
  console.log(moreDaily.value.sort(function(a, b) {
    return (a.date > b.date) ? 1 : -1
  }))
  console.log(moreDaily.value)
}

async function loadMonthSchedule2(month) {
  var param = {}
  param.s = context.user()
  param.month = month
  await api.oaQuestMap(param).then(async function (res) {
    const res2 = {
      STATUS: 'S',
      date2: '2024-08-31',
      date1: '2024-08-01',
      list: [
        {
          date: '2024-08-23',
          taskType: '未知类型',
          manager: '张勍',
          proj_name: '肯德基没有鸡',
          jyProjId: '01J5WENDZQ3N0TNGW0B97T3NN5',
          department: '项目二部',
          proj_id: '0602213002',
        },
        {
          date: '2024-08-23',
          taskType: '未知类型',
          manager: '张勍',
          proj_name: '农夫山泉-东方树叶',
          jyProjId: '01J5YC0ZYZ0CP37WW29AC9EHEA',
          department: '项目二部',
          proj_id: '0702111001',
        },
        {
          date: '2024-08-23',
          taskType: '资格预审会',
          manager: '张勍',
          proj_name: '农夫山泉-东方树叶',
          jyProjId: '01J5YC0ZYZ0CP37WW29AC9EHEA',
          department: '项目二部',
          proj_id: '0702111001',
        },
      ],
    }
    var maps = {}
    for (var i = 0; i < res2.list.length; i++) {
      var temp = res2.list[i]
      if (maps[temp.date + '-' + temp.taskType]) {
        maps[temp.date + '-' + temp.taskType].label.push({
          startTime: temp.date,
          endTime: temp.date,
          type: temp.taskType,
          title: temp.proj_name,
          projectId: temp.proj_id,
          jyProId: temp.jyProId,
        })
      } else {
        maps[temp.date + '-' + temp.taskType] = {
          key: temp.date + '-' + temp.taskType,
          dot: 'red',
          dates: temp.date,
          label: [
            {
              startTime: temp.date,
              endTime: temp.date,
              type: temp.taskType,
              title: temp.proj_name,
              projectId: temp.proj_id,
              jyProjId: temp.jyProjId,
            },
          ],
        }
      }
    }
    for (var key in maps) {
      attrs.value.push(maps[key])
      moreDaily.value.push(maps[key])
    }

  })
}

//跳转日程
function clickSchedule(schedule) {
  if (schedule.jyProjId) {
    var param = [{eq: {fProtocolNo: schedule.jyProjId}}]
    var query = {and: param}
    api.projectMainList({query: query}).then(function (res) {
      if (res.status == 200 && res.data.list.length == 1) {
        window.open(
          baseUrl.pmUrl +
          '/opdesk/projectManagement/implementation/project-view?fId=' +
          res.data.list[0].fId,
          '_blank',
        )
      }
    })
    layout.open({
      label: '项目信息查询',
      key: 'project-overview',
      component: '/apps/project/application/projectApplication_finishList.vue',
    })
  } else if (schedule.projectId) {
    var param = {
      id: context.user(),
      url:
        baseUrl.oaJumpUrl + '/a/project/proj_simple.asp?id=' + schedule.projectId,
    }
    api.oaQuest(param).then(function (result) {
      var oaQuest = result.oaQuest
      window.open(baseUrl.oaJumpUrl + '/j/sitc/jy_sign.jsp?' + oaQuest, '_blank')
    })
  }
  showMoreModal.value = false
}

//初始化，当天时间
var nowDate = new Date()
selectedDate.value =
  nowDate.getFullYear() +
  '年' +
  (nowDate.getMonth() + 1) +
  '月' +
  nowDate.getDate() +
  '日'
currentMonth.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1);

const userType = ref("0")

const refreshInterval = 30 * 60 * 1000; // 设置定时器时间为30分钟

//初始化后，加载用户的当月日程信息
onMounted(async () => {
  await loadUserMonthSchedule();

  const intervalId = setInterval(loadUserMonthSchedule, refreshInterval);

  // 在组件卸载时清除定时器
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
})

const loadUserMonthSchedule = async () => {
  await api.orgPersonLoad({fId: context.user()})
    .then(function (res) {
      userType.value = res.data.fEkpUserType
    })
  await loadMonthSchedule(new Date().toISOString().substr(0, 7))
  dayclick({
    id: nowDate.toISOString().split('T')[0],
    ariaLabel: selectedDate.value + '星期',
  })
}

const showMoreModal = ref(false)
function showMore() {
  showMoreModal.value = true
}
</script>

<style lang="scss" scoped>
/*:deep(.n-card) {
height: 360px;
border-radius: 8px;
width: calc(100% - 15px);
display: inline-flex;
box-sizing: border-box;
margin: 5px;
}*/
:deep(.n-card-header__extra:hover) {
  cursor: pointer !important;
}

.icon-item {
  display: inline-block;
  //width: 100px; /* 或其他宽度 */
  box-sizing: border-box;
  border: 1px solid rgb(239, 239, 245);
  padding: 5px;
  text-align: center;
  margin: 10px 0px 0px 17px;

  span {
    display: block;
  }
}

.box {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.box1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 定义显示的最大行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  //overflow: hidden;
  //white-space: nowrap;
  //text-overflow: ellipsis;
}

.subject {
  color: #13aaff;
}

.subject :hover {
  color: #8a6d3b;
}
</style>
