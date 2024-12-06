import {
  useMenuStore
} from '@/store/menu.js'
import baseUrl from '@/utils/baseUrl'

const layout = {
  open: (item, target) => {
    var cookies = document.cookie.split("; ")
    var hasLrtoken = false
    for (var idx in cookies) {
      var cookie = cookies[idx]
      if (cookie.split("=")[0] == "LRToken") {
        hasLrtoken = true
      }
    }
    if (hasLrtoken) {
      useMenuStore().addTab(item);
    } else {
      window.open(baseUrl.pmUrl + "/login?error=cookieTimeout")
    }
  },

  close: (key) => {
    useMenuStore().closeTab(key);
  },

  dialog: (component, params, callback) => {

  },

  info: () => {

  },

  warning: () => {

  },

  error: () => {

  },

  success: () => {

  },

  loading: () => {

  },

  notify:() => {

  }

}

export default layout
