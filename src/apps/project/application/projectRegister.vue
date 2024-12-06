<template>
  <n-form ref="formRef" :model="projectModel" label-placement="" label-width="150px">
    <n-grid :cols="2" y-gap="10">
      <n-gi :span="2">
        <p style="font-size: 24px; font-weight: bold;">项目登记</p>
      </n-gi>
      <n-gi :span="2">
        <n-space>
          <p style="font-size: 16px; font-weight: bold;">基本信息</p>
          <n-button type="primary" @click="adminModal" text v-if="props.data.isAdmin">管理</n-button>
          <n-button type="primary" @click="adminEdit" text v-if="props.data.isManager && !finishDocumentation">修改</n-button>
        </n-space>
      </n-gi>
    </n-grid>
    <n-table :single-line="false">
      <tbody>
      <tr>
        <td style="width: 20%;" class="tdcenter">项目编号</td>
        <td style="width: 30%;" class="tdleft">
          {{ projectModel.fProjectNo }}
        </td>
        <td style="width: 20%;" class="tdcenter">类别</td>
        <td style="width: 30%;" class="tdleft">
          {{ projectModel.fProjectCategory.fNumber + " " + projectModel.fProjectCategory.fName }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">协议编号</td>
        <td colspan="3" class="tdleft">
          {{ projectModel.fProtocolNumber }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">项目名称</td>
        <td class="tdleft">
          {{ projectModel.fName }}
        </td>
        <td class="tdcenter">项目简称</td>
        <td class="tdleft">
          {{ projectModel.fSimpleName }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">英文名称</td>
        <td class="tdleft">
          <div v-if="!edit">{{ projectModel.fEngName }}</div>
          <n-input v-if="edit" :value="projectModel.fEngName"></n-input>
        </td>
        <td class="tdcenter">业主</td>
        <td class="tdleft">
          {{ projectModel.fOwner }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">项目模式</td>
        <td colspan="3" class="tdleft">
          {{ projectModel.fProjectMode.fName }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">登记日期</td>
        <td colspan="3" class="tdleft">
          {{ projectModel.fCreateTime }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">部门</td>
        <td class="tdleft">
          {{ projectModel.fDept.fName }}
        </td>
        <td class="tdcenter">项目经理</td>
        <td class="tdleft">
          {{ projectModel.fDeptManager.fName }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">项目组成员</td>
        <td colspan="3" class="tdleft">
            <span v-for="(member, index) in projectModel.fProjectMembers" :key="index" class="spaced-member">
              {{ member.fName }}&nbsp;&nbsp; <!-- Add HTML entities for spacing -->
            </span>
        </td>
      </tr>
      <tr>
        <td class="tdcenter">项目性质</td>
        <td class="tdleft">
          {{ projectModel.fProjectNatureName.join(' ') }}
        </td>
        <td class="tdcenter">项目重要性</td>
        <td class="tdleft">
          {{ projectModel.selectedImportance.fName}}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">征集费预算</td>
        <td class="tdleft">
          {{ projectModel.fProjectBudget }} 人民币
        </td>
<!--      </tr>
      <tr>-->
<!--        <td class="tdcenter">资金来源</td>
        <td class="tdleft">
          <span v-if="projectModel.fCapitalSource && projectModel.fCapitalSource.fName != '其他'">{{ projectModel.fCapitalSource.fName }}</span>
          <span v-else>{{projectModel.fCapitalSourceOther}}</span>
        </td>-->
        <td class="tdcenter">预期收入</td>
        <td class="tdleft">
          {{ projectModel.fPlanIncome }}元（人民币）
        </td>
      </tr>
      <tr>
        <td class="tdcenter">开拓信息</td>
        <td class="tdleft">
          {{ projectModel.fDevelopInfo }}
        </td>
        <td class="tdcenter">项目执行地</td>
        <td colspan="3" class="tdleft">
          {{ projectModel.fExecutionPlace }}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">涉密项目</td>
        <td colspan="3" class="tdleft">
          {{ projectModel.fIsClassified ? "是" : "否"}}
        </td>
      </tr>
      <tr>
        <td class="tdcenter">TimeSheet用时</td>
        <td colspan="3" class="tdleft">
          <n-input placeholder="TimeSheet" disabled v-model:value="timeSheet"></n-input>
        </td>
      </tr>
      <tr>
        <td class="tdcenter">项目备注</td>
        <td colspan="3" class="tdleft">
          <n-input v-model:value="projectModel.fNotes" disabled placeholder="项目备注"
          type="textarea" :autosize="{
                          minRows: 3,
                          maxRows: 5,
                        }" />
        </td>
      </tr>
      </tbody>
    </n-table>


    <n-grid :cols="2" y-gap="10">
      <n-gi span=2>
        <n-space>
          <p style="font-size: 16px; font-weight: bold;">项目概况</p>
        </n-space>
      </n-gi>
      <n-gi span=2>
        <n-table :single-line="false">
          <tbody>
          <tr>
            <td style="width:20%;" class="tdcenter">项目地点</td>
            <td class="tdleft">
                <n-input v-model:value="projectModel.fProjectPlace" :disabled="!projectModel.isEditing"/>
            </td>
          </tr>
          <tr>
            <td class="tdcenter">项目类型</td>
            <td class="tdleft">
              <n-space vertical>
                <n-select :options="typeOptions" tag multiple v-model:value="projectModel.selectedType"
                          :disabled="!projectModel.isEditing" @update:value="updateFProjectType"></n-select>
                <n-input disabled v-show="showOtherType()" v-model:value="projectModel.fTypeOther"></n-input>
              </n-space>
            </td>
          </tr>
          <tr>
            <td class="tdcenter">项目标签</td>
            <td class="tdleft">
              <n-space vertical>
                <n-select v-model:value="projectModel.selectedTag" :options="tagsOptions" tag multiple
                          :disabled="!projectModel.isEditing" @update:value="handleTagValue"></n-select>
                <n-input disabled v-show="showOtherTag()" v-model:value="projectModel.fTagOther"></n-input>
              </n-space>
            </td>
          </tr>
          <tr v-if="projectModel.fScales && projectModel.fScales.length > 0">
            <td class="tdcenter">项目规模</td>
            <td class="tdleft">
              <n-grid v-for="groupName in selectedGroup" cols="10">
                <n-gi>{{groupName}}</n-gi>
                <n-gi span="4">
                  <n-space vertical>
                    <div v-for="val in projectModel.fScales">
                      <div v-if="groupName === val.fGroup">
                        <n-input-group>
                          <n-input-number v-model:value="val.fValue" :show-button="false" disabled></n-input-number>
                          <n-input-group-label>{{ val.fScale.fName }}</n-input-group-label>
                        </n-input-group>
                      </div>
                    </div>
                  </n-space>
                </n-gi>
              </n-grid>
            </td>
          </tr>



<!--          <tr v-for="(typeScaleGroup, index) in projectModel.typeScales">
            &lt;!&ndash; 显示项目类型 &ndash;&gt;
            <td class="tdcenter">项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName }})</td>
            <td class="tdleft">
              <n-space>
                &lt;!&ndash; 遍历该类型下的每一个scale &ndash;&gt;
                <template v-for="scale in typeScaleGroup">
                  &lt;!&ndash; 添加输入框 &ndash;&gt;
                  <n-input-group>
                    <n-input-number v-model:value="scale.value" :show-button="false"
                                    :disabled="!projectModel.isEditing" :key="scale.fId"></n-input-number>
                    &lt;!&ndash; 添加单位 &ndash;&gt;
                    <n-input-group-label>{{ scale.fMasterDataScaleId.fName }}</n-input-group-label>
                  </n-input-group>
                  &lt;!&ndash; 如果不是该类型下的最后一个scale，添加换行 &ndash;&gt;
                  <br v-if="scale !== typeScaleGroup[typeScaleGroup.length - 1]">
                </template>
              </n-space>
            </td>
          </tr>-->
          <tr>
            <td class="tdcenter">包件信息</td>
            <td class="tdleft">
              <div class="single-line-tags">
                <n-tag v-for="(item, index) in fPackageOption" :key="item.value"
                       style="margin-left: 30px;margin-top: 10px" size='large' round>包件{{item.index}}:{{ item.label }}
                </n-tag>
                <n-button type="primary" style="float: right;" @click="addPackage"
                          v-if="props.data.isManager && props.data.fAuditStatus == '1' && !finishDocumentation">修改
                </n-button>
              </div>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-gi>


      <n-gi span=2>
        <p style="font-size: 16px; font-weight: bold;">附件上传</p>
      </n-gi>
      <n-gi span=2>
        <n-table :single-line="false">
          <tbody>
          <tr>
            <td style="width:20%;" class="tdcenter">项目建议书</td>
            <td class="tdleft">
                <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                                 :modelId="id" fkey="projectProposal" :linkPackage="true" :projectId="id"
                                 :disabled="!props.data.isManager || props.data.fAuditStatus != '1' || finishDocumentation"></sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">前期资料</td>
            <td class="tdleft">
                <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                                 :modelId="id" fkey="earlyInfomation" :linkPackage="true" :projectId="id"
                                 :disabled="!props.data.isManager || props.data.fAuditStatus != '1' || finishDocumentation"></sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">
              工作计划<span v-if="projectModel.selectedImportance.fName === '公司重点'" style="color: red;">*</span>
            </td>
            <td class="tdleft">
                <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                                 :modelId="id" fkey="workPlan" :linkPackage="true" :projectId="id"
                                 :disabled="!props.data.isManager || props.data.fAuditStatus != '1' || finishDocumentation"></sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">
              其他
            </td>
            <td class="tdleft">
                <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                                 :modelId="id" fkey="other" :linkPackage="true" :projectId="id"
                                 :disabled="!props.data.isManager || props.data.fAuditStatus != '1' || finishDocumentation"></sitc-attachment>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-gi>
    </n-grid>
  </n-form>

  <n-modal v-model:show="adminModalShow" title="管理员设置" style="width:60%" preset="dialog">
    <n-form ref="" :model="projectModelAdminEdit" label-placement="" label-width="150px">
      <n-table :single-line="false">
        <tbody>
        <tr>
          <td style="width: 20%;" class="tdcenter">项目编号</td>
          <td style="width: 30%;" class="tdleft">
            <n-input v-model:value="projectModelAdminEdit.fProtocolNo"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目名称</td>
          <td class="tdleft">
            <n-input v-model:value="projectModelAdminEdit.fName"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目简称</td>
          <td class="tdleft">
            <n-input v-model:value="projectModelAdminEdit.fSimpleName"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目经理</td>
          <td class="tdleft">
            <formAddress :fElement="projectModelAdminEdit.fDeptManager" status="edit"
                         orgType="ORG_TYPE_PERSON"></formAddress>
            <!--          <n-input v-model:value="projectModel.fDeptManager.fName" :disabled="true"></n-input>-->
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目组成员</td>
          <td colspan="3" class="tdleft">
            <formAddress :fElements="projectModelAdminEdit.fProjectMembers" status="edit"
                         orgType="ORG_TYPE_PERSON" multi></formAddress>
            <!--            <span v-for="(member, index) in projectModel.fProjectMembers" :key="index" class="spaced-member">-->
            <!--              {{ member.fName }}&nbsp;&nbsp; &lt;!&ndash; Add HTML entities for spacing &ndash;&gt;-->
            <!--            </span>-->
          </td>
        </tr>
        <tr>
          <td class="tdcenter">预期收入</td>
          <td colspan="3" class="tdleft">
            <n-input-group>
              <n-input-number v-model:value="projectModelAdminEdit.fPlanIncome" :show-button="false" style="width: 18vw"
                              :precision="2"></n-input-number>
              <n-input-group-label>元(人民币)</n-input-group-label>
            </n-input-group>
          </td>
        </tr>

        <tr>
          <td class="tdcenter">项目性质</td>
          <td class="tdleft">
            <n-space vertical>
              <n-checkbox-group v-model:value="selecteds.selectedNature"
                                @update:value="handleUpdateNature">
                <n-grid :cols="4" >
                  <n-gi v-for="(item, index) in fProjectNaturesList">
                    <div v-show="showNature(item)">
                      <n-tooltip trigger="hover">
                        <template #trigger>
                          <n-checkbox :value="item.fId" :label="item.fName" :key="index">
                            {{ item.fName }}
                          </n-checkbox>
                        </template>
                        {{ item.fNote }}
                      </n-tooltip>
                    </div>
                  </n-gi>
                </n-grid>
              </n-checkbox-group>
              <n-input v-show="selectedNatureContainOther()" v-model:value="projectModelAdminEdit.fProjectNatureOther"></n-input>
            </n-space>
          </td>
        </tr>


        <!--        归档信息-->
        <tr>
          <td class="tdcenter">限制结束日期</td>
          <td colspan="3" class="tdleft">
            <n-date-picker v-model:formatted-value="projectModelAdminEdit.projectDocumentation.fLimitFinishTime"
                           type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="adminDocumentationDate"></n-date-picker>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">达标日期</td>
          <td colspan="3" class="tdleft">
            <n-date-picker v-model:formatted-value="projectModelAdminEdit.projectDocumentation.fQuelifyTime"
                           type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="adminDocumentationDate"></n-date-picker>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">履约奖发奖日期</td>
          <td colspan="3" class="tdleft">
            <n-date-picker v-model:formatted-value="projectModelAdminEdit.projectDocumentation.fPerpormanceTime"
                           type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="adminDocumentationDate"></n-date-picker>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">开拓奖发奖日期</td>
          <td colspan="3" class="tdleft">
            <n-date-picker v-model:formatted-value="projectModelAdminEdit.projectDocumentation.fDevelopTime"
                           type="datetime" value-format="yyyy-MM-dd HH:mm:ss" :disabled="adminDocumentationDate"></n-date-picker>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">完成日期（待定）</td>
          <td colspan="3" class="tdleft">
            <n-date-picker type="date"></n-date-picker>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <n-space style="display: flex;justify-content: center;">
              <n-button type="primary" @click="handleSubmit">提交</n-button>
              <n-button type="error" @click="closeWindow">关闭</n-button>
            </n-space>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-form>

  </n-modal>

  <n-modal v-model:show="adminEditShow" title="基本信息修改" style="width:60%" preset="dialog">
    <n-form ref="" :model="projectModelEdit" label-placement="" label-width="150px">
      <n-table :single-line="false">
        <tbody>
        <tr>
          <td style="width: 30%;" class="tdcenter">英文名称</td>
          <td style="width: 70%;" class="tdleft">
            <div style="width: 30vw">
            <n-input v-model:value="projectModelEdit.fEngName"></n-input>
            </div>
          </td>
        </tr>
<!--        <tr>
          <td class="tdcenter">资金来源</td>
          <td class="tdleft">
            &lt;!&ndash;          <n-input v-model:value="projectModel.fCapitalSource.fName"></n-input>&ndash;&gt;
            <n-space vertical>
              <n-radio-group v-model:value="projectModelEdit.fCapitalSource.fId" name="radiogroup">
                <n-space :vertical="false">
                  <n-radio v-for="option in fFundingSourcesList" :key="option.fName"
                           :value="option.fId" @click="projectModelEditChangeCapital(option)">
                    {{ option.fName }}
                  </n-radio>
                </n-space>
              </n-radio-group>
              <n-input v-show="selectedCapitalSourceOther()" v-model:value="projectModelEdit.fCapitalSourceOther" style="width: 60%"></n-input>
            </n-space>
          </td>
        </tr>-->
        <tr>
          <td class="tdcenter">涉密项目</td>
          <td class="tdleft">
            <div style="width: 30vw">
            <n-select v-model:value="projectModelEdit.fIsClassified" :options="fIsClassifiedOptions"/>
            </div>
            <!--          <n-input v-model:value="projectModel.fIsClassified"></n-input>-->
          </td>
        </tr>
        <tr>
          <td class="tdcenter">征集费预算(人民币)</td>
          <td class="tdleft">
            <div style="width: 30vw">
            <n-input-number v-model:value="projectModelEdit.fProjectBudget" :precision="2"></n-input-number>
            </div>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目地点</td>
          <td class="tdleft">
            <div style="width: 30vw">
            <n-input v-model:value="projectModelEdit.fProjectPlace"></n-input>
            </div>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目备注</td>
          <td class="tdleft">
            <div style="width: 30vw">
            <n-input v-model:value="projectModelEdit.fNotes" placeholder="项目备注"
            type="textarea" :autosize="{
                            minRows: 3,
                            maxRows: 5,
                          }" />
            </div>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目类型</td>
          <td class="tdleft">
            <n-form-item class="flex-center">
              <div style="width: 30vw">
                <n-space vertical>
                  <n-select :options="typeOptions" tag multiple v-model:value="projectModelEdit.selectedType"
                            @update:value="updateFProjectType"></n-select>
                  <n-input placeholder="请输入其他类型" v-show="showOtherTypeInput()" v-model:value="projectModelEdit.fTypeOther"></n-input>
                </n-space>
              </div>
            </n-form-item>
          </td>
        </tr>
        <tr v-if="tagsOptions.length > 0">
          <td class="tdcenter">项目标签</td>
          <td class="tdleft">
            <n-form-item class="flex-center">
              <div style="width: 30vw">
                <n-space vertical>
                  <n-select v-model:value="projectModelEdit.selectedTag" :options="tagsOptions" tag multiple
                            @update:value="handleTagValue"></n-select>
                  <n-input placeholder="请输入其他标签" v-show="showOtherTagInput()" v-model:value="projectModelEdit.fTagOther"></n-input>
                </n-space>
              </div>
            </n-form-item>
          </td>
        </tr>

        <tr v-if="projectModelEdit.fScales && projectModelEdit.fScales.length > 0">
          <td class="tdcenter">项目规模</td>
          <td class="tdleft">
            <n-grid v-for="groupName in allSelectValues.selectedGroup" cols="10">
              <n-gi>{{groupName}}</n-gi>
              <n-gi span="4">
                <n-space vertical>
                  <div v-for="val in projectModelEdit.fScales">
                    <div v-if="groupName === val.fGroup">
                      <n-input-group>
                        <n-input-number v-model:value="val.fValue" :show-button="false"></n-input-number>
                        <n-input-group-label>{{ val.fScale.fName }}</n-input-group-label>
                      </n-input-group>
                    </div>
                  </div>
                </n-space>
              </n-gi>
            </n-grid>
          </td>
        </tr>


<!--        <tr v-for="(typeScaleGroup, index) in projectModelEdit.typeScales">
          &lt;!&ndash; 显示项目类型 &ndash;&gt;
          <td class="tdcenter">项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName }})</td>
          <td colspan="3" class="tdleft">
            <n-form-item>
              &lt;!&ndash; 遍历该类型下的每一个scale &ndash;&gt;
              <template v-for="scale in typeScaleGroup">
                &lt;!&ndash; 添加输入框 &ndash;&gt;
                <n-input-group>
                  <n-input-number v-model:value="scale.value" :show-button="false" :key="scale.fId"></n-input-number>
                  &lt;!&ndash; 添加单位 &ndash;&gt;
                  <n-input-group-label>{{ scale.fMasterDataScaleId.fName }}</n-input-group-label>
                </n-input-group>
                &lt;!&ndash; 如果不是该类型下的最后一个scale，添加换行 &ndash;&gt;
                <br v-if="scale !== typeScaleGroup[typeScaleGroup.length - 1]">
              </template>
            </n-form-item>
          </td>
        </tr>-->
        <tr>
          <td colspan="2">
            <n-space style="display: flex;justify-content: center;">
              <n-button type="primary" @click="handleEditSubmit">提交</n-button>
              <n-button type="error" @click="closeEditWindow">关闭</n-button>
            </n-space>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-form>

  </n-modal>

  <n-modal style="width:60%" v-model:show="show" preset="dialog" title="包件修改" :on-close="actions.packageClose"
           :mask-closable="false" :close-on-esc="false">
    <n-button type="primary" @click="addNewRow">新增</n-button>
    <n-data-table :columns="columns" :data="fPackageList" :pagination="pagination"/>
    <n-space style="display: flex;justify-content: center;">
      <n-button type="primary" @click="actions.packageSubmit">确认</n-button>
      <n-button type="error" @click="actions.packageClose">关闭</n-button>
    </n-space>
  </n-modal>

