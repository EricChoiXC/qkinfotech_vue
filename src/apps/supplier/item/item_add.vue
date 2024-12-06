<template>
  <n-card>
    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules">
      <n-grid :x-gap="12" :y-gap="8" :cols="2">
        <n-grid-item span="2">
          <n-form-item label="项目名称" path="name">
            <n-input v-model:value="formValue.name" :disabled="false"></n-input>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="主创设计师" path="designerName">
            <n-input v-model:value="formValue.designerName" :disabled="true"></n-input>
            <n-button @click="selectDesigner">选择</n-button>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="项目地点" path="place">
            <n-input v-model:value="formValue.place" :disabled="false"></n-input>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="业主名称" path="owner">
            <n-input v-model:value="formValue.owner" :disabled="false"></n-input>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="功能" path="function">
            <n-select :options="options" tag multiple @update:value="updateFProjectType"></n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2" v-for="(typeScaleGroup, index) in applicationModel.typeScales">
          <!-- 显示项目类型 -->
          <!-- 项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName}}) -->
          <n-form-item :path="'scale-group-' + index">
            <template #label>
              <span>项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName}})</span><span
                class="n-form-item-label__asterisk">&nbsp;*</span>
            </template>
            <!-- 遍历该类型下的每一个scale -->
            <template v-for="scale in typeScaleGroup">
              <!-- 添加输入框 -->
              <n-input-group>
                <n-input-number v-model:value="scale.value" :show-button="false" :key="scale.fId"></n-input-number>
                <!-- 添加单位 -->
                <n-input-group-label>{{ scale.fMasterDataScaleId.fName }}</n-input-group-label>
              </n-input-group>
              <!-- 如果不是该类型下的最后一个scale，添加换行 -->
              <br v-if="scale !== typeScaleGroup[typeScaleGroup.length - 1]">
            </template>
          </n-form-item>

        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="服务起止时间" path="time">
            <n-date-picker v-model:formatted-value="range" value-format="yyyy-MM-dd" type="daterange" clearable />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="项目现状" path="status">
            <n-select v-model:value="formValue.status" :options="stausOptions" />
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="所承担的工作内容" path="remarks">
            <n-input v-model:value="formValue.remarks" :disabled="false" type="textarea"></n-input>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="2">
          <n-form-item label="项目效果图" path="">
            <n-grid-item span="2">
              <n-form-item label="" path="">
                <attachment fkey="achievement" :picture="true"
                  modelName="com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement"
                  :modelId="formValue.fId"></attachment>

                <attachment fkey="achievement2" :picture="true"
                  modelName="com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement"
                  :modelId="formValue.fId"></attachment>
              </n-form-item>
            </n-grid-item>
          </n-form-item>
        </n-grid-item>

        <n-grid-item span="3">
          <n-grid-item style="display: flex;justify-content: center;">
            <n-space>
              <n-button type="primary" @click="save()">
                保存
              </n-button>
              <n-button type="error" @click="close()">
                关闭
              </n-button>
            </n-space>
          </n-grid-item>
        </n-grid-item>
      </n-grid>
    </n-form>
  </n-card>

  <n-modal style="width:55%;" v-model:show="show" preset="dialog" title="选择主创设计师" :mask-closable="false">
    <n-data-table :columns="columns" :data="data" :bordered="false" />
  </n-modal>

</template>

