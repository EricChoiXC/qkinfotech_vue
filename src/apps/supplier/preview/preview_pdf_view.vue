<script setup>
  import {
    ref,
    onMounted,
    computed
  } from 'vue';
  import {
    useDialog,
    useMessage,
  } from "naive-ui";
  import {
    useRoute
  } from 'vue-router';
  import {
    format
  } from "date-fns";
  import pdfModel from '@/utils/pdfModel.js';
  import pdfInfoModel from '@/utils/pdfInfoModel.js';
  import pdfDesignerModel from '@/utils/pdfDesignerModel.js';
  import pdfItemModel from '@/utils/pdfItemModel.js';
  import baseUrl from '@/utils/baseUrl'
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const message = useMessage();
  const dialog = useDialog();
  const route = useRoute();
  // const fFileId = ref(); //附件文件 id
  const fId = ref(); //supplier id
  const title = ref(); //项目标题
  const name = ref(); //公司名称
  const status = ref(); //状态 0已创建 1已保存 2已递交 9过期
  const packageIds = ref(); //包件ids
  const packageNames = ref(); //包件名称
  const supplierValue = ref([]);
  const designerValue = ref([]);
  const itemValues = ref([]);
  //以下是html拼接变量
  const renderedTemplate = ref(''); // 用来渲染模板字符串的变量
  let infos = ref(''); //公司信息 data
  let designers = ref(''); //设计师 data
  let items = ref(''); //项目 data

  //加载动画
  const show = ref(true)
  const showMsg = ref("正在生成预览...")
  //pdf加载动画modal
  const pdfShow = ref(false);

  onMounted(async () => {
    const value = localStorage.getItem('supplierValue');
    if (value) {
      // 解析存储的数据
      const data = JSON.parse(value);
      fId.value = data.fId;
      title.value = data.title;
      name.value = data.name;
      packageNames.value = data.packageNames;
      packageIds.value = data.packageIds;
      status.value = data.fCurrentStatus;
      supplierValue.value = data.infoValue;
      designerValue.value = data.designerValue;
      itemValues.value = data.itemValues;

      let promises = []; // 存储所有的 Promise
      let index = 0; //ppt页数

      // 替换模板 展示html公司
      supplierValue.value.forEach(function(element) {
        index++;
        let str = index.toString().padStart(2, '0'); // 指定长度为2，填充字符为'0'
        let infosTemplate = pdfInfoModel;
        infos.value += replaceInfos(infosTemplate, element, str);
      });

      // 处理设计师
      for (const element of designerValue.value) {
        let winning = "";
        let creators = "";
        //设计奖项
        element.winning.forEach(function(e) {
          if (e.fSimpleName != '') {
            winning += ((e.fYear ? e.fYear : "") + '年:' + e.fSimpleName + '<br>');
          } else {
            winning += ((e.fYear ? e.fYear : "") + '年:' + e.fName + '<br>');
          }
        });
        //设计业绩
        element.creators.forEach(function(e) {
          creators += (e.name + '<br>');
        });
        let infosTemplate = pdfDesignerModel; //模板
        index++;
        let str = index.toString().padStart(2, '0'); // 指定长度为2，填充字符为'0'
        infosTemplate = infosTemplate.replace('${index}', str);

        // 获取图片
        const response = await api.supplierPdfGetPic([{
          fId: element.fId,
          fModelName: "com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerMain",
          fKey: "designer",
        }]);
        let src = ""; //图片获取
        if (response.data.length !== 0) {
          src = response.data[0].src;
        }
        //通过设计师id找到主要项目
        const value = itemValues.value.find(item =>
          item.designerId === element.fId
        );
        //
        const response2 = await api.supplierPdfGetPic([{
          fId: value.fId,
          fModelName: "com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement",
          fKey: "achievement",
        }, {
          fId: value.fId,
          fModelName: "com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement",
          fKey: "achievement2",
        }]);
        let src1 = response2.data[0]?.src || '';
        let src2 = response2.data[1]?.src || '';
        //
        console.log(element);
        designers.value += replaceDesigner(infosTemplate, element, winning, creators, src, str, element
          .companyName, value,
          src1, src2);
      }

      // 处理项目
      for (const element of itemValues.value) {
        let infosTemplate = pdfItemModel;
        index++;
        let str = index.toString().padStart(2, '0'); // 指定长度为2，填充字符为'0'
        infosTemplate = infosTemplate.replace('${index}', str);

        // 获取图片
        const response = await api.supplierPdfGetPic([{
          fId: element.fId,
          fModelName: "com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement",
          fKey: "achievement",
        }, {
          fId: element.fId,
          fModelName: "com.qkinfotech.core.tendering.model.apps.designer.AppsDesignerAchievement",
          fKey: "achievement2",
        }]);
        let src1 = response.data[0]?.src || '';
        let src2 = response.data[1]?.src || '';
        items.value += replaceItem(infosTemplate, element, src1, src2, str);
      }

      // 最后合并
      renderedTemplate.value = replacePlaceholders(pdfModel, title.value, name.value, infos.value, designers
        .value, items.value);
    }

    show.value = false;
  });


  // 替换模板中的占位符方法
  const replacePlaceholders = (template, title, name, infos, designers, items) => {
    return template.replace('${title}', title).replace('${name}', name)
      .replace('${infos}', infos).replace('${designer}', designers).replace('${item}', items);
  };
  //替换公司信息
  const replaceInfos = (template, supplierValue, index) => {
    return template.replace('${fCompanyName}', supplierValue.fCompanyName ? supplierValue.fCompanyName : "")
      .replace('${fCountry}', supplierValue.fCountry ? supplierValue.fCountry : "")
      .replace('${fLegalRepresentative}', supplierValue.fLegalRepresentative ? supplierValue.fLegalRepresentative :
        "")
      .replace('${fCompanyRegisteredAddress}', supplierValue.fCompanyRegisteredAddress ? supplierValue
        .fCompanyRegisteredAddress : "")
      .replace('${fIncorporationTime}', supplierValue.fIncorporationTime ? supplierValue.fIncorporationTime : "")
      .replace('${fCompanyPhone}', supplierValue.fCompanyPhone ? supplierValue.fCompanyPhone : "")
      .replace('${fOfficialWebsiteAddress}', supplierValue.fOfficialWebsiteAddress ? supplierValue
        .fOfficialWebsiteAddress : "")
      .replace('${fDesignersTotal}', supplierValue.fDesignersTotal ? supplierValue.fDesignersTotal : "")
      .replace('${fRegisteredArchitectsOrLandscapeArchitects}', supplierValue
        .fRegisteredArchitectsOrLandscapeArchitects ? supplierValue.fRegisteredArchitectsOrLandscapeArchitects : "")
      .replace('${fContactPerson}', supplierValue.fContactPerson ? supplierValue.fContactPerson : "")
      .replace('${fDuties}', supplierValue.fDuties ? supplierValue.fDuties : "")
      .replace('${fPhone}', supplierValue.fPhone ? supplierValue.fPhone : "")
      .replace('${fEmail}', supplierValue.fEmail ? supplierValue.fEmail : "")
      .replace('${fMailingAddressAndPostcode}', supplierValue.fMailingAddressAndPostcode ? supplierValue
        .fMailingAddressAndPostcode : "")
      .replace('${fBusinessregistrationbusinesslicensenumber}', supplierValue
        .fBusinessregistrationbusinesslicensenumber ? supplierValue.fBusinessregistrationbusinesslicensenumber : "")
      .replace('${fDesignQualificationTypeOrLevel}', supplierValue.fDesignQualificationTypeOrLevel ? supplierValue
        .fDesignQualificationTypeOrLevel : "")
      .replace('${fCompanyProfile}', supplierValue.fCompanyProfile ? supplierValue.fCompanyProfile : "")
      .replace('${index}', index);
  };
  //替换设计师信息
  const replaceDesigner = (template, designerValue, winning, creators, src, index, companyName, itemValues,
    src1, src2) => {
    let result = "";
    //主要项目数据
    const time = itemValues.time1 + ' - ' + itemValues.time2
    let type = "";
    let scale = "";
    itemValues.typeScales.forEach(function(element) {
      element.forEach(function(e) {
        e.forEach(function(ele) {
          type += ele.fMasterDataTypeId.fName + ";" //功能
          scale += (ele.value + ele.fMasterDataScaleId.fName + ";") //规模
        })
      })
    })

    result = template.replace('${personName}', designerValue.name ? designerValue.name : "")
      .replace('${level}', designerValue.level ? designerValue.level : "")
      .replace('${years}', designerValue.years ? designerValue.years : "")
      .replace('${winning}', winning)
      .replace('${creators}', creators)
      .replace('${designerSrc}', src)
      .replace('${companyName}', companyName)
      .replace('${name}', itemValues.name ? itemValues.name : "")
      .replace('${place}', itemValues.place ? itemValues.place : "")
      .replace('${owner}', itemValues.owner ? itemValues.owner : "")
      .replace('${scale}', scale)
      .replace('${function}', type)
      .replace('${time}', time)
      .replace('${status}', itemValues.status === '20' ? '已建成' : '深化设计中')
      .replace('${remarks}', itemValues.remarks ? itemValues.remarks : "")
      .replace('${itemSrc1}', src1)
      .replace('${itemSrc2}', src2);
    return result;
  }
  //替换项目信息
  const replaceItem = (template, itemValues, src1, src2, index) => {
    // const time = format(itemValues.time1, "yyyy/MM/dd") + ' - ' + format(itemValues.time2, "yyyy/MM/dd")
    const time = itemValues.time1 + ' - ' + itemValues.time2
    let type = "";
    let scale = "";
    itemValues.typeScales.forEach(function(element) {
      element.forEach(function(e) {
        e.forEach(function(ele) {
          type += ele.fMasterDataTypeId.fName + ";" //功能
          scale += (ele.value + ele.fMasterDataScaleId.fName + ";") //规模
        })
      })
    })
    const t = template.replace('${name}', itemValues.name ? itemValues.name : "")
      .replace('${place}', itemValues.place ? itemValues.place : "")
      .replace('${owner}', itemValues.owner ? itemValues.owner : "")
      .replace('${scale}', scale)
      .replace('${function}', type)
      .replace('${time}', time)
      .replace('${status}', itemValues.status === '20' ? '已建成' : '深化设计中')
      .replace('${remarks}', itemValues.remarks ? itemValues.remarks : "")
      .replace('${itemSrc1}', src1)
      .replace('${itemSrc2}', src2)
    // .replace('${index}', index);
    return t;
  }

  //下载
  const downloadFile = async () => {
    const result = await api.supplierMainGetSupplierFileList({
      fId: fId.value
    });
    window.open(baseUrl.pmUrl + '/pm/file/download?fId=' + result.data.fileId)
  }

  //取公告超时时间
  async function getNoticeDateRange(fId, tabKey) {
    try {
      const result = await api.mainGetNoticeDateRange({
        fId: fId
      });
      const now = Date.now();
      if (!result.data.flag && result.data.deadline < now) {
        await handleError("超出申请文件提交日期！", tabKey);
      } else {
        // 如果没有超出期限，返回请求结果
        return result;
      }
    } catch (error) {
      console.error('请求失败:', error);
    }
  }

  //撤回提示
  function WithdrawalTip(msg, fId, fCurrentStatus) {
    dialog.warning({
      title: '提示',
      content: msg,
      positiveText: '是',
      negativeText: '否',
      maskClosable: false,
      onPositiveClick: () => {
        api.supplierMainSave({
          fId: fId,
          fCurrentStatus: fCurrentStatus
        }).then(result => {
          //更新ekp 投标文件数量
          api.supplierMainUpdateEkpFileSize({
            supplierId: context.user(),
            noticeId: id
          })
          message.info('撤回成功！')
          window.close()
        });
      },
    })
  }

  //提交
  const submit = async () => {
    try {
      //进行加载动画
      pdfShow.value = true;
      //
      const result = await api.supplierMainUpdateSupplier({
        fId: fId.value,
        // fSubTime : new Date(),
        // fCurrentStatus: 2
      });
      const re = await api.supplierPdfPdfDl({
        html: renderedTemplate.value,
        fId: fId.value,
        name: name.value,
        packageNames: packageNames.value,
        packageIds: packageIds.value,
      });
      message.info('提交成功！');
      //更新ekp 投标文件数量
      api.supplierMainUpdateEkpFileSize({
        supplierId: context.user(),
        noticeId: id
      })
      window.open(context.path+"/view/actionSuccess", "_self");
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败！');
    }
  };

  //撤回
  const withdraw = async () => {
    // 截至日期小于一天 提示 确认撤回/取消不撤回
    const res = await getNoticeDateRange(fId.value, 'ppt-view');
    const now = Date.now();
    const timeDifference = Math.abs(now - res.data.deadline);
    const oneDayMillis = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDayMillis) {
      WithdrawalTip('距离截至日期少于一天，是否撤回？', fId.value, 0);
      return
    }
    WithdrawalTip('是否撤回？', fId.value, 0);
  }

  //关闭
  const closeWindow = () => {
    window.close()
  }
