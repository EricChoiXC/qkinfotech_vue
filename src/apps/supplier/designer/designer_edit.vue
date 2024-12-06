<template>
  <n-card>
    <n-form ref="formRef" inline :label-width="80" :model="props.formValue" :rules="rules">
      <n-grid :x-gap="12" :y-gap="8" :cols="2">
        <n-grid-item>
          <n-form-item label="所属公司" path="companyName" v-if="props.fIsUnion ==='true' ">
            <n-input v-model:value="props.formValue.companyName" :disabled="true"></n-input>
            <n-button v-if="!props.isDisabled" @click="selectCompany">选择</n-button>
          </n-form-item>
          <n-form-item label="设计师名称" path="name">

            <n-input v-model:value="props.formValue.name" :disabled="props.isDisabled"></n-input>
          </n-form-item>
          <n-form-item label="职称/执业资格" path="level">
            <n-input v-model:value="props.formValue.level" :disabled="props.isDisabled"></n-input>
          </n-form-item>
          <n-form-item label="从业年限" path="years">
            <n-input-group>
              <n-input-number :style="{ width: '100%' }" v-model:value="props.formValue.years" :show-button="false"
                :disabled="props.isDisabled" :validator="validator" :precision="1"></n-input-number>
              <n-input-group-label>年</n-input-group-label>
            </n-input-group>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="">
          <n-form-item label="照片" path="">
            <attachment fkey="designer" :picture="true" :disabled="props.isDisabled"
              modelName="com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerMain"
              :modelId="props.formValue.fId"></attachment>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          曾获国内或国际设计奖项
          <n-button type="tertiary" :round="true" size="tiny" @click.stop="addDetail()"
            v-if="!props.isDisabled">
            <template #icon>
              <n-icon>
                <addIcon />
              </n-icon>
            </template>
            添加行
          </n-button>
          <n-data-table :columns="columns" :data="data" :pagination="pagination" />
        </n-grid-item>
        <n-grid-item span="2">
          主创同类设计业绩
          <n-button type="tertiary" :round="true" size="tiny" @click.stop="addItemDetail()"
            v-if="!props.isDisabled">
            <template #icon>
              <n-icon>
                <addIcon />
              </n-icon>
            </template>
            添加行
          </n-button>
          <n-data-table :columns="columns1" :data="data1" :pagination="pagination" />
        </n-grid-item>
        <n-grid-item span="2">
          <n-grid-item style="display: flex;justify-content: center;">
            <n-space>
              <n-button type="primary" @click="save()" v-if="!props.isDisabled">
                保存
              </n-button>
              <n-button type="error" @click="save()">
                关闭
              </n-button>
            </n-space>
          </n-grid-item>
        </n-grid-item>
      </n-grid>
    </n-form>
  </n-card>

  <n-modal style="width:55%;" v-model:show="show" preset="dialog" title="选择联合体公司" :mask-closable="false">
    <n-data-table :columns="companyColumns" :data="companyData" :bordered="false" />
  </n-modal>


</template>