</template>

<script setup>
import {
  useRoute,
  useRouter
} from 'vue-router'
import {
  ref,
  defineComponent,
  h,
  reactive,
  computed
} from 'vue'
import {
  useMessage,
  NButton,
  NDataTable,
  NInput,
  NFormItem,
  useDialog
} from 'naive-ui'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import {
  Pencil
} from '@vicons/ionicons5'
import {
  resolveWrappedSlotWithProps
} from 'naive-ui/es/_utils'
import storage from '@/utils/storage'
import context from '@/context.js'

import baseUrl from '@/utils/baseUrl'
import interfaceUtilApi from '@/utils/interfaceUtil'
import createApi from './api'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)

const props = defineProps({
  data: Object,
  package: Object
})
const route = useRoute();
let id = props.data.fId
const baojians = inject("baojians")
const finishDocumentation = inject("finishDocumentation")

var selectOption = {
  projectTag : [],
  projectType : []
}


//
const adminModalShow = ref(false)

function adminModal() {
  projectModelAdminEdit.value = deepClone(projectModel);
  selecteds.selectedNature = projectModel.selectedNature;
  if(!projectModel.isProjectDocumentation) {
    adminDocumentationDate.value = true;
  }
  adminModalShow.value = true
}

watch(() => props.data.fName, (New, Old) => {
  id = props.data.fId
  Object.assign(projectModel, props.data);
  actions.getTimeSheet();
  actions.packageList();
  actions.loadScaleGroup();
}, {
  deep: true
});

