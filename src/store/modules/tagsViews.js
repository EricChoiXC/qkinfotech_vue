import { defineStore } from 'pinia'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => {
    return {
      tagsList: []
    }
  },
  actions: {
    // 初始化标签页
    initTags(routes) {
      this.tagsList = routes
    },
    // 添加标签页
    addTag(route) {
      const isExists = this.tagsList.some(
        item => item.fullPath === route.fullPath
      )
      if (!isExists && !route.meta.hidden) this.tagsList.push(route)
    },

    // 删除标签页
    removeTag(route) {
      const index = this.tagsList.findIndex(
        item => item.fullPath === route.fullPath
      )
      this.tagsList.splice(index, 1)
    },

    // 关闭其他标签页
    removeOtherTags(route) {
      this.tagsList = this.tagsList.filter(
        item => item.fullPath === route.fullPath || item.meta.affix
      )
    },

    // 删除所有标签页
    removeAllTags() {
      console.log(this.tagsList)
      const affixRoute = this.tagsList.find(item => ((item?.meta?.affix) ? item?.meta?.affix : false))
      console.log(affixRoute, 'affix')
      this.tagsList = [affixRoute]
    }
  }
})