<script setup>
  import {
    AddCircleOutline as addIcon
  } from '@vicons/ionicons5';
  import {
    TrashOutline as TrashIcon
  } from '@vicons/ionicons5'
  import attachment from '@/apps/common/attachment/attachment.vue'
  import {
    defineProps,
    defineEmits,
    provide,
    reactive
  } from 'vue';
  import {
    ArchiveOutline as ArchiveIcon
  } from '@vicons/ionicons5'
  import {
    useDialog
  } from 'naive-ui'
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const dialog = useDialog()
  const formRef = ref(null)
  //数字校验
  const validator = (x) => {
    if (x >= 0) {
      return true;
    }
  }
  //添加 曾获国内或国际设计奖项 行
  const addDetail = async () => {
    data.push({
      fId: "",
      fName: "",
      fSimpleName: ""
    })
  }
  //添加 主创同类设计业绩 行
  const addItemDetail = async () => {
    data1.push({
      fId: "",
      name: "",
    })
  }

  const props = defineProps({
    formValue: Object,
    isDisabled: Boolean,
    fIsUnion: String,
    infoValue: Array
  })


  const rules = {
    name: {
      required: true,
      message: "请输入设计师名称",
      trigger: "blur"
    },
    companyName: {
      required: true,
      message: "请选择联合体公司",
      trigger: "change"
    },
  }


  // 监听 props.formValue 的变化
  watch(() => props.formValue, (newFormValue, oldFormValue) => {
    // 当 props.formValue 发生变化时，更新 years
    if (newFormValue && newFormValue.years !== undefined) {
      props.formValue.years = parseYearsToNumber(newFormValue.years);
    }
  }, {
    immediate: true // 立即执行一次，以处理初始值
  });

  // 解析 years 字符串为数字
  function parseYearsToNumber(yearsString) {
    const numberYears = parseInt(yearsString, 10);
    return isNaN(numberYears) ? 0 : numberYears; // 如果转换失败，返回 0 或其他默认值
  }

  // ======================曾获国内或国际设计奖项=========================
  const createColumns = () => [{
      title: "项目奖项",
      key: "fName",
      render(row, index) {
        return h(NInput, {
          value: row.fName,
          disabled: props.isDisabled,
          onUpdateValue(v) {
            data[index].fName = v;
          }
        });
      }
    },
    {
      title: "获奖年份",
      key: "fYear",
      width: "120px",
      render(row, index) {
        return h(NInput, {
          value: row.fYear,
          disabled: props.isDisabled,
          onUpdateValue(v) {
            data[index].fYear = v;
          }
        });
      }
    },
    {
      title: "项目简称",
      key: "fSimpleName",
      render(row, index) {
        return h(NInput, {
          value: row.fSimpleName,
          disabled: props.isDisabled,
          onUpdateValue(v) {
            data[index].fSimpleName = v;
          }
        });
      }
    }, {
      title: "操作",
      key: "action",
      width: "110px",
      render(row, index) {
        return h(
          NButton, {
            strong: true,
            tertiary: true,
            disabled: props.isDisabled,
            size: 'small',
            onClick: () => deleteAwards(row, index),
            hidden: false
          },
          [
            h(
              NIcon,
              null,
              h(TrashIcon)
            ),
            '删除',
          ]
        );
      }
    }
  ];
  const columns = createColumns()
  // const data = ref([]);
  const data = props.formValue.winning
  // ======================曾获国内或国际设计奖项=========================


  // ======================主创同类设计业绩 =========================
  const createColumns1 = () => [{
    title: "同类项目名称",
    key: "name",
    render(row, index) {
      return h(NInput, {
        value: row.name,
        disabled: props.isDisabled,
        onUpdateValue(v) {
          data1[index].name = v;
        }
      });
    }
  }, {
    title: "操作",
    key: "action",
    width: "110px",
    render(row, index) {
      return h(
        NButton, {
          strong: true,
          tertiary: true,
          disabled: props.isDisabled,
          size: 'small',
          onClick: () => deletePerformance(row, index),
          hidden: false
        },
        [
          h(
            NIcon,
            null,
            h(TrashIcon)
          ),
          '删除',
        ]
      );
    }
  }];
  const columns1 = createColumns1()
  const data1 = props.formValue.creators
  // ======================主创同类设计业绩 =========================

  // const formValue = reactive({
  //   fId:"",
  //   name: "",
  //   level: "",
  //   years: "",
  //   winning: data.value,
  //   creators: data1.value,
  // });

  const deleteAwards = async (row, index) => {
    if (row.fId) {
      await api.awardsDelete({fId: row.fId})
    }
    data.splice(index, 1);
  }

  const deletePerformance = async (row, index) => {
    if (row.fId) {
      await api.designPerformanceDelete({fId: row.fId})
    }
    data1.splice(index, 1);
  }

  const emit = defineEmits();
  const save = () => {
    const form = formRef.value;
    if (!form || !form.validate) {
      return; // 如果表单引用或验证方法不存在，直接返回
    }
    // 调用 validate 方法并传入一个回调函数
    form.validate((errors) => {
      if (errors) {
        return; // 如果存在错误，中断函数执行
      }
      const checkItems = (items, itemName) => {
        return items.some(item => item.fName === '' || item.name === '');
      };
      //曾获国内或国际设计奖项 /主创同类设计业绩  判读是否都填写了名称
      if (checkItems(props.formValue.winning, '项目奖项或项目简称')) {
        dialog.warning({
          title: '提示',
          style: "width:500px",
          content: `请检查曾获国内或国际设计奖项是否未填写项目奖项或项目简称`,
          positiveText: '确定',
        });
        return;
      }
      if (checkItems(props.formValue.creators, '同类项目名称')) {
        dialog.warning({
          title: '提示',
          style: "width:500px",
          content: `请检查主创同类设计业绩是否未填写同类项目名称!`,
          positiveText: '确定',
        });
        return;
      }
      emit('closeModal');
    });
  }


  //======================设计师对应公司==========================
  const companyColumns = [{
    title: "公司名称",
    key: "fCompanyName"
  }, {
    title: '操作',
    width: 120,
    key: 'options',
    render(row) {
      return [h(
        NButton, {
          onClick: () => {
            props.formValue.companyName= row.fCompanyName
            show.value = false
          }
        }, '选择',
      ), ]
    }
  }];

  const companyData = props.infoValue;
  const show = ref(false);
  const selectCompany = () => {
    show.value = true
  }

</script>

<style>
</style>