const fFundingSourcesList = ref([]);

//项目性质初始化
const fProjectNaturesList = ref([]);


/* timesheet信息 */
const timeSheet = ref("")

const fIsClassifiedOptions = ref([{
  value: true,
  label: "是"
},
  {
    value: false,
    label: "否"
  }]);

const projectModel = reactive({
  fId: id,
  isEditing: false,
  fProjectNo: "",
  fName: '',
  fSimpleName: "",
  fEngName: "",
  fOwner: '',
  fCreateTime: '',
  fDept: {},
  fDeptManager: {
    fName: ''
  },
  fProjectMembers: [],
  fInvestmentBudget: 0,
  fProjectBudget: 0,
  fPlanForeignExchange: 0,
  fPlanIncome: 0,
  fTypical: '',
  fDevelopInfo: "",
  fExecutionPlace: '',
  fIsClassified: '',
  fProjectPlace: '',
  fNotes:'',
  //协议编号
  fProtocolNumber: '',
  //类别
  fProjectCategory: {},
  projectCategory: {},
  selectedCategory: {},

  //项目重要性
  fProjectImportance: [],
  selectedImportance: {},
  projectImportance: '',

  fScale: [],
  fScales: [],
  //包件信息
  fPackage: [],
  fPackageIdList: [],

  //项目性质
  oaNatureNameArray: [],
  selectedNature: [],
  selectedNatures: [],
  fProjectNatures: [],
  fProjectNatureName: [],

  //项目模式
  fProjectMode: {},
  projectMode: '',
  fProjectModes: [],

  //项目类型
  fProjectTypes: [], //cun
  selectedTypes: [], //fang
  selectedType: [], //fang

  //项目执行地
  fCountryVal: '',
  country: [],
  fCountry: {},
  fcityVal: '',
  city: [],
  fCity: {},

  //资金来源
  fCapitalSource: {},
  capitalSource: '',
  fFundingSources: [],

  //项目规模
  fProjectScale: [],
  typeScales: [],
  fProjectScales: [], //cun

  //项目标签
  fProjectTags: [], //cun
  selectedTags: [], //fang
  selectedTag: [], //fang
  fProjectTag: [], //名称数组

  //项目编号
  fProtocolNo: "",

  //oa接口参数拼接
  oaCountry: {},
  oaCity: {},
  oaCategory: {},
  oaTypeScales: [],
  oaCapitalSource: '',
  errInfo: [],
  fLimitFinishTime: Date.now(),

  //归档信息
  isProjectDocumentation:0,
  projectDocumentation: {},
})

