<!--
导出页面
  module : 类请求路径，即model的@SimpleModel.url；必填
 -->
<template>
  <!-- 导出按钮 -->
  <n-button type="primary" @click="openExportModal">导出</n-button>

  <!-- 选择导出字段弹窗 -->
  <n-modal
    v-model:show="exportModal"
    style="width: 80%; height: 80%"
    preset="dialog"
    title="导出"
  >
    <n-form label-placement="left" label-width="150px" ref="formRef">
      <n-form-item label="导出字段">
        <n-checkbox-group v-model:value="selectedKeys">
          <n-space>
            <n-checkbox v-for="key in keys" :value="key.value">
              {{ key.value }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item v-for="obj in objectKeys" :label="obj.name">
        <n-checkbox-group v-model:value="selectedKeys">
          <n-space>
            <n-checkbox v-for="key in obj.keys" :value="obj.name + '.' + key">
              {{ obj.name }}.{{ key }}
            </n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-space justify="center">
        <n-button type="primary" @click="doExport">导出</n-button>
        <n-button type="error" @click="closeExportModal">取消</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script>
import createApi from './api'
import { useMessage } from 'naive-ui'
import { defineComponent, reactive } from 'vue'
import baseUrl from '@/utils/baseUrl'

export default defineComponent({
  props: {
    module: String,
  },
  setup(props, ctx) {
    const api = createApi(getCurrentInstance())
    const message = useMessage()
    const formRef = ref(null)

    const keys = reactive([])
    const objectKeys = reactive([])
    const selectedKeys = ref([])

    const exportModal = ref(false)

    function openExportModal() {
      exportModal.value = true
      selectedKeys.value.length = 0
      keys.length = 0
      //读取模块的基本字段
      api.getBaseFields(props.module, null).then(function (response) {
        if (response.status == 200) {
          for (var i = 0; i < response.data.result.length; i++) {
            if (response.data.result[i].keys) {
              objectKeys.push({
                name: response.data.result[i].value,
                keys: response.data.result[i].keys,
              })
            } else {
              keys.push(response.data.result[i])
            }
          }
        }
      })
    }

    function doExport() {
      var param = {}
      //var columns = []
      param['columns'] = selectedKeys.value
      // var param = {"columns" : ['fName','fGender','fFullName','fIsBusiness']}
      api
        .export(props.module, param)
        // originAxios({
        //   method: 'post',
        //   responseType: 'blob',
        //   url: baseUrl.pmUrl + '/pm/' + props.module + '/export',
        //   data: param,
        // })
        .then(function (response) {
          message.info('已导出数据')
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })

          // 创建一个 <a> 元素，用于保存文件
          const a = document.createElement('a')
          a.href = window.URL.createObjectURL(blob)
          a.download = '导出.xlsx' // 设置下载的文件名，替换为实际的文件名

          // 将 <a> 元素添加到页面中，并模拟点击下载
          document.body.appendChild(a)
          setTimeout(() => {
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(a.href)
          }, 100)
        })
        .catch(function (response) {
          message.error('导出失败：' + response)
        })
    }

    function closeExportModal() {
      exportModal.value = false
    }

    function hasKey(key) {
      console.log(key)
      if (key == undefined) return false
      if (key.keys != undefined) {
        return true
      }
      return false
    }

    return {
      message,
      formRef,

      exportModal,

      selectedKeys,
      keys,
      objectKeys,

      openExportModal,
      doExport,
      closeExportModal,
      hasKey,
    }
  },
})
</script>

<style></style>
