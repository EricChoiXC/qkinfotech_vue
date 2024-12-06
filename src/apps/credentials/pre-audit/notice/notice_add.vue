<template>
  <n-card :bordered="false">
    <n-form
      ref="formRef"
      inline
      :label-width="180"
      :model="formValue"
      :size="size"
      label-align="left"
      label-placement=""
    >
      <n-grid :x-gap="12" :y-gap="8" :cols="2">
        <n-grid-item span="2">
          <n-table :single-line="false">
            <tbody>
              <tr>
                <td style="width: 20%" class="tdcenter">包件信息</td>
                <td class="tdleft" colspan="3">
                  <n-form-item>
                    <n-checkbox-group
                      v-model:value="cities"
                      @update:value="handleUpdateValue"
                    >
                      <n-space item-style="display: flex;">
                        <n-checkbox value="All" label="全部" />
                        <n-checkbox
                          v-for="p in formValue.packages"
                          :value="p.value"
                          :label="p.label"
                        />
                      </n-space>
                    </n-checkbox-group>
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">是否资格预审</td>
                <td class="tdleft">
                  <n-form-item path="fIsPrequalification">
                    <n-radio-group
                      v-model:value="formValue.fIsPrequalification"
                      name="fIsPrequalification"
                    >
                      <n-space>
                        <n-radio value="true" @change="ChangePrequalification">
                          是
                        </n-radio>
                        <n-radio value="false" @change="ChangePrequalification">
                          否
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                </td>
                <td style="width: 20%" class="tdcenter">是否接受联合体</td>
                <td class="tdleft">
                  <n-form-item path="fIsUnion">
                    <n-radio-group
                      v-model:value="formValue.fIsUnion"
                      name="fIsUnion"
                    >
                      <n-space>
                        <n-radio value="true" @change="ChangeUnion">
                          是
                        </n-radio>
                        <n-radio value="false" @change="ChangeUnion">
                          否
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">是否定向邀请</td>
                <td class="tdleft">
                  <n-form-item path="fIsInviteShortlists">
                    <n-radio-group
                      v-model:value="formValue.fIsInviteShortlists"
                      name="fIsInviteShortlists"
                    >
                      <n-space>
                        <n-radio value="true" @change="ChangeInviteShortlists">
                          是
                        </n-radio>
                        <n-radio value="false" @change="ChangeInviteShortlists">
                          否
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                </td>
                <td style="width: 20%" class="tdcenter">是否精确匹配</td>
                <td class="tdleft">
                  <n-form-item>
                    <n-radio-group
                      v-model:value="formValue.fIsAccurateMatching"
                      name="fIsAccurateMatching"
                    >
                      <n-space>
                        <n-radio value="true" @change="ChangeAccurateMatching">
                          是
                        </n-radio>
                        <n-radio value="false" @change="ChangeAccurateMatching">
                          否
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                </td>
              </tr>
              <!--  <tr v-if="cvalue==='true'">
                <td style="width:20%;" class="tdcenter">邀请供应商</td>
                <td class="tdleft" colspan="3">
                  <n-form-item>
                    <n-input value="上海大舍建筑设计事务所(有限合伙),上海市建工设计研究总院有限公司"
                      style="width:80%"></n-input><n-button>选择</n-button>
                  </n-form-item>
                </td>
              </tr> -->
            </tbody>
          </n-table>
        </n-grid-item>

        <!--      <n-grid-item>
          <n-form-item label="是否资格预审" path="">
            <n-space>
              <n-radio :checked="checkedValue === 'true'" value="true" name="是" @change="handleChange">
                是
              </n-radio>
              <n-radio :checked="checkedValue === 'false'" value="false" name="否" @change="handleChange">
                否
              </n-radio>
            </n-space>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="是否邀请入围" path="">
            <n-space>
              <n-radio :checked="cvalue === 'true'" value="true" name="是" @change="handleChange1">
                是
              </n-radio>
              <n-radio :checked="cvalue === 'false'" value="false" name="否" @change="handleChange1">
                否
              </n-radio>
            </n-space>
          </n-form-item>
        </n-grid-item>
        <n-grid-item id="supplier" style="display:block" span="2">
          <n-form-item label="邀请供应商" path="">
            <n-input value="上海大舍建筑设计事务所(有限合伙),上海市建工设计研究总院有限公司" style="width:80%"></n-input><n-button>选择</n-button>
          </n-form-item>
        </n-grid-item> -->

        <n-grid-item style="display: flex; justify-content: center" span="2">
          <n-space>
            <n-button @click="saveData" type="primary"> 发布 </n-button>
            <n-button @click="closeModal" type="error"> 关闭 </n-button>
          </n-space>
        </n-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import createApi from './api'
import { useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const api = createApi(getCurrentInstance())
const multipleSelectValue = ref(null)
const selectValue = ref(null)

// const checkedValueRef = ref("true");
// const cvalue = ref("true");
// const checkedValue = checkedValueRef;
const formRef = ref(null)
const message = useMessage()
const timestamp = ref(new Date())
const disabled = ref(true)

const ChangePrequalification = (e) => {
  formValue.fIsPrequalification = e.target.value
}
const ChangeInviteShortlists = (e) => {
  formValue.fIsInviteShortlists = e.target.value
}
const ChangeUnion = (e) => {
  formValue.fIsUnion = e.target.value
}
const ChangeAccurateMatching = (e) => {
  formValue.fIsAccurateMatching = e.target.value
}

const cities = ref(['All']) //包件
//包件选择事件
const handleUpdateValue = (value, value2) => {
  formValue.packageIds = []
  formValue.cities = value
  //全选 勾上全部包件
  if (value2.actionType === 'check' && value2.value === 'All') {
    formValue.cities = formValue.citiesBak
  } else {
    if (formValue.cities.indexOf('All') >= 0) {
      formValue.cities.splice(formValue.cities.indexOf('All'), 1)
    }
  }
  //实际向后端传的值
  for (var i = 0; i < formValue.cities.length; i++) {
    if (formValue.cities[i] !== 'All') {
      formValue.packageIds.push({
        fId: formValue.cities[i],
      })
    }
  }
}

const emit = defineEmits(['onClose'])
const route = useRoute()
const id = menuStore.currentRouteObj.urlParams.fId
const size = ref('medium')
const formValue = reactive({
  fProjectMain: {
    fId: id,
  },
  fIsPrequalification: '',
  fIsInviteShortlists: '',
  fIsUnion: '',
  fIsAccurateMatching: '',
  packages: [], //包件option
  packageIds: [], //实际向后端传的值
  cities: cities, //所选包件显示
  citiesBak: ['All'], // 用于全选包件
})

//保存
const saveData = async () => {
  // console.log(formValue)
  await api
    .auditAnnouncementSave(formValue)
    .then((result) => {
      message.info('保存成功')
      console.log(result)
      //调用ekp发起公告接口
      const noticeId = result.data.fId
      api.ekpSysNewsMainAdd(noticeId)
      // axios.post(
      //   baseUrl.ekpUrl +
      //     '/sys/news/sys_news_main/sysNewsMain.do?method=add&fdTemplateId=13f89f0aecc9570a269328c4ea8b510d&.fdTemplate=13f89f0aecc9570a269328c4ea8b510d&i.docTemplate=13f89f0aecc9570a269328c4ea8b510d&fNoticeId=' +
      //     noticeId,
      // )
      emit('onSuccess')
    })
    .catch((err) => {
      console.log(err)
    })
}

//取消
const closeModal = () => {
  emit('onClose')
}

//获取包件
const getPackages = async () => {
  const requestData = {
    query: {
      eq: {
        'fMainId.fId': id,
      },
    },
  }
  await api
    .projectPackageList(requestData)
    .then((result) => {
      const data = result.data.list
      console.log(data)
      data.map((item) => {
        formValue.packages.push({
          label: item.fName,
          value: item.fId,
        })
        formValue.cities.push(item.fId)
        formValue.citiesBak.push(item.fId)
        formValue.packageIds.push({
          fId: item.fId,
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

//初始化
onMounted(() => {
  getPackages()
})
</script>

<style></style>