const joinPackageNames = (packages) => {
  return packages.map(item => item.fName).join(' ');
};
const dialog = useDialog();

//包件信息
const fPackageList = ref([])
//包件信息选项
const fPackageOption = computed(() => {
  return fPackageList.value.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
    index: item.fIndex
  }));
});

const packageArray = ref([]);

const pagination = ref({
  pageSize: 10
});

// 定义columns
const columns = [{
  title: "包件序号",
  key: "fIndex",
  width: '20%',
  render(row, index) {
    return h('div', {}, '包件' + (index+1))
  }
},{
  title: "包件名称",
  key: "fName",
  width: '60%',
  render(row, index) {
    // 使用h函数创建NInput组件
    return h(NInput, {
      value: row.fName,
      onUpdateValue: (v) => {
        // 直接修改ref响应式数据
        fPackageList.value[index].fName = v;
      }
    });
  }
},
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return [h(
        NButton, {
          onClick: async () => {
            dialog.warning({
              title: '警告',
              content: '是否删除包件？',
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: async () => {
                await api.projectPackageDelete({fId:row.fId}).then(
                  result => {
                    message.success("删除成功")
                    actions.packageList();
                  }).catch(err => {
                  console.log(err)
                });
              }
            })
          }
        }, '删除'
      ),]
    }
  }
];
// 新增方法: 添加新行
const addNewRow = () => {
  const newRow = {
    fName: '',
    fId: '',
  };
  fPackageList.value.push(newRow);
};
const closeWindow = () => {
  adminModalShow.value = false
}

const closeEditWindow = () => {
  adminEditShow.value = false
}


const multipleSelectValue = ref([]);
const packageOptions = ref([{
  label: "",
  value: '',
  disabled: true
}]);

const formRef = ref(null)
const now = (new Date()).getTime()
const fElement = ref({
  fId: "",
  fName: "测试"
})
const isClassified = ref(true)


//项目标签  计算属性，生成选项数组
const tagsOptions = computed(() => {
  return projectModel.fProjectTags.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
  }));
});

//项目标签
const handleTagValue = (v, l) => {
  projectModelEdit.value.selectedTags = [];
  projectModelEdit.value.fTagNameArray = [];
  for (var i = 0; i < v.length; i++) {
    projectModelEdit.value.selectedTags.push({
      fId: v[i]
    })
    projectModelEdit.value.fTagNameArray.push(l[i].label)
  }
}

//类型选项
const typeOptions = computed(() => {
  return projectModel.fProjectTypes.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
    types: item.types,
    fGroup: item.fGroup
  }));
});
// 项目类型 规模字段
const updateFProjectType = async (v, targets) => {
  //2024-0918 项目标签与项目类型联动，选择了。。。类型的时候，项目标签可选择。。。
  projectModel.fProjectTags = []
  var tempSelectedTagValue = []
  var tempSelectedTagsValue = []
  var pushedTagsValue = []
  for (var i=0; i<v.length; i++) {
    var tags = allSelectValues.tags[v[i]]
    //重新填充标签可选项，和移除不可选标签项
    if (tags) {
      for (var j = 0; j < tags.length; j++) {
        if (projectModelEdit.value.selectedTag.includes(tags[j].fId)) {
          tempSelectedTagValue.push(tags[j].fId)
          tempSelectedTagsValue.push({
            fId : tags[j].fId
          })
        }
        if (!pushedTagsValue.includes(tags[j].fId)) {
          projectModel.fProjectTags.push(tags[j])
          pushedTagsValue.push(tags[j].fId)
        }
      }
    }
  }
  projectModelEdit.value.selectedTag = tempSelectedTagValue
  projectModelEdit.value.selectedTags = tempSelectedTagsValue

  //2024-0919 项目规模与项目类型联动，增加一个上级组别，选择了该组别的类型，则填写该组别的规模
  var pushedScaleValue = []
  allSelectValues.selectedGroup = []
  for (let key in allSelectValues.group) {
    var group = allSelectValues.group[key]
    var haveThisGroup = group.typeId.filter(val => v.includes(val))
    if (haveThisGroup.length > 0) {
      allSelectValues.selectedGroup.push(group.groupName)
      for (var i=0; i<group.scaleId.length; i++) {
        var scaleId = group.scaleId[i]
        var scaleName = group.scaleName[i]
        var haveThisScale = projectModelEdit.value.fScales.filter(val => val.fScale.fId === scaleId)
        if (haveThisScale.length > 0) {
          pushedScaleValue.push(haveThisScale[0])
        } else {
          pushedScaleValue.push({
            fId : "",
            fMain : {
              fId : projectModelEdit.value.fId
            },
            fScale : {
              fId : scaleId,
              fName : scaleName
            },
            fValue : "",
            fGroup : group.groupName
          })
        }
      }
    }
  }
  projectModelEdit.value.fScales = pushedScaleValue

  projectModelEdit.selectedTypes = v.map(id => ({
    fId: id
  }));
  projectModelEdit.value.fTypes = targets.map(val => ({
    fId : "",
    fTypeId : {
      fId : val.value,
      fName : val.label
    },
    fGroup : val.fGroup
  }))
}


