<script setup>
import draggable from 'vuedraggable'
import workComponents from '@/components/workbench'
import shortcutsList from '@/views/shortcuts/chilrdren_list.vue';
import calendar from '@/views/shortcuts/calendar.vue';
import UserProject from '@/views/shortcuts/UserProject.vue';
import UserOverview from '@/views/shortcuts/UserOverview.vue';
import Todo from '@/views/shortcuts/Todo.vue';
import storage from "@/utils/storage";
import {
  onMounted,
  ref
} from "vue";
import SupplierPurchaseAnnouncement from '@/components/workbench/SupplierPurchaseAnnouncement.vue'
import SupplierPurchaseNotice from '@/components/workbench/SupplierPurchaseNotice.vue'
import context from '@/context.js'
;
import createApi from './api'

const api = createApi(getCurrentInstance())
const shortcutsData = ref([]);

const listData = reactive([])
const methods = {
  loadData: () => {
    api.queryUserAssembly().then((res) => {
      const {
        data
      } = res
      Object.assign(listData, data)
    })
  },
}
const events = {
  handleState: (item) => {
    //更新改变状态后的数据
    item.fState = !item.fState
    console.log('listData:', listData)
    const param = {
      "editList": listData
    }
    api.updateUserAssemblySort(param)
  },
  handleDraggableEnd: () => {
    //更新拖动后的数据
    let newDatas = [...listData]
    newDatas.forEach((item, index) => {
      item.fOrder = (index + 1).toString()
    })
    const param = {
      "editList": newDatas
    }
    api.updateUserAssemblySort(param)
    console.log('listData:', newDatas)
  },
}
// 根据名称获取组件引用
const dynamicComponents = computed(() => {
  return (AssemblyKey) => workComponents[AssemblyKey]
})
onMounted(async () => {
  methods.loadData()
  const param = {
    userId: context.user(),
  };
  const res = await api.shortcutsUserList(param);
  shortcutsData.value = res.data;
})

/* 登陆人类型 */
const userType = ref("0")
api.orgPersonLoad({fId:context.user()})
  .then(function (res) {
    userType.value = res.data.fEkpUserType
  })
</script>

<template>
  <n-scrollbar style="height:100%">
    <div style="display: flex;gap: 12px">
      <div style="display:flex; flex-direction: column; gap: 12px; flex-grow:1 ">
        <div v-if="userType == '1'">
          <UserOverview assembly-name="项目信息" data-key="UserProject"></UserOverview>
          <!-- <UserProject assembly-name="项目信息" data-key="UserProject"></UserProject> -->
        </div>
        <div v-if="userType == '3'">
          <SupplierPurchaseAnnouncement></SupplierPurchaseAnnouncement>
        </div>
        <div>
          <Todo assembly-name="待办" data-key="Todo"></Todo>
        </div>
        <div v-if="userType == '3'">
          <SupplierPurchaseNotice></SupplierPurchaseNotice>
        </div>
      </div>
      <div style="width: 30%">
        <calendar></calendar>
      </div>
    </div>

    <n-grid :cols="1" :gap="12" style="margin-top: 12px">
      <n-gi>
        <n-card style="height: 80px" size="small">
          <div style="height: 100%; overflow-y:auto">
            <div>
              <draggable :list="listData" handle=".icon-item" :force-fallback="true" chosen-class="chosenClass"
                         ghost-class="ghostClass" animation="250" :delay="10" @end="events.handleDraggableEnd"
                         :fallback-class="true" :touch-start-threshold="50" :fallback-tolerance="50">
                <template #item="{ element }">
                  <div class="icon-item" @click="events.handleState(element)">
                    <n-tag style="border: 1px solid #aaa;color: #aaa" v-if="element.fState === false">
                      <n-ellipsis style="max-width: 80px;">
                        {{ element.fAssemblyName }} <!-- 点击 变灰 隐藏 -->
                      </n-ellipsis>
                    </n-tag>

                    <n-tag type="info" v-if="element.fState">
                      <n-ellipsis style="max-width: 80px;">
                        {{ element.fAssemblyName }} <!-- 点击 变灰 隐藏 -->
                      </n-ellipsis>
                    </n-tag>
