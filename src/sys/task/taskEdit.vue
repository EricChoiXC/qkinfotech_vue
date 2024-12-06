<template>
  <n-card :title="taskMain.fName" style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="基本信息" tab="基本信息">
        <n-form
          ref="formRef"
          :model="taskMain"
          label-placement="left"
          label-width="150px"
        >
          <n-grid :cols="1" y-gap="10">
            <n-gi>
              <n-space justify="space-between">
                <p style="font-size: 16px; font-weight: bold">定时任务</p>
                <n-button-group>
                  <n-button type="primary" v-if="taskEditDisabled" @click="edit"
                    >编辑</n-button
                  >
                  <n-button
                    type="primary"
                    v-if="!taskEditDisabled"
                    @click="submit"
                    >提交</n-button
                  >
                  <n-button
                    type="info"
                    v-if="!isUsing && !taskEditDisabled"
                    @click="start"
                    >启用</n-button
                  >
                  <n-button
                    type="info"
                    v-if="isUsing && !taskEditDisabled"
                    @click="finish"
                    >禁用</n-button
                  >
                  <n-button
                    type="error"
                    v-if="taskMain.fStockTask == 'false'"
                    @click="del"
                    >删除</n-button
                  >
                  <n-button type="warning" @click="close">关闭</n-button>
                </n-button-group>
              </n-space>
            </n-gi>
            <n-gi>
              <n-form-item label="任务名称">
                <n-input
                  v-model:value="taskMain.fName"
                  :disabled="taskEditDisabled"
                ></n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="任务组">
                <n-input
                  v-model:value="taskMain.fGroup"
                  :disabled="taskEditDisabled"
                ></n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="任务Bean">
                <n-input
                  v-model:value="taskMain.fTaskBeanName"
                  :disabled="taskEditDisabled"
                ></n-input>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="触发时间">
                <n-input-group>
                  <n-select
                    style="width: 30%"
                    :options="triggerTypes"
                    v-model:value="taskMain.fTriggerType"
                    :disabled="taskEditDisabled"
                  ></n-select>
                  <n-input
                    style="width: 70%"
                    v-model:value="taskMain.fTriggerCron"
                    v-if="taskMain.fTriggerType == 'cron'"
                    placeholder="请输入cron表达式"
                    :disabled="taskEditDisabled"
                  ></n-input>
                  <n-date-picker
                    type="datetime"
                    v-model:formatted-value="taskMain.fTriggerTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-else-if="taskMain.fTriggerType == 'onetime'"
                    :disabled="taskEditDisabled"
                  ></n-date-picker>
                  <n-input-number
                    v-model:value="taskMain.fTriggerFormula"
                    v-else
                    :disabled="taskEditDisabled"
                  ></n-input-number>
                </n-input-group>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="下次运行时间">
                <span v-if="isUsing">
                  <n-date-picker
                    type="datetime"
                    v-model:formatted-value="taskMain.fScheduledTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="taskEditDisabled"
                  ></n-date-picker>
                </span>
                <span v-else> 禁用中 </span>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="创建时间">
                {{ taskMain.fCreateTime }}
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="运行记录" tab="运行记录">
        <n-data-table
          :columns="columns"
          :data="data"
          :row-props="rowProps"
          :pagination="pagination"
        >
        </n-data-table>
        <n-modal
          v-model:show="showModal"
          style="width: 60%"
          preset="dialog"
          title="任务记录"
          :mask-closable="false"
        >
          <n-card title="日志记录">
            <n-data-table
              :columns="detailColumns"
              :data="detailData"
              :max-height="400"
              virtual-scroll
            >
            </n-data-table>
          </n-card>
        </n-modal>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import createApi from './api'
import { useMessage } from 'naive-ui'

function getTimeStr() {
  var time = new Date()
  var str = ''
  str += time.getFullYear() + '-'
  if (time.getMonth() < 9) {
    str += '0'
  }
  str += time.getMonth() + 1 + '-'
  if (time.getDate() < 10) {
    str += '0'
  }
  str += time.getDate() + ' '
  if (time.getHours() < 10) {
    str += '0'
  }
  str += time.getHours() + ':'
  if (time.getMinutes() < 10) {
    str += '0'
  }
  str += time.getMinutes() + ':'
  if (time.getSeconds() < 10) {
    str += '0'
  }
  str += time.getSeconds()
  return str
}

