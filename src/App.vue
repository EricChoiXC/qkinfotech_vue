<script setup>
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NLoadingBarProvider,
} from 'naive-ui'

import { zhCN, dateZhCN } from 'naive-ui'

</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </NConfigProvider>
</template>

<style lang="scss">
.n-config-provider {
  height: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
</style>

