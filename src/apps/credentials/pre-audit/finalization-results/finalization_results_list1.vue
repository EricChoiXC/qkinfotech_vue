<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="金桥副中心中央公园综合体国际方案征集（景观组）" tab="金桥副中心中央公园综合体国际方案征集（景观组）">
      <n-button @click="changeResult" type="primary">修改</n-button>
      <n-list>
        <n-list-item>
          <n-thing title="" content-style="margin-top: 10px;">
            善启设计咨询(上海)有限公司<br>
            AGENCETER<br>
            百安木设计咨询(北京)有限公司 <br>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
  </n-tabs>

  <n-card v-for="item in data" style="margin-bottom:20px" size="small">
    <n-button text @click="handleClick">
      <template #icon>
        <n-icon>
          <link-icon />
        </n-icon>
      </template>
      2024年4月29日发布的关于22-07地块的公告
    </n-button>
    <n-divider />
  </n-card>

  <n-modal style="width:60%" v-model:show="editShow" preset="dialog" title="编辑入围结果" :mask-closable="false">
    <n-grid :y-gap="20" :cols="1">
      <n-gi>
        <p style="font-size: 16px;">包件:金桥副中心中央公园综合体国际方案征集（景观组）</p>
      </n-gi>
      <n-gi>
        <n-transfer :show-selected="false" ref="transfer" v-model:value="value" virtual-scroll
          :options="options" source-filterable />
      </n-gi>
    </n-grid>
  </n-modal>

</template>

<script setup>
  import {
    CashOutline as CashIcon
  } from '@vicons/ionicons5'
  import {
    LinkOutline as LinkIcon
  } from '@vicons/ionicons5'

  const data = ref([{
    packageIds: "Shanghai,Beijin",
    packageNames: "包件1;包件2",
    companyIds: "1,2,3",
    companyNames: "公司1，公司2，公司3",
    noticeId: "12345678",
    noticeName: "2024年5月3日发布的包件1和包件2的公告",
    noticeurl: "www.baidu.com",
  }]);

  const handleClick = () => {
    window.open("baidu.com")
  }

  const editShow = ref(false);
  const changeResult = () => {
    editShow.value = true
  }

  const options = ref([{
    label: '善启设计咨询(上海)有限公司',
    value: '1',
  }, {
    label: 'AGENCETER',
    value: '2',
  }, {
    label: '百安木设计咨询(北京)有限公司	',
    value: '3',
  }]);
  const value = ref(['1', '2', '3']);
</script>

<style>
</style>
