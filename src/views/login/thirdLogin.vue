<template>
  <n-space justify="center">
    <n-card size="huge">
      {{ message }}
    </n-card>
  </n-space>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import createApi from './api'
import storage from '@/utils/storage.js'
import CryptoJS from 'crypto-js'
import TipLabel from '@/views/login/TipLabel.vue'
import { sleep } from 'seemly'
import context from '@/context.js'

import baseUrl from '@/utils/baseUrl'
import cookie from "@/utils/cookie";

export default {
  setup() {
    const api = createApi(getCurrentInstance())
    const router = useRouter()
    const message = ref('登陆中。。。')

    onMounted(() => {
      context.logout()
      var str = window.location.search.replace('?', '')
      var json = {
        str : str
      }
      api
        .oaResponse(json)
        .then(function (res) {
          if (res.s) {
            var data = res
            var nowTime = new Date()
            if (nowTime - data.t > 1000*60*5) {
              message.value = "链接超时。"
              return
            }
            if (
              context.user() == data.s &&
              storage.get('LRToken') != undefined
            ) {
              console.log("window.open:" + data.u)
              window.open(data.u, '_self')
            } else {
              var combined = data.s
              const key = '12345678' // DES需要8字节的密钥
              const iv = '1234567890ABCDEF' // 与Java中的IV_PARAMETERR对应
              const encrypted = encrypt(combined, key, iv)
              const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;


              api
                .singleLogin({
                  desStr: encrypted,
                  id: data.s,
                })
                .then(function (res2) {
                  var response = res2
                  if (response.success) {
                    var LRToken = JSON.parse(response.LRToken)
                    storage.set('LRToken', LRToken.tokenString)

                    var d = new Date()
                    d.setHours(d.getHours() + 12)
                    if (ipRegex.test(window.location.hostname)) {
                      /*document.cookie =
                        'LRToken=' + LRToken.tokenString + '; path=/'
                      document.cookie = 'id=' + response.id + '; path=/'
                      document.cookie = 'username=' + response.username + '; path=/'*/
                      cookie.set("LRToken", LRToken.tokenString, "/", d)
                      cookie.set("id", response.id, "/")
                      cookie.set("username", response.username, "/")
                    } else {
                      /*document.cookie =
                        'LRToken=' + LRToken.tokenString + '; path=/; domain=' + window.location.hostname.replace(window.location.hostname.split(".")[0], "")
                      document.cookie = 'id=' + response.id + '; path=/; domain=' + window.location.hostname.replace(window.location.hostname.split(".")[0], "")
                      document.cookie = 'username=' + response.username + '; path=/; domain=' + window.location.hostname.replace(window.location.hostname.split(".")[0], "")*/
                      cookie.set("LRToken", LRToken.tokenString, "/", d, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
                      cookie.set("id", response.id, "/", null, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
                      cookie.set("username", response.username, "/", null, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
                    }

                    api.userControllerLoadUserAuths().then(function (res3) {
                      if (res3.result) {
                        storage.set('auths', res3.auths)
                      }
                      window.open(data.u, '_self')
                    })
                  } else {
                    message.value = res.msg
                  }
                })
            }
          } else {
            message.value = "单点错误"
            console.log(response.msg)
          }
        })
        .catch(function () {
          console.log('error')
          message.value = '单点错误'
        })
    })

    // DES加密函数
    function encrypt(text, key, iv) {
      const keyHex = CryptoJS.enc.Utf8.parse(key)
      const ivHex = CryptoJS.enc.Hex.parse(iv)

      const encrypted = CryptoJS.DES.encrypt(text, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      })
      return encrypted.toString()
    }

    return {
      message,
      router,
      encrypt,
    }
  },
}
</script>

<style></style>