export default defineComponent({
  props: {
    taskMainId: String,
    taskEditDisabled: Boolean,
  },
  emits: ['closeModal'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const message = useMessage()

    const taskMain = reactive({
      fName: '',
      fId: '',
      fCreateTime: '',
      fGroup: '',
      fTaskBeanName: '',
      fTriggerType: '',
      fTriggerFormula: '',
      fTriggerTime: '2000-01-01 00:00:00',
      fTriggerCron: '',
      fScheduledTime: '2000-01-01 00:00:00',
      fStockTask: true,
    })
    const isUsing = ref(true)
    const taskEditDisabled = ref(props.taskEditDisabled)
    const triggerTypes = reactive([
      {
        label: 'cron表达式',
        value: 'cron',
      },
      {
        label: '频率（10秒内）',
        value: 'frequency',
      },
      {
        label: '间隔时间（秒）',
        value: 'interval',
      },
      {
        label: '只触发一次',
        value: 'onetime',
      },
    ])

    const columns = [
      {
        title: '运行时间',
        key: 'fStartTime',
      },
      {
        title: '运行结果',
        key: 'fStatus',
        render(row) {
          return h(NEllipsis, {}, runStatus[row.fStatus])
        },
      },
    ]

    const runStatus = {
      0: '等待',
      1: '运行中',
      2: '已完成',
      3: '失败',
    }

    const data = reactive([])
    const showModal = ref(false)
    const taskLogId = ref('')

    const detailColumns = [
      {
        title: '记录时间',
        key: 'fTime',
        width: '20%',
      },
      {
        title: '信息',
        key: 'fContent',
      },
    ]
    const detailData = reactive([])

    const rowProps = function (row) {
      return {
        onClick: function () {
          taskLogId.value = row.fId
          var param = []
          param.push({ eq: { fTaskLogId: row.fId } })
          api.logDetailList({ query: param }).then(function (response) {
            detailData.splice(0, detailData.length)
            if (response.status == '200') {
              for (var i = 0; i < response.data.list.length; i++) {
                detailData.push(response.data.list[i])
              }
            }
            detailData.sort('fTime', 'ascend')
          })
          showModal.value = true
        },
      }
    }

    function load() {
      //读取定时任务信息
      api.load({ fId: props.taskMainId }).then(function (response) {
        console.log(response)
        if (response.status == '200') {
          for (var key in response.data) {
            if (key == 'customerDataMap') {
              continue
            }
            taskMain[key] = response.data[key]
            if (key == 'fScheduledTime') {
              if (response.data[key] == '9999-01-01 00:00:00') {
                isUsing.value = false
              }
            }
          }
        }
        var nowTime = new Date()
        taskMain.fTriggerType = taskMain.fTaskTrigger.trigger.split(':')[0]
        taskMain.fTriggerCron = ''
        taskMain.fTriggerFormula = ''
        taskMain.fTriggerTime = getTimeStr()
        if (taskMain.fTriggerType == 'cron') {
          taskMain.fTriggerCron = taskMain.fTaskTrigger.trigger.split(':')[1]
        } else if (taskMain.fTriggerType == 'onetime') {
          taskMain.fTriggerTime = taskMain.fTaskTrigger.trigger.split(':')[1]
        } else {
          taskMain.fTriggerFormula = taskMain.fTaskTrigger.trigger.split(':')[1]
        }
        console.log(taskMain)
      })

      var param = []
      param.push({ eq: { fTaskId: props.taskMainId } })
      //读取定时任务记录
      api.logList({ query: param }).then(function (response) {
        if (response.status == '200') {
          data.length = 0
          for (var i = 0; i < response.data.list.length; i++) {
            data.push(response.data.list[i])
          }
        }
      })
    }
    load()

    function edit() {
      load()
      taskEditDisabled.value = false
    }

    function submit() {
      if (taskMain.fTriggerType == 'cron') {
        taskMain.fTaskTrigger.trigger = 'cron:' + taskMain.fTriggerCron
      } else if (taskMain.fTriggerType == 'onetime') {
        taskMain.fTaskTrigger.trigger = 'onetime:' + taskMain.fTriggerTime
      } else {
        taskMain.fTaskTrigger.trigger =
          taskMain.fTriggerType + ':' + taskMain.fTriggerFormula
      }
      api
        .taskActionHandle(taskMain)
        .then(function (response) {
          taskEditDisabled.value = true
        })
        .catch(function (response) {
          message.info('submit error')
          message.info(response)
        })
      //taskEditDisabled.value = true
    }

    function close() {
      context.emit('closeModal')
    }

    function start() {
      isUsing.value = true
      taskMain.fScheduledTime = getTimeStr()
    }

    function finish() {
      isUsing.value = false
      taskMain.fScheduledTime = '9999-01-01 00:00:00'
    }

    function del() {
      api
        .delete({ fId: taskMain.fId })
        .then(function (response) {
          close()
        })
        .catch(function (response) {
          message.info('delete error')
          message.info(response)
        })
    }

    const pagination = reactive({
      page: 1,
      pageSize: 5,
      showSizePicker: true,
      pageSizes: [3, 5, 7],
      onChange: (page) => {
        pagination.page = page
      },
      onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize
        pagination.page = 1
      },
    })

    return {
      message,
      taskMain,
      taskEditDisabled,
      triggerTypes,
      isUsing,
      load,
      edit,
      submit,
      close,
      start,
      finish,
      del,
      columns,
      data,
      rowProps,
      runStatus,
      showModal,
      pagination,
      taskLogId,
      detailColumns,
      detailData,
    }
  },
})
</script>

<style></style>
