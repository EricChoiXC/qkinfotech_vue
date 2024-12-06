<template>
  <n-form ref="formRef" :model="formValue">
    <n-table :single-line="false">
      <tbody>
        <!--        <tr>
          <td class="tdcenter">是否联合体</td>
          <td class="tdleft">
            <n-form-item label="" path="">
              <n-space>
                <n-radio :checked="checkedValueRef === 'yes'" value="yes" name="basic-demo" @change="handleChange">
                  是
                </n-radio>
                <n-radio :checked="checkedValueRef === 'no'" value="no" name="basic-demo" @change="handleChange">
                  否
                </n-radio>
              </n-space>
            </n-form-item>
          </td>
        </tr> -->
        <tr>
          <td style="width: 20%;" class="tdcenter" colspan="2">
            <n-space style="margin-top: 5px;">
              <n-button type="info" @click="addDetail">添加公司</n-button>
            </n-space>
            <n-form-item>
              <n-data-table v-model:data="data" :columns="columns"></n-data-table>
            </n-form-item>
          </td>
        </tr>
      </tbody>
    </n-table>
    <n-grid :cols="1">
      <n-gi>
        <n-space style="display: flex;justify-content: center;">
          <n-button type="primary" @click="submitCompany">提交</n-button>
          <n-button type="error" @click="closeCompanyShowModal">取消</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup>
  import {
    idID,
    useDialog,
    useMessage
  } from 'naive-ui'
  import {
    useRoute
  } from 'vue-router';
  import createApi from './api'

  //
  const api = createApi(getCurrentInstance())
  const route = useRoute()
  const dialog = useDialog();
  const message = useMessage();
  const props = defineProps({
    fMainId: String,
    designers: Array
  })
  let fMainId = props.fMainId ? props.fMainId : route.query.fId;

  const data = ref([])

  const columns = [{
    key: "fCompanyName",
    title: "联合公司名称",
    render(row, index) {
      return [h(
        NInput, {
          value: row.fCompanyName,
          disabled: index === 0,
          onUpdateValue(v) {
            data.value[index].fCompanyName = v
          },
          onBlur: (v) => handleBlur(v, row, index),
          style: {
            width: '80%'
          }
        }
      )]
    }
  }, {
    key: "fIsMain",
    title: "是否为主体",
    render(row, index) {
      return [h(
        NRadio, {
          checked: row.fIsMain === 'true',
          value: true,
          name: `fIsMain-${index}`,
          onChange: (newValue) => handleChange(newValue, row, index), // 添加值改变事件处理函数
        }, "是"
      ), h(
        NRadio, {
          checked: row.fIsMain === 'false',
          value: false,
          name: `fIsMain-${index}`,
          onChange: (newValue) => handleChange(newValue, row, index), // 添加值改变事件处理函数
        }, "否"
      )]
    }
  }, {
    key: "action",
    title: "操作",
    render(row, index) {
      if (index !== 0) {
        return h(
          NButton, {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => deleteItem(row, index),
          }, "删除"
        )
      }
    }
  }]

  // 输入校验公司 是否存在组织机构
  const handleBlur = async (v, row, index) => {
    const requestData = {
      query: {
        "eq": {
          "fName": v.target.value
        }
      }
    }
    await api.elementList(requestData).then(result => {
      const dataList = result.data.list;
      if (dataList.length != 0) {
        // 从data中获取 公司id 用于存储
        row.fCompanyId = dataList[0].fId
        message.info('该供应商已存在与系统中！！', {
          duration: 5000
        })
      } else {
        message.info('请注意，该供应商未存在与系统中！！', {
          duration: 5000
        })
      }
    }).catch(err => {
      console.log(err)
    });
  }
  //选择主体radio事件
  const handleChange = (newValue, row, index) => {
    // newValue 是当前选中的值，true 或 false
    // 设置当前行的 fIsMain 属性为 newValue
    row.fIsMain = newValue.target.value;
    // 将其他行的 fIsMain 属性设置为 false
    for (let i = 0; i < data.value.length; i++) {
      if (i !== index) {
        data.value[i].fIsMain = 'false';
      }
    }
  };
  //添加行
  const addDetail = async () => {
    await api.supplierInviteCompanyInit().then(result => {
      const datafId = result.data.fId;
      data.value.push({
        fId: datafId,
        fCompanyName: '',
        fCompanyId: null,
        fIsMain: 'false',
        fSupplierId: {
          fId: fMainId
        }
      })
    }).catch(err => {
      console.log(err)
    });
  }
  //删除行
  const deleteItem = (row, index) => {
    dialog.warning({
      title: '警告',
      content: '是否删除该联合体？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        //如果有主创设计师选择了该公司 则不能删除
        const hasRecord = props.designers.some(item => item.companyName === row.fCompanyName);
        if(hasRecord){
          message.error('无法删除该联合体，请检查主创设计师中是否已输入该公司名称！')
          return
        }
        const formData = new FormData();
        if (row.fId === '') {
          data.value.splice(index, 1);
        } else {
          try {
            formData.append('fId', row.fId);
            // 删除公司信息记录
            const deleteSupplierInfoResult = await api.supplierMainDeleteSupplierInfo(formData);
            // 删除联合体关系
            const deleteCompanyInviteResult = await api.supplierInviteCompanyDelete(formData);
            // 成功删除后更新数据和显示成功消息
            data.value.splice(index, 1);
            message.success('删除成功!');
          } catch (err) {
            console.error('删除操作出错:', err);
          }
        }
      }
    })
  }

  const emit = defineEmits(['onClose'])
  //修改联合体 modal 取消
  const closeCompanyShowModal = () => {
    emit('onClose', data.value)
  }
  //修改联合体 modal 保存
  const submitCompany = async () => {
    //校验是否有一家公司为主体
    const firstTrueItem = data.value.find(item => item.fIsMain === 'true');
    const nameIsEmpity = data.value.find(item => item.fCompanyName === '');
    if (nameIsEmpity) {
      message.info('请检查公司名称是否填写！！')
      return
    }
    if (firstTrueItem) {
      await api.supplierMainInviteCompanySave(data.value).then(result => {
        message.success('提交成功！')
        emit('onClose', data.value)
      }).catch(err => {
        console.log(err)
      });
    } else {
      message.info('请确认是否决定主体公司！！')
      return
    }
    //保存之后把公司个数传到 供应商页面
  }

  const init = async () => {
    //联合体信息
    const requestData = {
      query: {
        "eq": {
          "fSupplierId.fId": fMainId
        }
      }
    }
    await api.supplierInviteCompanyList(requestData).then(result => {
      const list = result.data.list;
      if (list.length != 0) {
        for (var i = 0; i < list.length; i++) {
          const obj = {
            fId: list[i].fId,
            fCompanyName: list[i].fCompanyName,
            fCompanyId: list[i].fCompanyId === undefined ? "" : list[i].fCompanyId.fId,
            fSupplierId: {
              fId: list[i].fSupplierId.fId
            },
            fIsMain: list[i].fIsMain
          }
          data.value.push(obj);
        }
      }
    });
  }

  //初始化
  onMounted(() => {
    fMainId = route.query.fId;
    init();
  })
</script>

<style>
</style>
