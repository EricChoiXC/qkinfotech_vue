<template>
  <n-form
    ref="formRef"
    :model="ekpConfig"
    label-placement="left"
    label-width="150px"
  >
    <n-card>
      <n-grid :cols="1" y-gap="10">
        <n-gi>
          <p style="font-size: 16px; font-weight: bold; text-align: center">
            EKP对接组件配置
          </p>
        </n-gi>
        <n-gi>
          <n-form-item label="访问Ekp的url">
            <n-input v-model:value="ekpConfig.ekpUrl"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="EKP集群的Cookie名">
            <n-input v-model:value="ekpConfig.ekpCookie"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="EKP的数据库类型">
            <n-select
              v-model:value="ekpConfig.ekpDatabaseType"
              :options="databaseTypes"
              @update:value="changeDatabase"
            ></n-select>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="EKP的数据库链接">
            <!-- jdbc:mysql://localhost:3306/ekpv15?useUnicode=true&characterEncoding=UTF-8&useOldAliasMetadataBehavior=true -->
            <n-input v-model:value="ekpConfig.ekpDatabaseUrl"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="EKP的数据库用户名">
            <n-input v-model:value="ekpConfig.ekpDatabaseUsername"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="EKP的数据库密码">
            <n-input
              v-model:value="ekpConfig.ekpDatabasePassword"
              type="password"
              show-password-on="mousedown"
            ></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="项目审批流程模版ID">
            <n-input v-model:value="ekpConfig.ekpProjectApprovalTemplateId"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="ISO审批流程模版ID">
            <n-input v-model:value="ekpConfig.ekpIsoApprovalTemplateId"></n-input>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-space justify="center">
            <n-button type="info" @click="testLink">测试链接</n-button>
            <n-button type="primary" @click="submit">保存</n-button>
            <n-button type="error">取消</n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-card>
  </n-form>
</template>

<script setup>
import { reactive } from 'vue'
import createApi from './api'
import { useMessage } from 'naive-ui'

const ekpConfig = reactive({
  ekpUrl: '',
  ekpCookie: '',
  ekpDatabaseType: '',
  ekpDatabaseUrl: '',
  ekpDatabaseUsername: '',
  ekpDatabasePassword: '',
  ekpProjectApprovalTemplateId: '',
  ekpIsoApprovalTemplateId: '',
})
const api = createApi(getCurrentInstance())
const message = useMessage()
const databaseTypes = [
  {
    label: 'DB2 v11.5.0',
    value: 'DB2 v11.5.0',
    defaultUrl:
      'jdbc:db2://db.landray.com.cn:50000/ekp:driverType=4;fullyMaterializeLobData=true;fullyMaterializeInputStreams=true;progressiveStreaming=2;progresssiveLocators=2;',
  },
  {
    label: 'MySQL 5.5.x',
    value: 'MySQL 5.5.x',
    defaultUrl:
      'jdbc:mysql://db.landray.com.cn:3306/ekp?useUnicode=true&characterEncoding=UTF-8',
  },
  {
    label: 'MySQL 5',
    value: 'MySQL 5',
    defaultUrl:
      'jdbc:mysql://db.landray.com.cn:3306/ekp?useUnicode=true&characterEncoding=UTF-8',
  },
  {
    label: 'MySQL 5.7.x',
    value: 'MySQL 5.7.x',
    defaultUrl:
      'jdbc:mysql://db.landray.com.cn:3306/ekp?useUnicode=true&characterEncoding=UTF-8',
  },
  {
    label: 'MySQL 8',
    value: 'MySQL 8',
    defaultUrl:
      'jdbc:mysql://db.landray.com.cn:3306/ekp?userSSL=true&autoReconnect=true&useUnicode=true&characterEncoding=UTF8&serverTimezone=Asia/Shanghai',
  },
  {
    label: 'Oracle 9',
    value: 'Oracle 9',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'Oracle 9i',
    value: 'Oracle 9i',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'Oracle 10g',
    value: 'Oracle 10g',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'Oracle 11g',
    value: 'Oracle 11g',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'Oracle 12c',
    value: 'Oracle 12c',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'Oracle 19c',
    value: 'Oracle 19c',
    defaultUrl: 'jdbc:oracle:thin:@db.landray.com.cn:1521:ekp',
  },
  {
    label: 'SQL Server 2000',
    value: 'SQL Server 2000',
    defaultUrl: 'jdbc:jtds:sqlserver://db.landray.com.cn:1433/ekp',
  },
  {
    label: 'SQL Server 2005',
    value: 'SQL Server 2005',
    defaultUrl: 'jdbc:jtds:sqlserver://db.landray.com.cn:1433/ekp',
  },
  {
    label: 'SQL Server 2008',
    value: 'SQL Server 2008',
    defaultUrl: 'jdbc:sqlserver://db.landray.com.cn:1433;databaseName=ekp',
  },
  {
    label: 'SQL Server 2012',
    value: 'SQL Server 2012',
    defaultUrl: 'jdbc:sqlserver://db.landray.com.cn:1433;databaseName=ekp',
  },
  {
    label: 'SQL Server 2014',
    value: 'SQL Server 2014',
    defaultUrl: 'jdbc:sqlserver://db.landray.com.cn:1433;databaseName=ekp',
  },
  {
    label: 'SQL Server 2016',
    value: 'SQL Server 2016',
    defaultUrl: 'jdbc:sqlserver://db.landray.com.cn:1433;databaseName=ekp',
  },
  {
    label: 'SQL Server 2019',
    value: 'SQL Server 2019',
    defaultUrl: 'jdbc:sqlserver://db.landray.com.cn:1433;databaseName=ekp',
  },
]

api
  .init({ beanName: 'ekpConfig' })
  .then(function (response) {
    for (var key in response) {
      ekpConfig[key] = response[key]
    }
  })
  .catch(function (response) {
    message.error('failure')
  })

function changeDatabase(value, option) {
  if (option.defaultUrl) {
    ekpConfig.ekpDatabaseUrl = option.defaultUrl
  }
}

function submit() {
  message.info('后台保存信息')
  var form = {
    beanName: 'ekpConfig',
    values: ekpConfig,
  }
  //axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  api
    .commit(form)
    .then(function (response) {
      message.info('success')
    })
    .catch(function (response) {
      message.error('failure')
    })
}

function testLink() {
  message.info('测试链接')
}
</script>

<style></style>
