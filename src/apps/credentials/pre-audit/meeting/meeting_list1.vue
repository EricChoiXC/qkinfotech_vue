<template>
  <n-card v-for="item in data" style="margin-bottom:20px">
    <n-form ref="formRef">
      <n-table :single-line="false">
        <tbody>
          <tr>
            <td style="width:20%;" class="tdcenter">包件信息</td>
            <td class="tdleft">
              <n-form-item>
                {{item.packageNames}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">会议类型</td>
            <td class="tdleft">
              <n-form-item>
                {{item.type}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">会议地点</td>
            <td class="tdleft">
              <n-form-item>
                {{item.meetingRoom}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">会议时间</td>
            <td class="tdleft">
              <n-form-item>
                {{item.meetingTime}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">业主专家</td>
            <td class="tdleft">
              <n-form-item>
                {{item.experts}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">外聘专家</td>
            <td class="tdleft">
              <n-form-item>
                {{item.exExperts}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">备注</td>
            <td class="tdleft">
              <n-form-item>
                {{item.remarks}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">签到表</td>
            <td class="tdleft">
              <n-form-item>
                <sitc-attachment status="edit" title="签到表" :linkPackage="true" :files="files1"></sitc-attachment>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">专家投票/打分表</td>
            <td class="tdleft">
              <n-form-item>
                <sitc-attachment status="edit" title="专家投票/打分表" :linkPackage="true" :files="files2"></sitc-attachment>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">专家意见表</td>
            <td class="tdleft">
              <n-form-item>
                <sitc-attachment status="edit" title="专家投票/打分表" :linkPackage="true" :files="files2"></sitc-attachment>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">结果公告</td>
            <td class="tdleft">
              <n-form-item>
                <sitc-attachment status="edit" title="结果公告" :linkPackage="true" :files="files4"></sitc-attachment>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">资格预审报告</td>
            <td class="tdleft">
              <n-form-item>
                <sitc-attachment status="edit" title="资格预审报告" :linkPackage="true" :files="files5"></sitc-attachment>
              </n-form-item>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-form>
  </n-card>

</template>


<script setup>
  import {
    defineComponent,
    ref
  } from "vue";
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
  import {
    Pencil
  } from '@vicons/ionicons5'


  const disabled = ref(true);

  const data = ref([]);

  const files1 = ref([]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */

  const files2 = ref([]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */

  const files3 = ref([]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */

  const files4 = ref([]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */

  const files5 = ref([]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */


  const extraButtons = ref([{
    label: '批量修改包件',
    click: function() {
      console.log("edits")
    },
    viewShow: true,
    editShow: true
  }])
  const extraLineButtons = ref([{
    label: '修改关联包件',
    click: function() {
      console.log('click')
    },
    icon: Pencil,
    tooltip: '修改关联包件',
    viewShow: true,
    editShow: true
  }]) /* 单条额外操作按钮（label：显示文字，icon：图标（有图标时优先使用图标，无则使用显示文字），click：点击事件） */
  const extraLineButtons1 = ref([{
    label: "一键生成",
    click: ""
  }])
</script>


<style>
</style>
