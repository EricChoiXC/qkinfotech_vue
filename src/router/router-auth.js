import storage from '@/utils/storage'
import context from '@/context.js'

import request from '@/utils/request2.js'

// function createApi(currentInstance) {
//   const requestInstance = new request(currentInstance)
//   const api = {}
//   api.getAuthMenu = () => {
//     return axios
//       .post('/pm/menuController/getAuthMenu', {
//         fId: context.user(),
//       })
//       .then((result) => {
//         console.log('auth', result)
//         return result.status == 200 ? result.data : undefined
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }
//   return api
// }

// export default createApi

export async function getAuthMenu(router) {
  const requestInstance = new request(null)
  return requestInstance
    .post('/pm/menuController/getAuthMenu', {
      fId: context.user(),
    })
    .then((result) => {
      console.log('auth', result)
      return result.status == 200 ? result.data : undefined
    })
    .catch((err) => {
      console.log(err)
    })
}
