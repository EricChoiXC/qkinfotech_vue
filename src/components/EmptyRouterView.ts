import { h, defineComponent, resolveComponent } from 'vue'
import { RouterView } from 'vue-router'

export const EmptyRouterView = defineComponent({
  name: 'EmptyRouterView',
  render: () => h(RouterView)
})
