<!--
导入组件：
  module:类请求路径，即model的@SimpleModel.url；必填
  class:类的完整包名；必填
  @closeImportModalFunc : 关闭上传导入页面时调用方法，常用于刷新列表页面
 -->
<template>
  <!-- 导入按钮-->
  <n-button type="primary" @click="openMainModal">导入</n-button>
  <!-- 选择导入模板弹窗-->
  <n-modal
    v-model:show="importMainModal"
    style="width: 80vw; height: 80vh"
    preset="dialog"
    title="导入"
  >
    <n-space vertical>
      <n-button type="primary" @click="editMain(null)">新建</n-button>
      <n-data-table :columns="columns" :data="data"> </n-data-table>
    </n-space>
  </n-modal>

  <!-- 编辑/新增导入模板弹窗-->
  <n-modal
    v-model:show="editMainModal"
    style="width: 70vw; height: 80%"
    preset="dialog"
    title="导入模板"
  >
    <n-form
      label-placement="left"
      :model="transportImportMain"
      label-width="150px"
      :rules="rules"
      ref="formRef"
    >
      <div style="display: none">
        <n-form-item label="id">
          <n-input v-model:value="transportImportMain.fId"></n-input>
        </n-form-item>
        <n-form-item label="fModelName">
          <n-input v-model:value="transportImportMain.fModelName"></n-input>
        </n-form-item>
      </div>
      <n-form-item label="名称" path="fName">
        <n-input v-model:value="transportImportMain.fName"></n-input>
      </n-form-item>
      <n-form-item label="导入字段" path="fProperties">
        <n-transfer
          ref="transfer"
          v-model:value="selectedFields"
          :options="fields"
          :render-target-label="renderLabel"
          @update:value="updateSelectedFields"
        >
        </n-transfer>
      </n-form-item>
      <n-form-item label="关键字" path="fKeys">
        <n-checkbox-group v-model:value="selectedKeys">
          <n-space>
            <n-checkbox v-for="property in selectedFields" :value="property">{{
              property
            }}</n-checkbox>
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item v-for="object in objects" :label="object + '关键字'">
        <n-checkbox-group v-model:value="objectsSelectedKey">
          <n-checkbox
            v-for="key in fieldInfos[object].keys"
            :value="object + '.' + key"
            >{{ key }}</n-checkbox
          >
        </n-checkbox-group>
      </n-form-item>
      <n-space justify="center">
        <n-button type="primary" @click="saveTransportImportMain"
          >保存</n-button
        >
        <n-button type="error" @click="closeImportMainModal">取消</n-button>
      </n-space>
    </n-form>
  </n-modal>

  <!-- 上传导入文件弹窗-->
  <n-modal
    v-model:show="importFileModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="导入"
    :on-after-leave="onCloseImportModal"
  >
    <input
      type="file"
      style="display: none"
      accept=".xls, .xlsx"
      ref="importFile"
      @change="handleFile"
    />
    <n-space vertical>
      <div>
        <n-space>
          <div v-if="file.name">
            <n-alert type="success">
              {{ file.name }}
            </n-alert>
          </div>
          <div v-else>
            <n-alert type="warning"> 未上传导入附件！ </n-alert>
          </div>
        </n-space>
      </div>
      <div>
        <n-space>
          <n-button size="large" type="info" @click="downloadMain"
            >下载导入模板</n-button
          >
          <n-button size="large" type="info" @click="selectFile"
            >上传导入文件</n-button
          >
          <n-button
            size="large"
            type="primary"
            @click="doImport"
            :disabled="!file.name"
            >提交</n-button
          >
        </n-space>
      </div>
      <div>
        <n-alert :type="importResultAlertType" v-if="importResultMessage">
          {{ importResultMessage }}
        </n-alert>
      </div>
    </n-space>
  </n-modal>
</template>

<script>
import createApi from './api'
import { useMessage, useDialog } from 'naive-ui'
import { defineComponent, reactive } from 'vue'
import { ArrowUp, ArrowDown } from '@vicons/ionicons5'
import storage from '@/utils/storage'
import context from '@/context.js'
import baseUrl from '@/utils/baseUrl'

