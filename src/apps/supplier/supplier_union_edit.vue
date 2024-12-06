<template>
  <n-card>
    <n-grid :y-gap="8" :cols="1">
      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            基本信息
          </p>
        </div>
        <div>
          <n-form ref="formRef" label-placement="left" label-width="200px">
            <n-grid :x-gap="12" :y-gap="8" :cols="2">
              <n-grid-item span="2">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <td style="width:15%;" class="tdcenter">联合体主体</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="" :disabled="false"></n-input>
                          <n-button>
                            选择
                          </n-button>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">公司名称</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="上海XXX公司" :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>


                    <tr>
                      <td style="width:15%;" class="tdcenter">国别</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="中国" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">法定代表人</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="张三" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>


                    <tr>
                      <td style="width:15%;" class="tdcenter">公司注册地址</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="xx路xxx号" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">公司成立日期</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-date-picker v-model:value="timestamp" type="date" :disabled="false" />
                        </n-form-item>
                      </td>
                    </tr>


                    <tr>
                      <td style="width:15%;" class="tdcenter">公司电话</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="138xxxxxxx" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">官网地址</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="138xxxxxxx" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>


                    <tr>
                      <td style="width:15%;" class="tdcenter">设计人员总数</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-space>
                            <n-input value="20" :disabled="false" style="width: 80px;"></n-input>
                            其中注册建筑/景观设计师
                            <n-input value="5" :disabled="false" style="width: 80px;"></n-input>
                          </n-space>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">商业登记/营业执照编号</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="20201020-222" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>

                    <tr>
                      <td style="width:15%;" class="tdcenter">设计资格或资质的种类/级别</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="高级" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">本项目联系人</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value="" :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>

                    <tr>
                      <td style="width:15%;" class="tdcenter">职务/级别</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value=""></n-input>
                        </n-form-item>
                      </td>
                      <td style="width:15%;" class="tdcenter">电话</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value=""></n-input>
                        </n-form-item>
                      </td>
                    </tr>

                    <tr>
                      <td style="width:15%;" class="tdcenter">邮箱</td>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item label="" path="">
                          <n-input value=""></n-input>
                        </n-form-item>
                      </td>

                    </tr>

                    <tr>
                      <td class="tdcenter">通信地址及邮编</td>
                      <td class="tdleft" colspan="3">
                        <n-form-item label="" path="" >
                          <n-input value=""></n-input>
                        </n-form-item>
                      </td>

                    </tr>

                    <tr>
                      <td class="tdcenter">公司介绍</td>
                      <td class="tdleft" colspan="3">
                        <n-form-item label="" path="" >
                          <n-input value="" type="textarea"></n-input>
                        </n-form-item>
                      </td>

                    </tr>

                  </tbody>
                </n-table>

              </n-grid-item>





            </n-grid>
          </n-form>
        </div>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            主创设计师信息
            <n-button @click="addDesigner">修改</n-button>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for=" form in formValues">
            <designerEdit :formValue="form" />
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            项目信息
            <n-button @click="addItem">修改</n-button>
            <n-alert title="温馨提示" type="info" closable>
              第一个项目信息请填写代表性项目
            </n-alert>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for=" form in itemFormValues">
            <n-card title="" closable @close="handleClose">
              <itemEdit :formValue="form" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item span="2">
        <n-grid-item style="display: flex;justify-content: center;">
          <n-space>
            <n-button type="primary" @click="pdfView">
              预览
            </n-button>
            <n-button type="primary">
              提交
            </n-button>
            <n-button type="primary">
              关闭
            </n-button>
          </n-space>
        </n-grid-item>
      </n-grid-item>

    </n-grid>
  </n-card>


  <n-modal style="width:60%" v-model:show="designerShow" preset="dialog" title="添加设计师" :mask-closable="false">
    <designerAdd @closeModal="closeModal" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="itemShow" preset="dialog" title="添加项目信息" :mask-closable="false">
    <itemAdd @closeItem="closeItem" />
  </n-modal>

</template>

<script setup>
import {
  ref
} from 'vue'
import fromAddress from '@/apps/common/address/formAddress.vue'
import designerEdit from '@/apps/supplier/designer/designer_edit.vue'
import designerAdd from '@/apps/supplier/designer/designer_add.vue'
import itemAdd from '@/apps/supplier/item/item_add.vue'
import itemEdit from '@/apps/supplier/item/item_edit.vue'

const cities = ref(["Beijing", "Shanghai", "Guangzhou"])

const timestamp = ref(118313526e4)

const element = ref([{
  fId: "123",
  fName: "张三"
}, {
  fId: "223",
  fName: "张苏"
}])

const designerShow = ref(false);
const addDesigner = () => {
  designerShow.value = true;
}

const itemShow = ref(false);
const addItem = () => {
  itemShow.value = true;
}

const handleClose = () => {
  message.info('Card Close')
}

const formValues = reactive([]);
const itemFormValues = reactive([]);

const closeModal = (formValue) => {
  designerShow.value = false;
  formValues.push(formValue);
};

const closeItem = (formValue) => {
  itemShow.value = false;
  itemFormValues.push(formValue);
};

const pdfView = () => {
  window.open(context.path+"/opdesk/projectManagement/implementation/fils-view")
}
</script>

<style></style>
