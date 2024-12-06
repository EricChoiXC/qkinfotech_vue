<template>
  <n-card v-for="item in data" style="margin-bottom:20px" :bordered="false">
    <n-form ref="formRef" label-placement="" label-width="150px">
      <n-table :single-line="false">
        <tbody>
          <tr>
            <td style="width:20%;" class="tdcenter">公告标题</td>
            <td class="tdleft" colspan="3">
              <n-form-item>
                {{item.title}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">包件信息</td>
            <td class="tdleft">
              <n-form-item>
                {{item.packageNames}}
              </n-form-item>
            </td>
            <td style="width:20%;" class="tdcenter">资格预审公告</td>
            <td class="tdleft">
              <n-form-item>
                <n-button text tag="a" :href="item.noticeurl" target="_blank" type="primary">
                  {{item.noticeName}}
                </n-button>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">公告发布日期</td>
            <td class="tdleft">
              <n-form-item>
                {{item.noticeReleaseDate}}
              </n-form-item>
            </td>
            <td style="width:20%;" class="tdcenter">标书获取日期</td>
            <td class="tdleft">
              <n-form-item>
                {{item.bidTerm}}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">获取标书单位<br>
              <n-button type="tertiary" :round="true" size="tiny" @click="exportCompany">
                <template #icon>
                  <n-icon>
                    <download></download>
                  </n-icon>
                </template>
                单位导出
              </n-button>
            </td>
            <td class="tdleft">
              <n-form-item>
                <n-list>
                  <n-list-item>
                    <n-thing title="" content-style="margin-top: 10px;">
                      <n-button text type="primary" @click="getCompanyList">Heller Manus Inc.</n-button><br>
                      上海大舍建筑设计事务所(有限合伙)<br>
                      上海市建工设计研究总院有限公司<br>
                      EID GROUP LIMITED<br>
                      倍道建筑景观设计(上海)有限公司<br>
                      奥冉(上海)建设工程设计有限公司<br>
                      铿晓设计咨询(上海)有限公司<br>
                      阿特金斯顾问(深圳)有限公司<br>
                      株式会社隈研吾建筑都市设计事务所<br>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-form-item>
            </td>
            <td style="width:20%;" class="tdcenter">申请文件<br>
              <n-button type="tertiary" :round="true" size="tiny" @click="changeFileShow">
                <template #icon>
                  <n-icon>
                    <download></download>
                  </n-icon>
                </template>
                文件下载
              </n-button>
              <br>
              <n-button type="tertiary" :round="true" size="tiny">
                <template #icon>
                  <n-icon>
                    <search></search>
                  </n-icon>
                </template>
                文件搜索
              </n-button>
            </td>
            <td class="tdleft">
              <n-form-item>
                <n-list>
                  <n-list-item>
                    <n-thing title="" content-style="margin-top: 10px;">
                      <n-button text tag="a" :href="item.noticeurl" target="_blank" type="primary">
                        株式会社隈研吾建筑都市设计事务所的申请文件
                      </n-button><br>
                      Heller Manus Inc.的申请文件<br>
                      上海大舍建筑设计事务所(有限合伙)的申请文件<br>
                      上海市建工设计研究总院有限公司的申请文件<br>
                      EID GROUP LIMITED的申请文件<br>
                      倍道建筑景观设计(上海)有限公司的申请文件<br>
                      奥冉(上海)建设工程设计有限公司的申请文件<br>
                      铿晓设计咨询(上海)有限公司的申请文件<br>
                      阿特金斯顾问(深圳)有限公司的申请文件<br>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">申请文件截至日期</td>
            <td class="tdleft" colspan="3">
              <n-form-item>
                {{item.appDocDeadline}}
              </n-form-item>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-form>
  </n-card>
  <n-modal n-modal style="width:60%" v-model:show="fileShow" preset="dialog" title="申请文件下载" :mask-closable="false">
    <n-button>下载</n-button>
    <n-data-table :columns="columns" :data="data1" />
  </n-modal>

  <n-modal style="width:60%" v-model:show="show" preset="dialog" title="单位信息" :mask-closable="false">
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>公司名称</th>
          <th>人员名称</th>
          <th>手机号</th>
          <th>是否核对</th>
          <th>日期</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Heller Manus Inc.</td>
          <td>张家凤</td>
          <td>18017331315</td>
          <td>已核对（官网）</td>
          <td>2022-09-28</td>
          <td>登记信息</td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>

  <n-modal style="width:60%" v-model:show="exportShow" preset="dialog" title="导出字段" :mask-closable="false">
    <n-button>导出</n-button>
    <n-checkbox-group v-model:value="cities">
      <n-space item-style="display: flex;">
        <n-checkbox value="companyName" label="公司名称" />
        <n-checkbox value="name" label="人员名称" />
        <n-checkbox value="phone" label="手机号" />
        <n-checkbox value="email" label="邮箱" />
        <n-checkbox value="time" label="领购时间" />
      </n-space>
    </n-checkbox-group>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>序号</th>
          <th>单位名称</th>
          <th>联系人</th>
          <th>手机</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" item in date2">
          <td>{{item.no}}</td>
          <td>{{item.company}}</td>
          <td>{{item.name}}</td>
          <td>{{item.phone}}</td>
          <td>{{item.email}}</td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>

</template>

<script setup>
  import {
    DownloadOutline as download
  } from '@vicons/ionicons5';
  import {
    SearchOutline as search
  } from '@vicons/ionicons5';
  import {
    reactive
  } from 'vue';


  const disabled = ref(true);
  const data = ref([{
    title: "金桥副中心中央公园综合体国际方案征集",
    packageIds: "Shanghai",
    packageNames: "金桥副中心中央公园综合体国际方案征集（景观组）",
    noticeId: "12345678",
    noticeName: "[2207040002]金桥副中心中央公园综合体国际方案征集公告",
    noticeurl: "/opdesk/projectManagement/implementation/fils-view2",
    // noticeReleaseDate: Date.now(),
    // bidTerm: [Date.now(), Date.now()],
    noticeReleaseDate: "2022-09-27",
    bidTerm: "2022-09-27 ~ 2022-10-08",
    bidCompany: "公司1,公司2,公司3...",
    appInfo: "包件1和包件2的投标文件名",
    // appDocDeadline: Date.now(),
    appDocDeadline: "2022-10-08",
    appDoc: "公司1的申请文件,公司2的申请文件,公司3的申请文件"
  }]);


  const cities = reactive(['companyName', 'name', 'phone', 'email', 'time'])
  const show = ref(false);
  const getCompanyList = () => {
    show.value = true;
  }

  const exportShow = ref(false);
  const exportCompany = () => {
    exportShow.value = true;
  }

  const fileShow = ref(false);
  const changeFileShow = () => {
    fileShow.value = true;
  }

  const data1 = [{
    index: 1,
    name: 'Heller Manus Inc.的申请文件 ',
  }, {
    index: 2,
    name: '上海大舍建筑设计事务所(有限合伙)的申请文件',
  }, {
    index: 3,
    name: '上海市建工设计研究总院有限公司的申请文件',
  }, {
    index: 4,
    name: 'EID GROUP LIMITED的申请文件',
  }, {
    index: 5,
    name: '倍道建筑景观设计(上海)有限公司的申请文件',
  }, {
    index: 6,
    name: '奥冉(上海)建设工程设计有限公司的申请文件',
  }, {
    index: 7,
    name: '铿晓设计咨询(上海)有限公司的申请文件',
  }, {
    index: 8,
    name: '阿特金斯顾问(深圳)有限公司的申请文件',
  }, {
    index: 9,
    name: '株式会社隈研吾建筑都市设计事务所的申请文件'
  }]

  const columns = [{
    type: "selection",
  }, {
    title: "申请文件列表",
    key: "name"
  }];

  const date2 = [{
    no:'1',
    company:'Heller Manus Inc.',
    name:"张家凤",
    phone:"18017331315",
    email:"2660928447@qq.com"
  },{
    no:'2',
    company:'上海大舍建筑设计事务所（有限合伙）',
    name:"董思超",
    phone:"18616831537",
    email:"ds255516@163.com"
  },{
    no:'3',
    company:'上海市建工设计研究总院有限公司',
    name:"徐成",
    phone:"18516500117",
    email:"xucheng@scdri.com"
  },{
    no:'4',
    company:'EID GROUP LIMITED',
    name:"詹育蒨",
    phone:"13918630450",
    email:"amber.jan@eid-arch.com.hk"
  },{
    no:'5',
    company:'倍道建筑景观设计（上海）有限公司',
    name:"郭小旭",
    phone:"18616377127",
    email:"474592377@qq.com"
  },{
    no:'6',
    company:'奥冉（上海）建设工程设计有限公司',
    name:"杨琴",
    phone:"17321251578",
    email:"business@aura-scape.com"
  },{
    no:'7',
    company:'铿晓设计咨询（上海）有限公司',
    name:"Lydia Chen",
    phone:"13761828677",
    email:"lchen@hassellstudio.com"
  },{
    no:'8',
    company:'阿特金斯顾问（深圳）有限公司',
    name:"何欣瑶",
    phone:"18621728843",
    email:"xinyao.he@atkinsglobal.com"
  }]

</script>

<style>
  .fDiv {
    text-align: center;
  }
</style>