export default defineComponent({
  components: {
    ArrowUp,
    ArrowDown,
  },
  props: {
    module: String,
    class: String,
  },
  emits: ['closeImportModalFunc'],
  setup(props, ctx) {
    const api = createApi(getCurrentInstance())
    const message = useMessage()
    const dialog = useDialog()
    const formRef = ref(null)

    /* 弹窗 */
    const importMainModal = ref(false) //选择导入格式的弹窗
    const importFileModal = ref(false) //上传导入文件的弹窗
    const editMainModal = ref(false) //编辑新建导入格式的弹窗

    /* 导入模板列表页面的变量 */
    const columns = reactive([]) //导入格式标题列
    const data = reactive([]) //导入格式数据

    /* 编辑模板页面的变量 */
    const fields = reactive([]) //待选基础字段
    const fieldInfos = reactive({}) //待选基础字段信息
    const selectedFields = ref([]) //当前已选基础字段
    const selectedKeys = ref([]) //当前已选关键字
    const objects = ref([]) //对象项
    const objectsKey = reactive({}) //已选的对象关键字
    const objectsSelectedKey = ref([]) //已选的对象的已选关键字

    /* 导入操作页面的变量 */
    const selectedMainId = ref('') //选择的导入模板id
    const selectedMainName = ref('未命名')
    const importFile = ref() //上传的导入文件
    const file = reactive({}) //文件信息
    const importResultAlertType = ref('success')
    const importResultMessage = ref('')

    /* 导入模板列表页面js块 -- start */
    /**
     * 读取已有的导入格式
     */
    function loadImportMain() {
      var param = []
      param.push({ eq: { fModelName: props.class } })
      api
        .transportImportMainList({ query: [{ and: param }] })
        .then(function (response) {
          if (response.status == 200) {
            data.length = 0
            for (var temp in response.data.list) {
              data.push(response.data.list[temp])
            }
          }
        })
    }

    /**
     * 打开选择导入格式弹窗
     */
    function openMainModal() {
      importMainModal.value = true
      loadImportMain()
    }

    /**
     * 打开上传导入文件弹窗
     */
    function openSelectFile(row) {
      selectedMainId.value = row.fId
      selectedMainName.value = row.fName ? row.fName : '未命名'
      importFileModal.value = true
      importResultMessage.value = ''
      file.name = ''
    }
    /* 导入模板列表页面js块 -- end */

    /* 编辑模板页面js块 -- start */
    //提交校验
    const rules = {
      fName: [
        {
          required: true,
          message: '请输入模板名称',
          trigger: ['blur', 'input'],
        },
      ],
      fProperties: [
        {
          message: '必须选择导入项',
          validator: validateProperties,
        },
      ],
      fKeys: [
        {
          message: '必须选择关键字',
          validator: validateKey,
        },
        {
          message: '必须选择对象字段的关键字',
          validator: validateObjectKey,
        },
      ],
    }

    /* 导入模板 */
    const transportImportMain = reactive({
      fName: '',
      fId: '',
      fModelName: props.class,
      fKey: [],
      fProperties: [],
      fObjectKeys: [],
    })

    /* 导入格式列表头 */
    columns.push({
      title: '名称',
      key: 'fName',
    })
    columns.push({
      title: '导入字段',
      key: 'fProperties',
      render(row) {
        var fProperties = row.fProperties
        var str = ''
        for (var i = 0; i < fProperties.length; i++) {
          str += fProperties[i].fName + ';'
        }
        return str
      },
    })
    columns.push({
      title: '关键字',
      key: 'fKey',
      render(row) {
        var fKey = row.fKey
        var str = ''
        for (var i = 0; i < fKey.length; i++) {
          str += fKey[i].fName + ';'
        }
        return str
      },
    })
    columns.push({
      title: '操作',
      key: 'options',
      render(row) {
        const buttons = [
          h(
            NButton,
            {
              onClick: function () {
                openSelectFile(row)
              },
            },
            { default: '导入' },
          ),
        ]
        if (
          (row.fCreator && row.fCreator.fId === context.user()
) ||
          storage.get('auths').indexOf('AUTH_ADMIN') >= 0
        ) {
          buttons.push(
            h(
              NButton,
              {
                onClick: function () {
                  editMain(row)
                },
              },
              { default: '编辑模板' },
            ),
          )
          buttons.push(
            h(
              NButton,
              {
                onClick: function () {
                  deleteMain(row)
                },
              },
              { default: '删除' },
            ),
          )
        }
        return h(NSpace, {}, { default: buttons })
      },
    })

    /**
     * 打开导入模板编辑/新建页面
     */
    async function editMain(row) {
      fields.length = 0
      selectedFields.value.length = 0
      selectedKeys.value.length = 0
      objects.value.length = 0
      objectsSelectedKey.value.length = 0
      Object.keys(objectsKey).forEach((key) => {
        delete objectsKey[key]
      })
      //读取，初始化
      var url = ''
      var param = null
      if (row) {
        param = { fId: row.fId }
        url += 'transportImportMainLoad'
      } else {
        url += 'transportImportMainInit'
      }
      api[url](param).then(function (response) {
        if (response.status == 200) {
          var res = response.data
          transportImportMain.fId = res.fId
          transportImportMain.fName = res.fName ? res.fName : ''
          transportImportMain.fKey.length = 0
          if (res.fKey) {
            for (var i = 0; i < res.fKey.length; i++) {
              //transportImportMain.fKey.push(res.fKey[i].fName)
              selectedKeys.value.push(res.fKey[i].fName)
            }
          }
          transportImportMain.fProperties.length = 0
          if (res.fProperties) {
            for (var i = 0; i < res.fProperties.length; i++) {
              //transportImportMain.fProperties.push(res.fProperties[i].fName)
              selectedFields.value.push(res.fProperties[i].fName)
              //处理已选中对象的关键字
              for (var j = 0; j < res.fProperties[i].fKeys.length; j++) {
                objectsSelectedKey.value.push(res.fProperties[i].fKeys[j].fKey)
              }
            }
          }
          transportImportMain.fObjectKeys.length = 0
        }
      })
      //读取模块的基本字段
      await api.getBaseFields(props.module).then(function (response) {
        if (response.status == 200) {
          fields.length = 0
          for (var i = 0; i < response.data.result.length; i++) {
            fields.push(response.data.result[i])
            fieldInfos[response.data.result[i].value] = response.data.result[i]
            //处理必填字段
            if (response.data.result[i].disabled) {
              if (
                selectedFields.value.indexOf(response.data.result[i].value) < 0
              ) {
                selectedFields.value.push(response.data.result[i].value)
              }
            }
            //处理已选中的对象字段
            if (response.data.result[i].keys) {
              if (
                selectedFields.value.indexOf(response.data.result[i].value) >= 0
              ) {
                objects.value.push(response.data.result[i].value)
                objectsKey[response.data.result[i].value] =
                  response.data.result[i].keys
              }
            }
          }
        }
      })

      editMainModal.value = true
    }

    /**
     * 删除模板
     */
    function deleteMain(row) {
      dialog.warning({
        title: '删除',
        content: '是否确认删除该导入模板？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          api
            .transportImportMainDelete({ fId: row.fId })
            .then(function (response) {
              if (response.status == 200) {
                message.info('删除成功！')
              } else {
                message.error(response.data)
              }
              loadImportMain()
            })
        },
      })
    }

    /**
     * 上传模板的上传字段穿梭框
     */
    const renderLabel = function ({ option }) {
      return h(
        NSpace,
        {},
        {
          default: [
            h(
              NButton,
              {
                circle: true,
                size: 'small',
                onClick: function () {
                  up(option)
                },
              },
              '↑',
            ),
            h(
              NButton,
              {
                circle: true,
                size: 'small',
                onClick: function () {
                  down(option)
                },
              },
              '↓',
            ),
            h(
              'div',
              {
                style: {
                  display: 'grid',
                  alignItems: 'center',
                  height: '100%',
                },
              },
              option.label,
            ),
          ],
        },
      )
    }

    /**
     * 导入项上移
     */
    function up(option) {
      if (selectedFields.value.indexOf(option.value) >= 1) {
        var index = selectedFields.value.indexOf(option.value)
        var temp = selectedFields.value[index]
        selectedFields.value[index] = selectedFields.value[index - 1]
        selectedFields.value[index - 1] = temp
      }
    }

    /**
     * 导入项下移
     */
    function down(option) {
      if (
        selectedFields.value.indexOf(option.value) <
        selectedFields.value.length - 1
      ) {
        var index = selectedFields.value.indexOf(option.value)
        var temp = selectedFields.value[index]
        selectedFields.value[index] = selectedFields.value[index + 1]
        selectedFields.value[index + 1] = temp
      }
    }

    /**
     * 导入项变动，更新已选关键字和对象关键字
     */
    function updateSelectedFields(value) {
      //1.已选关键字是否还在已选导入字段中，不在要移除
      for (var i = selectedKeys.value.length - 1; i >= 0; i--) {
        if (value.indexOf(selectedKeys.value[i]) < 0) {
          selectedKeys.value.splice(i, 1)
        }
      }
      //2.已选导入字段是否是对象，是要增加对象的关键字
      for (var i = objects.value.length - 1; i >= 0; i--) {
        if (value.indexOf(objects.value[i]) < 0) {
          objects.value.splice(i, 1)
        }
      }
      for (var i = 0; i < value.length; i++) {
        if (fieldInfos[value[i]].keys) {
          if (objects.value.indexOf(value[i]) < 0) {
            objects.value.push(value[i])
          }
        }
      }
    }

    /**
     * 保存模板信息
     */
    function saveTransportImportMain() {
      //TransformImportMain赋值
      transportImportMain.fProperties = selectedFields.value
      transportImportMain.fKey = selectedKeys.value
      transportImportMain.fObjectKeys = objectsSelectedKey.value
      //执行校验
      formRef.value?.validate((error) => {
        if (!error) {
          //提交
          api
            .transportImportSave({
              transportImportMain: transportImportMain,
              creator: context.user()
,
            })
            .then(function (response) {
              if (response.status == 200) {
                editMainModal.value = false
                loadImportMain()
              } else {
                message.error(response.message)
              }
            })
        }
      })
    }

    /**
     * 关闭模板编辑页面
     */
    function closeImportMainModal() {
      editMainModal.value = false
    }

    function validateProperties() {
      //必须有导入项
      return selectedFields.value.length > 0
    }
    function validateKey() {
      //必须有关键字key，且key必须存在与properties中
      if (selectedKeys.value.length == 0) return false
      for (var i = 0; i < selectedKeys.value.length; i++) {
        if (selectedFields.value.indexOf(selectedKeys.value[i]) < 0)
          return false
      }
      return true
    }
    function validateObjectKey() {
      //如果有object对象的导入，必须有其的关键字
      for (var i = 0; i < selectedFields.value.length; i++) {
        if (fieldInfos[selectedFields.value[i]].keys) {
          var bool = false
          for (var j = 0; j < objectsSelectedKey.value.length; j++) {
            if (
              objectsSelectedKey.value[j].indexOf(selectedFields.value[i]) == 0
            ) {
              bool = true
            }
          }
          if (!bool) return false
        }
      }
      return true
    }
    /* 编辑模板页面js块 -- end */

    /* 上传页面js块 -- start */
    /**
     * 下载导入模板文件
     */
    function downloadMain() {
      var param = {}
      param['mainId'] = selectedMainId.value
      api
        .transportImportDownload(param)
        // originAxios({
        //   method: 'post',
        //   responseType: 'blob',
        //   url: baseUrl.pmUrl + '/pm/transportImport/download',
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
          a.download = selectedMainName.value + '.xlsx' // 设置下载的文件名，替换为实际的文件名

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

    /**
     * 选择文件
     */
    function selectFile() {
      importFile.value.click()
    }

    /**
     * 完成文件提交
     */
    function handleFile(e) {
      if (e.target.files.length == 1) {
        file.file = e.target.files[0]
        file.name = e.target.files[0].name
        file.type = e.target.files[0].type
        file.size = e.target.files[0].size
      }
    }

    /**
     * 执行导入
     */
    function doImport() {
      const formData = {}
      formData.file = file.file
      formData.fId = selectedMainId.value
      api
        .import(props.module, formData)
        // axios
        //   .post('/pm/' + props.module + '/import', formData, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data', // 设置请求头
        //     },
        //   })
        .then(function (response) {
          message.info('上传完成')
          if (response.data.result) {
            importResultAlertType.value = 'success'
            importResultMessage.value = '上传成功！'
          } else {
            importResultAlertType.value = 'error'
            importResultMessage.value = response.data.message
          }
        })
        .catch(function (response) {
          message.error('上传失败')
          message.error(response)
          importResultAlertType.value = 'error'
          importResultMessage.value = response
        })
    }

    /**
     * 关闭上传窗口后的调用，方便上传数据后刷新列表页面
     */
    function onCloseImportModal() {
      ctx.emit('closeImportModalFunc')
    }
    /* 上传页面js块 -- end */

    return {
      /* 变量 */
      message,
      dialog,
      formRef,

      importMainModal,
      importFileModal,
      editMainModal,

      columns,
      data,

      fields,
      fieldInfos,
      selectedFields,
      selectedKeys,
      objects,
      objectsKey,
      objectsSelectedKey,
      rules,
      transportImportMain,

      selectedMainId,
      selectedMainName,
      importFile,
      file,
      importResultAlertType,
      importResultMessage,

      /* 方法 */
      loadImportMain,
      openMainModal,
      openSelectFile,

      editMain,
      deleteMain,
      renderLabel,
      up,
      down,
      updateSelectedFields,
      saveTransportImportMain,
      closeImportMainModal,
      validateProperties,
      validateKey,
      validateObjectKey,

      downloadMain,
      selectFile,
      handleFile,
      doImport,
      onCloseImportModal,
    }
  },
})
</script>

<style></style>