<script setup>
  import {
    defineProps,
    defineEmits,
    provide,
    reactive
  } from 'vue';
  import attachment from '@/apps/common/attachment/attachment.vue'
  import {
    format
  } from "date-fns";
  import createApi from './api'

  const api = createApi(getCurrentInstance())

  const validatesc1 = (rule, value, callback) => {
    if (applicationModel.typeScales[0][0].value === "" || applicationModel.typeScales[0][0].value === null ||
      typeof applicationModel.typeScales[0][0].value === "undefined" ||
      applicationModel.typeScales[0][1].value === "" || applicationModel.typeScales[0][1].value === null ||
      typeof applicationModel.typeScales[0][1].value === "undefined") {
      callback(new Error('请输入项目规模'));
    } else {
      callback();
    }
  }
  const validatesc2 = (rule, value, callback) => {
    if (applicationModel.typeScales[1][0].value === "" || applicationModel.typeScales[1][0].value === null ||
      typeof applicationModel.typeScales[1][0].value === "undefined" ||
      applicationModel.typeScales[1][1].value === "" || applicationModel.typeScales[1][1].value === null ||
      typeof applicationModel.typeScales[1][1].value === "undefined") {
      callback(new Error('请输入项目规模'));
    } else {
      callback();
    }
  }

  const rules = {
    'scale-group-0': [{
      validator: validatesc1,
      trigger: ["blur", "change"]
    }],
    'scale-group-1': [{
      validator: validatesc2,
      trigger: ["blur", "change"]
    }],
    designerName: {
      required: true,
      message: "请选择主创设计师",
      trigger: "change"
    },
    name: {
      required: true,
      message: "请输入项目名称",
      trigger: "blur"
    },
    place: {
      required: true,
      message: "请输入项目地点",
      trigger: "blur"
    },
    owner: {
      required: true,
      message: "请输入业主",
      trigger: "blur"
    },
    time: {
      required: true,
      validator(rule, value) {
        if (range.value === undefined || range.value.length === 0) {
          return new Error("请输入服务起止时间");
        }
        return true;
      },
      trigger: "blur"
    }
  }

  const applicationModelList = reactive({
    fProjectTypes: [],
  })
  const applicationModel = reactive({
    selectedTypes: [],
    typeScales: []
  })
  //选中数据
  const selecteds = reactive({
    fProjectScale: [],
  })

  //类型选项
  const options = computed(() => {
    return applicationModelList.fProjectTypes.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
      // types: item.types
    }));
  });

  const typeList = async () => {
    await api.typeList().then(result => {
      const dataList = result.data.list;
      applicationModelList.fProjectTypes.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        applicationModelList.fProjectTypes.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  }

  // 项目类型
  const updateFProjectType = async (v, targets) => {
    if (v.length === 0) {
      applicationModel.selectedTypes.length = 0;
      // props.formValue.typeScales[0].length = 0;
    }
    applicationModel.selectedTypes = v.map(id => ({
      fId: id
    }));

    selecteds.fProjectScale = targets
    const temp = new Set();

    const requests = applicationModel.selectedTypes.map(async item => {
      const query = [{
        "eq": {
          "fMasterDataTypeId.fId": item.fId
        }
      }];
      const res = await api.typeScaleList({
        query
      });

      res.data.list.forEach(scale => temp.add(scale.fMasterDataScaleId.fId));

      return res.data.list;
    });

    const results = await Promise.all(requests);

    results.forEach((res) => {
      let flag = true;
      applicationModel.typeScales.forEach((typeScales) => {
        if (typeScales[0].fMasterDataScaleId.fId === res[0].fMasterDataScaleId.fId || typeScales[1]
          .fMasterDataScaleId.fId === res[0].fMasterDataScaleId.fId) {
          flag = false;
        }
      })
      if (flag) {
        applicationModel.typeScales.push(res)
        // props.formValue.typeScales[0].push(res)
      }
    })

    applicationModel.typeScales = applicationModel.typeScales.filter(typeScale =>
      temp.has(typeScale[0].fMasterDataScaleId.fId)
    );
    // props.formValue.typeScales[0] = props.formValue.typeScales[0].filter(typeScale =>
    //   temp.has(typeScale[0].fMasterDataScaleId.fId)
    // );

  }

  const formRef = ref(null)
  const stausOptions = [{
      label: '已建成',
      value: "20",
      key: '20'
    },
    {
      label: '深化设计中',
      value: "10",
      key: '10'
    }
  ]

  const props = defineProps({
    itemfId: String,
    designers: Array,
  })
  const range = ref();
  const formValue = reactive({
    fId: props.itemfId,
    name: "",
    place: "",
    owner: "",
    typeScales: [],
    time1: "", //开始时间
    time2: "", //结束时间
    status: "", //状态
    remarks: "",
    designerId: "",
    designerName: "",
  });

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
      // 如果没有错误，继续执行
      if (range.value.length > 0) {
        formValue.time1 = range.value[0];
        formValue.time2 = range.value[1];
      }
      // 假设 applicationModel.typeScales 是你想要添加的数据
      formValue.typeScales.push(applicationModel.typeScales);
      // 使用 emit 触发 'saveItem' 事件，并传递 formValue
      emit('saveItem', formValue);
    });
  }
  const close = () => {
    emit('closeItem');
  }


  //======================项目选择对应主创设计师==========================
  const columns = [{
    title: "设计师名称",
    key: "name"
  }, {
    title: "职称/执业资格",
    key: "level"
  }, {
    title: "从业年限",
    key: "years"
  }, {
    title: '操作',
    width: 120,
    key: 'options',
    render(row) {
      return [h(
        NButton, {
          onClick: () => {
            formValue.designerId = row.fId
            formValue.designerName = row.name
            show.value = false
          }
        }, '选择',
      ), ]
    }
  }];

  const data = props.designers;
  const show = ref(false);
  const selectDesigner = () => {
    show.value = true
  }

  onMounted(() => {
    typeList();
  })
</script>

<style>
</style>