/* 附件演示数据 */
const items = ref([{
  fName: "项目信息表 202308251017.pdf",
  fCreateTime: "2023-08-25"
}])
const items2 = ref([])
const items3 = ref([{
  fName: "金环中央公园综合体一-工作计划.docx",
  fCreateTime: "2023-08-23"
}])
const items4 = ref([{
  fName: "关于金桥副中心中央公园综合体国际方案征集工作的请示.docx",
  fCreateTime: "2023-08-23"
}])

const message = useMessage()

// function updateFProjectType(vals, targets) {
//   var newVals = []
//   // 1.先将已填写的数据暂存进options中
//   for (var i = 0; i < projectModel.value.fProjectScale.length; i++) {
//     var temp = projectModel.value.fProjectScale[i]
//     for (var j = 0; j < options.value.length; j++) {
//       if (options.value[j].value == temp.value) {
//         options.value[j].types = temp.types
//       }
//     }
//   }
//   // 2.再将新添加数据取出到fProjectScale中
//   projectModel.value.fProjectScale = targets
// }

const oapackages = [];
const edit = ref(false)

const adminEditShow = ref(false)

async function adminEdit() {
  projectModelEdit.value = deepClone(projectModel);
  if (projectModelEdit.value.fIsClassified) {
    projectModelEdit.value.fIsClassified = "是"
  } else {
    projectModelEdit.value.fIsClassified = "否"
  }
  allSelectValues.selectedGroup = []
  for (var i=0; i<projectModelEdit.value.fScales.length; i++) {
    if (!allSelectValues.selectedGroup.includes(projectModelEdit.value.fScales[i].fGroup)) {
      allSelectValues.selectedGroup.push(projectModelEdit.value.fScales[i].fGroup)
    }
  }
  await editModalInit()
  adminEditShow.value = true
}

//项目经理修改modal加载选择项
async function editModalInit() {
  await api.tagList({}).then(function (res) {
    if (res.status == 200) {
      selectOption.projectTag.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        var temp = res.data.list[i]
        selectOption.projectTag.push({
          label: temp.fName,
          value: temp.fId
        })
      }
      console.log(projectModelEdit.value)
    }
  })
  await api.typeList({}).then(function (res) {
    if (res.status == 200) {
      selectOption.projectType.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        var temp = res.data.list[i]
        selectOption.projectType.push({
          label: temp.fName,
          value: temp.fId
        })
      }
    }
  })
}


const show = ref(false);
const addPackage = () => {
  show.value = true;
}
//年月日
const formattedToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


