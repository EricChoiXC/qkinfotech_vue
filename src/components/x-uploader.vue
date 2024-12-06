<template>
  <n-upload ref="uploader" :default-file-list="defaultFileList" v-bind="$attrs" :show-file-list="true" @update:file-list="handleFileListChange">
    <slot></slot>
  </n-upload>
  <ul>
    <li v-for="file in fileList" style="display:flex;flex-wrap: nowrap;height:2.5em;" @mouseover="handleHover(file, true)" @mouseout="handleHover(file, false)">
      <div style="width:30px;padding-left:5px;">
        <n-icon :component="DocumentAttachOutline" size="20" depth="3"></n-icon>
      </div>
      <n-ellipsis style="flex-grow: 1; position:relative;">{{file.name}}
        <div v-if="file.status!='finished' && file.status != 'removed'" :style="progress(file)"></div>
      </n-ellipsis>
      <n-space style="flex-grow:0;" :wrap="false" :size="3" v-if="file.showToolbar">
        <n-popover v-if="canPreview(file)">
          <template #trigger>
            <n-icon :component="BookOutline" size="20"></n-icon>
          </template>
          <span>预览</span>
        </n-popover>
        <n-popover v-if="canPrint(file)">
          <template #trigger>
            <n-icon :component="PrintOutline" size="20"></n-icon>
          </template>
          <span>打印</span>
        </n-popover>
        <n-popover v-if="canDownload(file)">
          <template #trigger>
            <n-icon :component="DownloadOutline" size="20"></n-icon>
          </template>
          <span>下载</span>
        </n-popover>
        <n-popover v-if="canCancel(file)">
          <template #trigger>
            <n-icon :component="CloseCircleOutline" size="20"></n-icon>
          </template>
          <span>取消</span>
        </n-popover>
        <n-popover v-if="canPause(file)">
          <template #trigger>
            <n-icon :component="PauseCircleOutline" size="20"></n-icon>
          </template>
          <span>暂停</span>
        </n-popover>
        <n-popover v-if="canPlay(file)">
          <template #trigger>
            <n-icon :component="PlayCircleOutline" size="20"></n-icon>
          </template>
          <span>继续</span>
        </n-popover>
        <n-popover v-if="canUpdate(file)">
          <template #trigger>
            <n-icon :component="Refresh" size="20"></n-icon>
          </template>
          <span>更新</span>
        </n-popover>
        <n-popover v-if="canTracert(file)">
          <template #trigger>
            <n-icon :component="FootstepsOutline" size="20"></n-icon>
          </template>
          <span>履历</span>
        </n-popover>
        <n-popover v-if="canRemove(file)">
          <template #trigger>
            <n-icon :component="TrashBinOutline" size="20"></n-icon>
          </template>
          <span>删除</span>
        </n-popover>
      </n-space>
    </li>
  </ul>

</template>

<script setup>
  import {
    TrashBinOutline,
    DownloadOutline,
    BookOutline,
    CloseCircleOutline,
    PrintOutline,
    PauseCircleOutline,
    PlayCircleOutline,
    Refresh,
    FootstepsOutline,
    DocumentAttachOutline
  } from '@vicons/ionicons5'
  import {
    ref,
    computed
  } from 'vue';

  const props = defineProps({
    "defaultFileList": {
      default: []
    }
  });

  //const uploader = ref()

  const progress = computed(() => {
    return (file) => {
      return {
        width: file?.percentage + '%',
        position: 'absolute',
        height: '3px',
        'background-color': 'blue'
      }
    };
  })

  const canPreview = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })
  const canPrint = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })
  const canDownload = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })
  const canCancel = computed(() => {
    return (file) => {
      return file.status == 'uploading'
    };
  })
  const canPause = computed(() => {
    return (file) => {
      return file.status == 'uploading'
    };
  })
  const canPlay = computed(() => {
    return (file) => {
      return file.status == 'pending'
    };
  })
  const canUpdate = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })
  const canRemove = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })
  const canTracert = computed(() => {
    return (file) => {
      return file.status == 'finished'
    };
  })


  const fileList = ref([]);

  props.defaultFileList.forEach(function(curr, index, arr) {
    fileList.value.push(Object.assign({}, curr));
  })

  const handleHover = (file, visible) => {
    file.showToolbar = visible;
  }

  const handleFileListChange = (files) => {
    let arr = fileList.value;
    for (let i = arr.length - 1; i >= 0; --i) {
      let file = files.find((element) => {
        return element.id == arr[i].id
      });
      if (file) {
        Object.assign(arr[i], file);
      } else {
        arr.splice(i, 1);
      }
    }
    files.forEach(function(curr) {
      let file = arr.find((element) => {
        return element.id == curr.id
      });
      if (!file) {
        arr.push(Object.assign({}, element));
      }
    })

  }
</script>

<style>
</style>