<!--                    <n-badge :value="element.fState ? '显示' : '隐藏'" :offset="[6, -6]" style="position: absolute">-->
<!--                    </n-badge>-->
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </n-card>
      </n-gi>
    </n-grid>


    <draggable :list="listData" handle=".n-card-header__extra" :force-fallback="true" chosen-class="chosenClass"
               ghost-class="ghostClass" animation="300" :fallback-class="true"
               :touch-start-threshold="50" :fallback-tolerance="50" @end="events.handleDraggableEnd"
               style="margin-top: 12px;display: grid;grid-template-columns: repeat(2, 1fr);gap: 12px;">
      <template #item="{ element }">
        <component v-if="element.fState" :is="dynamicComponents(element.fComponentKey)"
                   :AssemblyName="element.fAssemblyName" :DataKey="element.fAssemblyComponentDataKey"/>
      </template>
    </draggable>
  </n-scrollbar>
</template>

<style lang="scss" scoped>
.icon-item {
  display: inline-block;
  width: 80px;
  /* 或其他宽度 */
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  margin: 10px 0px 0px 17px;

  span {
    display: block;
  }
}

.icon-item:hover {
  background-color: #f0f0f0;
  /* 鼠标移入时的背景色 */
}

:deep(.n-card) {
  // height: 360px;
  // border-radius: 16px;
  // width: calc(50% - 40px);
  display: inline-flex;
  // box-sizing: border-box;
  // margin: 15px;

  .n-card-header {
    /* background: linear-gradient(to right, #00547f, #0078b4);
  border-radius: 16px 16px 0px 0px;*/
    // padding: 0px 0px 0px 0px;
  }

  .n-card-header,
  .n-card__footer {
    // height: 35px !important;
    // display: flex;
    // align-items: center;
  }

  .n-card-header__extra:hover {
    cursor: move;
  }

  .card-header {
    //   line-height: 30px;
    //   display: flex;
    //   align-items: center;
    //   gap: 8px;
  }

  .n-card-header {
    // background: rgb(65 112 159);
    // border-radius: 16px 16px 0px 0px;
    // padding-top: 5px;
    // padding-bottom: 5px;
    // border-bottom: 1px solid #ddd;
    //   color: black;
  }

  .n-card__content {
    //   user-select: none;
  }

  .n-card-header__main {
    // color: black;
  }

  .n-card-header__main .header-div {
  }

  .n-card__content {
    //   padding-top: 8px;
    //   padding-bottom: 0;
  }

  .n-card-header__extra {
    // color: #ffffff;
  }
}

:deep(.n-list) {
  .n-list-item {
    padding: 9px;
    height: 40px;
  }

  .n-list-item__main {
    overflow: hidden;
    white-space: nowrap;
    /* 保持文本在一行内 */
    text-overflow: ellipsis;
    /* 显示省略号 */
  }

  .n-list-item:hover {
    background-color: #277ca8;
    color: #ffffff !important;
  }

  .n-list-item:hover .cate,
  .n-list-item:hover .classic_suffix {
    color: #ffffff !important;
  }

  .n-list-item__suffix {
    flex: none !important;
  }

  .cate {
    color: #ef741c;
  }

  .classic_suffix {
    color: #9e9e9e;
  }
}
</style>
<style scoped>
.chosenClass {
  opacity: 0.5 !important;
  border: solid 1px #f16363 !important;
}

.ghostClass {
  border: solid 1px green !important;
}


.icon-item-shortcuts {
  display: inline-block;
  width: 100px;
  /* 或其他宽度 */
  box-sizing: border-box;
  padding: 5px;
  text-align: center;
  margin: 25px 0px 0px 17px;

  span {
    display: block;
  }
}

.icon-item-shortcuts:hover {
  background-color: #f0f0f0;
  /* 鼠标移入时的背景色 */
}
</style>