</script>

<template>
  <div v-html="renderedTemplate"></div>
  <n-grid :x-gap="12" :y-gap="8" :cols="1" style="margin-top: 20px;margin-bottom:20px">
    <n-grid-item span="2">
      <n-grid-item style="display: flex;justify-content: center;">
        <n-space>
          <n-button type="primary" v-if="status===9||status===2" @click="downloadFile()">
            下载
          </n-button>
          <n-button type="primary" v-if="status!==9&&status===1" @click="submit()">
            提交申请
          </n-button>
          <n-button type="error" v-if="status!==9&&status===2" @click="withdraw()">
            撤回申请
          </n-button>
          <n-button type="error" @click="closeWindow()">
            关闭
          </n-button>
        </n-space>
      </n-grid-item>
    </n-grid-item>
  </n-grid>
  <n-modal style="width:400px;" v-model:show="show" preset="dialog" :mask-closable="false">
    <div style="width: 100%">
      <n-space justify="center">
        <n-spin size="large" :show="show">
          <template #description>
            <div style="font-weight: bold; font-size: 24px; color: #18a058">{{showMsg}}</div>
          </template>
        </n-spin>
      </n-space>
    </div>
  </n-modal>

  <n-modal style="width:400px;" v-model:show="pdfShow" preset="dialog" :mask-closable="false">
    <div>
      <n-spin size="large" :show="true" style="margin-left: 40%;">
        <template #description>
          正在生成PDF...
        </template>
      </n-spin>
    </div>
  </n-modal>

</template>