const actions = {
  packageList: async () => {
    if (props.data.fId === undefined) {
      return
    }
    await api.projectPackageList({
      query: [{
        "eq": {
          "fMainId.fId": props.data.fId
        }
      }]
    }).then(res => {
      projectModel.fPackage = [];
      const dataList = res.data.list;
      packageArray.value = []
      fPackageList.value = []
      baojians.value = []
      for (let i = 0; i < dataList.length; i++) {
        packageArray.value.push(dataList[i].fId)
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId,
          fIndex: dataList[i].fIndex
        };
        fPackageList.value.push(obj)
        baojians.value.push({
          value : obj.fId,
          label : obj.fName,
          name : "包件" + obj.fIndex + ":" + obj.fName
        })
      }
    })
  },
  //项目类型
  typeList: async (url, filter) => {
    await api.typeList({}).then(result => {
      const dataList = result.data.list;
      projectModel.fProjectTypes.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectTypes.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },

  //项目标签
  tagList: async (url, filter) => {
    await api.typeList({}).then(result => {
      const dataList = result.data.list;
      projectModel.fProjectTags.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectTags.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },


  //项目规模
  scaleList: async (url, filter) => {
    await api.scaleList({}).then(result => {
      const dataList = result.data.list;
      projectModel.fProjectScales.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectScales.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },

  getTimeSheet: async () => {
    //timesheet用时
    if (props.data.fProtocolNo == "" || props.data.fProtocolNo == undefined) {
      return
    }
    var timeSheetMap = {
      "s": context.user(),
      "f_protocol_no": props.data.fProtocolNo
    }
    api.oaQuestMap(timeSheetMap)
      .then(function (res) {
        var url = baseUrl.oaUrl + "/j/api/sitc/jy/prj/project_timesht.jsp"
        api.projectTimesht(res.oaQuest)
          .then(function (tsRes) {
            timeSheet.value = ""
            for (var i = 0; i < tsRes.list.length; i++) {
              var sheet = tsRes.list[i]
              timeSheet.value += sheet.user + ":" + sheet.time + ";"
            }
            var form = {
              fCreateTime: new Date(),
              fInterfaceName: "项目timesheet接口",
              fInterfaceUrl: url,
              fInterfaceInfo: JSON.stringify(tsRes),
              fInputParameter: JSON.stringify(timeSheetMap),
              fInterfaceStatus: "1"
            }
            api.interfaceLogSave(form)
          }).then(function (error) {
          var form = {
            fCreateTime: new Date(),
            fInterfaceName: "项目timesheet接口",
            fInterfaceUrl: url,
            fInterfaceInfo: JSON.stringify(error),
            fInputParameter: JSON.stringify(timeSheetMap),
            fInterfaceStatus: "2"
          }
          api.interfaceLogSave(form)
        })
      })
  },

  //包件同意按钮
  packageSubmit: async () => {
    const originalList = [...fPackageList.value];
    // const url = "/pm/apps/project/package/save?fMainId=" + menuStore.currentRouteObj.urlParams.fId
    const packages = []
    for (var i = 0; i < fPackageList.value.length; i++) {
      const pack = {
        fId: fPackageList.value[i].fId,
        fName: fPackageList.value[i].fName,
        fMainId: id === undefined ? menuStore.currentRouteObj.urlParams.fId : id,
        fIndex: i + 1
      }
      if (pack.fName.trim() === '') {
        message.error('请填写包件名称！');
        return;
      }
      var query1 = []
      query1.push({
        "and": [{
          "eq": {
            "fName": pack.fName
          }
        }, {
          "eq": {
            "fMainId.fId": pack.fMainId
          }
        }]
      })
      console.log(query1);
      const res = await api.projectPackageList({
        query: query1
      })

      if (res.data.list.length > 0 && res.data.list[0].fId != pack.fId) {
        message.error('已存在相同名称');
        return;
      }

      //oa包件校验
      oapackages.push({
        index: i + 1,
        name: fPackageList.value[i].fName
      })
      packages.push(pack)
    }

    var map = {
      "s": context.user(),
      "f_protocol_no": projectModel.fProjectNo,
      "f_packages": oapackages
    }
    var oaQuest
    await api.oaQuestMap(map)
      .then(function (res) {
        oaQuest = res.oaQuest
      })
    oapackages.length = 0
    const response = await api.updatePrjPackage(oaQuest).catch(err => {
      // message.error("包件校验失败")
    });

    if (response.STATUS == 'S') {
      for (var i = 0; i < packages.length; i++) {
        await api.projectPackageSave(menuStore.currentRouteObj.urlParams.fId, packages[i])
      }
    } else {
      message.error("更新失败")
      restoreOriginalList(originalList);
      return;
    }

    fPackageList.value = []
    await actions.packageList(); // 重新获取包件列表数据，以便界面更新
    show.value = false
    window.location.reload()
  },
  //包件关闭按钮
  packageClose: () => {
    show.value = false;
    actions.packageList();
    // const url = `/opdesk/projectManagement/implementation/project-view?fId=${encodeURIComponent(row.fId)}`;
    //     window.open(url);

  },
  viewItem: async (row) => {
  },
  //项目性质
  projectNaturesList: async () => {
    await api.natureList({
      sort: ["fOrder asc"]
    }).then(result => {
      const dataList = result.data.list;
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId,
          fKey: dataList[i].fKey,
          fNote: dataList[i].fNote,
          customerDataMap: dataList[i].customerDataMap,
          featureMap:dataList[i].featureMap,
          fPreNature: dataList[i].fPreNature
        };
        fProjectNaturesList.value.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },
  //资金来源
  fundList: async (url, filter) => {
    await api.fundList().then(result => {
      const dataList = result.data.list;
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId,
        };
        fFundingSourcesList.value.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },
  loadScaleGroup : () => {
      for (var i=0; i<projectModel.fScales.length; i++) {
        if (!selectedGroup.includes(projectModel.fScales[i].fGroup)) {
          selectedGroup.push(projectModel.fScales[i].fGroup)
        }
      }
  }
}

const selectedGroup = reactive([])

const restoreOriginalList = (originalList) => {
  fPackageList.value = originalList;
}

const adminDocumentationDate = ref(false);

async function handleSubmit() {
  projectModel.projectCategory.fId = projectModel.fProjectCategory.fId

  if (projectModelAdminEdit.value.fName.trim().length === 0) {
    message.error("项目名称不能为空");
    return;
  }
  if (selectedNatureContainOther() && (projectModelAdminEdit.value.fProjectNatureOther == "" || projectModelAdminEdit.value.fProjectNatureOther == undefined)) {
    message.error("其他项目性质未填写!");
    return;
  }
  const query = [];
  query.push({
    "or": [
      {"eq": {"fName": projectModelAdminEdit.value.fName}},
      {"eq": {"fSimpleName": projectModelAdminEdit.value.fSimpleName}},
      {"eq": {"fEngName": projectModelAdminEdit.value.fEngName}}
    ]},
    {"and":[
        {"neq": {"fId": projectModelAdminEdit.value.fId}}
      ]
  })
  try {
    const response = await api.projectMainList({
      query: query
    });
    const dataList = response.data.list;
    if (dataList.length > 0 && dataList[0].fId != id) {
      message.error("项目重复，请查看项目信息");
      return;
    }

    projectModelAdminEdit.value.oaCity = projectModel.fCity;
    projectModelAdminEdit.value.oaCountry = projectModel.fCountry;
    projectModelAdminEdit.value.oaCategory = projectModel.fProjectCategory;

    checkModel = projectModelAdminEdit.value;
    //内网校验
    await innerNetCheck("edit", false);
    if (innerCHeckStatus.value.STATUS !== 'S') {
      message.error(innerCHeckStatus.value.MESSAGE);
      return;
    }

    //赋值
    projectModel.selectedNatures = projectModelAdminEdit.value.selectedNatures;
    projectModel.fProtocolNo = projectModelAdminEdit.value.fProtocolNo;
    projectModel.fName = projectModelAdminEdit.value.fName;
    projectModel.fSimpleName = projectModelAdminEdit.value.fSimpleName;
    projectModel.fDeptManager = projectModelAdminEdit.value.fDeptManager;
    projectModel.fProjectMembers = projectModelAdminEdit.value.fProjectMembers;
    projectModel.fPlanIncome = projectModelAdminEdit.value.fPlanIncome;
    projectModel.fPlanForeignExchange = projectModelAdminEdit.value.fPlanForeignExchange;
    projectModel.fProjectNatureOther = projectModelAdminEdit.value.fProjectNatureOther;
    if(projectModel.projectDocumentation){
      projectModel.projectDocumentation.fLimitFinishTime = projectModelAdminEdit.value.projectDocumentation.fLimitFinishTime;
      projectModel.projectDocumentation.fQuelifyTime = projectModelAdminEdit.value.projectDocumentation.fQuelifyTime;
      projectModel.projectDocumentation.fPerpormanceTime = projectModelAdminEdit.value.projectDocumentation.fPerpormanceTime;
      projectModel.projectDocumentation.fDevelopTime = projectModelAdminEdit.value.projectDocumentation.fDevelopTime;
    }
    await api.applicationAdminEdit(projectModel.fId,projectModel)
    message.success("提交成功");
    adminModalShow.value = false;
    window.location.reload();
  } catch (error) {
    message.error("提交失败");
    // 在这里处理错误，比如记录日志或给用户反馈
    console.error("提交失败:", error.message);
    // 这里可以选择是否向用户显示错误信息或其他操作
  }

}

//选中数据
const selecteds = reactive({
  selectedNature: []
})

//项目性质
const handleUpdateNature = (v) => {
  projectModelAdminEdit.value.selectedNatures = [];
  // 遍历所有选中的值
  v.forEach(fId => {
    // 在fProjectNatures中查找具有匹配fId的对象
    const selectedNature = fProjectNaturesList.value.find(item => item.fId === fId);
    if (selectedNature) {
      // 将fId和fName添加到selectedNatures
      projectModelAdminEdit.value.selectedNatures.push({
        fId: selectedNature.fId,
        fName: selectedNature.fName,
        fKey: selectedNature.fKey,
        customerDataMap: selectedNature.customerDataMap,
        featureMap:selectedNature.featureMap
      });
    }
  });

  // 判断是否要移除可选项/已选项
  var afterRemoveIds = []
  var afterRemoveObjs = []
  for (var i=0; i<selecteds.selectedNature.length; i++) {
    var selectedNatureId = selecteds.selectedNature[i]
    for (var j=0; j<fProjectNaturesList.value.length; j++) {
      var projectNature = fProjectNaturesList.value[j]
      if (projectNature.fId == selectedNatureId) {
        if (projectNature.fPreNature) {
          var hasPre = false
          for (var k=0; k<projectNature.fPreNature.split(";").length; k++) {
            if (selecteds.selectedNature.indexOf(projectNature.fPreNature.split(";")[k]) >= 0){
              hasPre = true
            }
          }
          if (hasPre) {
            afterRemoveIds.push(selectedNatureId)
            afterRemoveObjs.push({
              fId: selectedNatureId,
              fName: projectNature.fName
            })
          }
        } else {
          afterRemoveIds.push(selectedNatureId)
          afterRemoveObjs.push({
            fId: selectedNatureId,
            fName: projectNature.fName
          })
        }
      }
    }
  }
  selecteds.selectedNature = afterRemoveIds
  projectModelAdminEdit.value.selectedNatures = afterRemoveObjs

  validateProjectNatureSelections();
  checkProjectNatureRules();
  validateLegalBidding();
};

//清空
const clearSelectedNatures = () => {
  selecteds.selectedNature = projectModel.selectedNature;
  projectModelAdminEdit.value.selectedNatures = projectModel.selectedNatures
};

const checkProjectNatureRules = () => {
  let conflictCount = 0;
  let natureConflict = false;
  const hasConstructionOnSite = projectModelAdminEdit.value.selectedNatures.some(item => item.fName === '建设进场');
  const hasConstructionOffSite = projectModelAdminEdit.value.selectedNatures.some(item => item.fName === '建设非进场');
  if (hasConstructionOnSite && hasConstructionOffSite) {
    natureConflict = true;
    dialog.warning({
      title: '警告',
      content: '选择了“建设进场”，就不能再选择“建设非进场”！',
      positiveText: '确定',
    })
  }
  const hasLoanProject = projectModelAdminEdit.value.selectedNatures.some(item => item.fName === '贷款项目');
  const hasSelfFundedProject = projectModelAdminEdit.value.selectedNatures.some(item => item.fName === '自筹资金项目');
  if (hasLoanProject && hasSelfFundedProject) {
    natureConflict = true;
    dialog.warning({
      title: '警告',
      content: '选择了“贷款项目”，就不能再选择“自筹资金项目”！',
      positiveText: '确定',
    })
  }
  let count = 0;
  if (projectModelAdminEdit.value.selectedNatures.some(item => ['公开招标', '邀请招标'].includes(item.fName))) {
    count++;
  }

  if (projectModelAdminEdit.value.selectedNatures.some(item => item.fName === '建设非进场')) {
    count++;
  }

  if (projectModelAdminEdit.value.selectedNatures.some(item => ['地方政采', '中央政采项目'].includes(item.fName))) {
    count++;
  }

  if (count === 3 && !natureConflict) {
    dialog.warning({
      title: '警告',
      content: '“公开招标”或“邀请招标”、“建设非进场”、“政府采购”三者不可同时选择！',
      positiveText: '确定',
    })
    clearSelectedNatures();
  }

  if (natureConflict) {
    clearSelectedNatures(); // 清除选择，如果存在冲突
  }
};
const validateProjectNatureSelections = () => {
  if (projectModelAdminEdit.value.selectedNatures.length === 0) {
    dialog.warning({
      title: '警告',
      content: '请选择项目性质!',
      positiveText: '确定',
    })
  } else {
    let procurementCount = 0;
    // 检查“地方政采”、“中央政采项目”、“财政非政采”的数量
    projectModelAdminEdit.value.selectedNatures.forEach(nature => {
      if (['地方政采', '中央政采项目', '财政非政采'].includes(nature.fName)) {
        procurementCount++;
      }
    });

    if (procurementCount > 1) {
      dialog.warning({
        title: '警告',
        content: '地方政采、中央政采项目、财政非政采 不能同时选择！',
        positiveText: '确定',
      })
      clearSelectedNatures();
    }

    // 检查“建设进场”是否与“政府采购”同时被选择
    const constructionOnSite = projectModelAdminEdit.value.selectedNatures.some(nature => nature.fName === '建设进场');
    const governmentProcurement = projectModelAdminEdit.value.selectedNatures.some(nature => ['地方政采', '中央政采项目'].includes(nature
      .fName));

    if (constructionOnSite && governmentProcurement) {
      dialog.warning({
        title: '警告',
        content: '建设进场不可与地方政采、中央政采项目同时选择！',
        positiveText: '确定',
      })
      clearSelectedNatures();
    }
    // 检查“自筹资金项目”是否与“政府采购”或“财政非政采”同时被选择
    const selfFundedProject = projectModelAdminEdit.value.selectedNatures.some(nature => nature.fName === '自筹资金项目');
    const prohibitedWithSelfFunded = projectModelAdminEdit.value.selectedNatures.some(nature => ['地方政采', '中央政采项目', '财政非政采']
      .includes(nature.fName));
    if (selfFundedProject && prohibitedWithSelfFunded) {
      dialog.warning({
        title: '警告',
        content: '自筹资金项目不可与地方政采、中央政采项目、财政非政采同时选择！',
        positiveText: '确定',
      })
      clearSelectedNatures();
    }
  }
};
const validateLegalBidding = () => {
  if (projectModelAdminEdit.value.selectedNatures.includes("依法必招") === true) {
    let count = 0;
    // 检查是否选择了禁止与"依法必招"同时选择的项目性质
    projectModelAdminEdit.value.selectedNatures.forEach(nature => {
      if (['地方政采', '中央政采项目', '财政非政采', '小型工程'].includes(nature.fName)) {
        count++;
      }
    });
    if (count > 1) {
      // 显示错误消息
      dialog.warning({
        title: '警告',
        content: '依法必招项目不可同时选择“地方政采”、“中央政采项目”、“财政非政采”、“小型工程”！',
        positiveText: '确定',
      })
      clearSelectedNatures();
      // 清除非法选择
      projectModelAdminEdit.value.selectedNatures = projectModelAdminEdit.value.selectedNatures.filter(nature => ![
        '地方政采',
        '中央政采项目',
        '财政非政采',
        '小型工程'
      ].includes(nature.fName));
    }
  }
};

//项目经理修改的model内容
let projectModelEdit = ref({
  fTypes: [],
  fScales: [],
  selectedTag: [],
  selectedType: [],
  selectedTags: [],
  selectedTypes: [],
  fIsClassified: ''
});

//管理员修改的model内容
let projectModelAdminEdit = ref({});

let checkModel = reactive({});

const deepClone = source => {
  if (!source) return source;
  const target = Array.isArray(source) ? [] : {}
  for (const key in source) {
    if (source.hasOwnProperty.call(source, key)) {
      const _val = source[key];
      const _valType = typeof _val;
      if (_valType === 'function') {
        target[key] = new Function(`return ${_val.toString()}`)()
      } else if (_valType === 'object') {
        target[key] = deepClone(_val)
      } else {
        target[key] = _val
      }
    }
  }
  return target;
}

async function handleEditSubmit() {
  projectModel.projectCategory.fId = projectModel.fProjectCategory.fId;

  if (projectModelEdit.value.fEngName.trim().length === 0) {
    message.error("项目英文名称不能为空");
    return;
  }

  if (projectModelEdit.value.fProjectPlace === '') {
    message.error("请填写项目地点!");
    return;
  }

  if (projectModelEdit.value.fProjectBudget === '') {
    message.error("请填写征集费预算!");
    return;
  }

  if (projectModelEdit.value.fIsClassified === '' || projectModelEdit.value.fIsClassified === null || projectModelEdit.value.fIsClassified === undefined) {
    message.error("是否涉密未选择!");
    return;
  }

  /*if (projectModelEdit.value.capitalSource === '') {
    message.error("资金来源未选择!");
    return;
  }*/

  /*if (selectedCapitalSourceOther() && projectModelEdit.value.fCapitalSourceOther == "") {
    message.error("其他资金来源未填写!");
    return
  }*/

  if (projectModelEdit.value.fTypes.length == 0) {
    message.error("项目类型不能为空")
    return
  }

  if (showOtherTypeInput() && projectModelEdit.value.fTypeOther == "") {
    message.error("项目其他类型不能为空！")
    return
  }

  if (projectModelEdit.value.selectedTags.length == 0 && tagsOptions.value.length > 0) {
    message.error("项目标签不能为空")
    return
  }

  if (showOtherTagInput() && projectModelEdit.value.fTagOther == "") {
    message.error("项目其他标签不能为空！")
    return
  }

  /*for (var i=0; i<projectModelEdit.value.fScales.length; i++) {
    if (projectModelEdit.value.fScales[i].fValue == "") {
      message.error("项目规模不能为空")
      return
    }
  }*/

  const query = [];
  query.push({
    "eq": {
      "fEngName": projectModelEdit.value.fEngName
    }
  })
  query.push({
    "neq": {
      "fId": projectModelEdit.value.fId
    }
  })
  try {
    const response = await api.projectMainList({
      query: query
    });
    const dataList = response.data.list;
    if (dataList.length > 0 && dataList[0].fId !== id) {
      message.error("项目英文名重复，请检查项目英文名");
      return;
    }

    projectModelEdit.value.oaCity = projectModel.fCity;
    projectModelEdit.value.oaCountry = projectModel.fCountry;
    projectModelEdit.value.oaCategory = projectModel.fProjectCategory;
    projectModelEdit.value.selectedNatures = null;

    console.log("内网校验开始！", projectModelEdit.value)

    checkModel = projectModelEdit.value;
    //内网校验
    await innerNetCheck("edit", false);
    if (innerCHeckStatus.value.STATUS !== 'S') {
      message.error(innerCHeckStatus.value.MESSAGE);
      return;
    }


    //赋值
    projectModel.fEngName = projectModelEdit.value.fEngName;
    projectModel.fProjectPlace = projectModelEdit.value.fProjectPlace;
    projectModel.fPlanForeignExchange = projectModelEdit.value.fPlanForeignExchange;
    projectModel.fProjectBudget = projectModelEdit.value.fProjectBudget;
    projectModel.fIsClassified = projectModelEdit.value.fIsClassified;
    projectModel.capitalSource = projectModelEdit.value.fCapitalSource ? projectModelEdit.value.fCapitalSource.fId : projectModelEdit.value.capitalSource;
    projectModel.fCapitalSource = projectModelEdit.value.fCapitalSource;
    projectModel.fCapitalSourceOther = projectModelEdit.value.fCapitalSourceOther;
    projectModel.fNotes = projectModelEdit.value.fNotes;
    projectModel.fTypes = projectModelEdit.value.fTypes;
    projectModel.fTags = projectModelEdit.value.fTags;
    projectModel.selectedTypes = projectModelEdit.value.selectedTypes;
    projectModel.selectedTags = projectModelEdit.value.selectedTags;
    projectModel.selectedType = projectModelEdit.value.selectedType;
    projectModel.selectedTag = projectModelEdit.value.selectedTag;
    projectModel.fTypeOther = projectModelEdit.value.fTypeOther;
    projectModel.fTagOther = projectModelEdit.value.fTagOther;
    projectModel.fScales = projectModelEdit.value.fScales;

    await api.applicationSave(id,projectModel);
    message.success("提交成功");

    adminEditShow.value = false;
  } catch (error) {
    message.error("提交失败");
    // 在这里处理错误，比如记录日志或给用户反馈
    console.error("提交失败:", error.message);
    // 这里可以选择是否向用户显示错误信息或其他操作
  }
}

const innerCHeckStatus = ref()

//oa内网校验/提交 接口
async function innerNetCheck(flag, check) {
  const result = await interfaceUtil.projectMainCheck(flag, check, checkModel)
  if (result.STATUS === "E") {
    projectModel.errInfo.push(result.MESSAGE)
  }
  innerCHeckStatus.value = result;
}

onMounted(async () => {
  //actions.tagList();
  actions.typeList();
  actions.getTimeSheet();
  actions.packageList();
  //actions.scaleList();
  await actions.fundList();
  await actions.projectNaturesList();
  loadAllTypeTag()
  loadTypeGroup()
})



function selectedNatureContainOther() {
  var bool = false
  projectModelAdminEdit.value.selectedNatures.forEach(nature => {bool = bool || nature.fName == "其他"})
  return bool
}

function selectedCapitalSourceOther() {
  return projectModelEdit.value.fCapitalSource.fName == "其他"
}

function projectModelEditChangeCapital(option) {
  projectModelEdit.value.fCapitalSource.fName = option.fName
}


//类型标签，类型规模数据
const allSelectValues = reactive({
  tags : {},
  scales : {},
  group : {},
  selectedGroup : []
})

async function loadAllTypeTag(){
  await api.dataTypeTageList().then(function(res){
    if (res.status == 200) {
      for (var i=0; i<res.data.list.length; i++) {
        var temp = res.data.list[i]
        if (!allSelectValues.tags[temp.fMasterDataType.fId]) {
          allSelectValues.tags[temp.fMasterDataType.fId] = []
        }
        allSelectValues.tags[temp.fMasterDataType.fId].push(temp.fMasterDataTag)
      }
    }
  })
  //结束后根据当前已选类型，配置当前可选标签
  for (var i=0; i<projectModel.fTypes.length; i++) {
    var temp = projectModel.fTypes[i].fTypeId
    for (var tagId in allSelectValues.tags) {
      var tags = allSelectValues.tags[tagId]
      if (tagId === temp.fId) {
        tags.forEach(val => {
          projectModel.fProjectTags.push(val)
        })
      }
    }
  }

}
async function loadTypeGroup(){
  await api.typeList().then(function(res){
    if (res.status == 200) {
      for (var i=0; i<res.data.list.length; i++) {
        var temp = res.data.list[i]
        if (!allSelectValues.group[temp.fGroup]) {
          allSelectValues.group[temp.fGroup] = {
            groupName : temp.fGroup,
            typeName : [],
            typeId : [],
            scaleName : [],
            scaleId : []
          }
        }
        allSelectValues.group[temp.fGroup].typeName.push(temp.fName)
        allSelectValues.group[temp.fGroup].typeId.push(temp.fId)
      }
    }
  })
  await api.scaleList().then(function(res){
    if (res.status == 200) {
      for (var i=0; i<res.data.list.length; i++) {
        var temp = res.data.list[i]
        if (!allSelectValues.group[temp.fGroup]) {
          allSelectValues.group[temp.fGroup] = {
            groupName : temp.fGroup,
            typeName : [],
            typeId : [],
            scaleName : [],
            scaleId : []
          }
        }
        allSelectValues.group[temp.fGroup].scaleName.push(temp.fName)
        allSelectValues.group[temp.fGroup].scaleId.push(temp.fId)
      }
    }
  })
}

function showOtherTypeInput() {
  if (projectModelEdit.value.fTypes) {
    for (var i=0; i<projectModelEdit.value.fTypes.length; i++) {
      if (projectModelEdit.value.fTypes[i].fTypeId.fName === "其他") {
        return true
      }
    }
  }
  projectModelEdit.value.fTypeOther = ""
  return false
}

function showOtherType(){
  if (projectModel.fTypes) {
    for (var i=0; i<projectModel.fTypes.length; i++) {
      if (projectModel.fTypes[i].fTypeId.fName === "其他") {
        if (projectModel.fTypeOther) {
          return true
        }
      }
    }
  }
  return false
}

function showOtherTagInput() {
  if (projectModelEdit.value.fProjectTag) {
    if (projectModelEdit.value.fProjectTag.includes("其他")){
      return true
    }
  }
  projectModelEdit.value.fTagOther = ""
  return false
}

function showOtherTag(){
  if (projectModel.fProjectTag) {
    if (projectModel.fProjectTag.includes("其他")){
      if (projectModel.fTagOther) {
        return true
      }
    }
  }
  return false
}

function showNature(item) {
  if (item.fPreNature) {
    return projectModelAdminEdit.value.selectedNatures.filter(val => {
      return item.fPreNature.indexOf(val.fId) >= 0
    }).length > 0
  }
  return true
}
</script>

<style>
.tdcenter {
  text-align: center
}

.tdleft {
  text-align: left
}
</style>
