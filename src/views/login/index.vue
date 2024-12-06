<script setup>
import CryptoJS from 'crypto-js'
import storage from '@/utils/storage.js'
import TipLabel from '@/views/login/TipLabel.vue'
import createApi from './api'
import { sleep } from 'seemly'
import baseUrl from '@/utils/baseUrl'

import layoutLoader from '@/router/loader.js'
import cookie from '@/utils/cookie'
import context from '@/context.js'

import { useAuthStore } from '@/store/authStore'

const api = createApi(getCurrentInstance())
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginInfo = reactive({
  id: '',
  password: '',
  showTip: false,
  tipMessage: '',
  tipType: 'info',
})

if (route.query.error) {
  console.log(route.query)
  if (route.query.error == "cookieTimeout") {
    loginInfo.tipType = 'error'
    loginInfo.tipMessage = "过期登出"
    loginInfo.showTip = true
  }
}

function setCookie(name, value, days) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

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

const login = async () => {
  context.logout()
  loading.value = true
  if (!loginInfo.id || !loginInfo.id.length || !loginInfo.password || !loginInfo.password.length) {
    loading.value = false
    loginInfo.tipType = 'error'
    loginInfo.tipMessage = '请输入账号密码'
    loginInfo.showTip = true
    return
  }
  try {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    api
      .doLogin({
        loginName: loginInfo.id,
        password: loginInfo.password,
      })
      .then((response) => {
        loading.value = false
        if (response.success) {

          var d = new Date()
          d.setHours(d.getHours() + 12)

          if (ipRegex.test(window.location.hostname)) {
            cookie.set("LRToken", response.id, "/", d)
            cookie.set("id", response.id, "/", d)
            cookie.set("username", loginInfo.id, "/", d)
          } else {
            cookie.set("LRToken", response.id, "/", d, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
            cookie.set("id", response.id, "/", d, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
            cookie.set("username", loginInfo.id, "/", d, window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
          }
          api.userControllerLoadUserAuths().then(async function (res) {
            if (res.result) {
              storage.set('auths', res.auths)
              authStore.addAuth(response.id, res.auths)
            }
            loginInfo.tipType = 'info'
            loginInfo.tipMessage = '登入成功'
            loginInfo.showTip = true
            storage.set('mainContentList', [])
            //加载路由
            await layoutLoader(router)

            if (!route.redirectedFrom) {
              router.push('/opdesk/home/workbench')
            } else {
              router.replace(route.redirectedFrom)
            }
          })
        } else {
          loginInfo.tipType = 'error'
          loginInfo.tipMessage = response.error
            ? response.error + ':' + response.msg
            : response.msg
          loginInfo.showTip = true
        }
      }).catch((error) => {
      console.log(error)
      loading.value = false
      loginInfo.tipType = 'error'
      loginInfo.tipMessage = error
      loginInfo.showTip = true
    })
  } catch (e) {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <section class="login-form">
      <div class="form-item">
        <input
          v-model="loginInfo.id"
          type="text"
          required
          @keyup.enter="login"
        />
        <label for="">账号</label>
      </div>
      <div class="form-item">
        <input
          v-model="loginInfo.password"
          type="password"
          required
          @keyup.enter="login"
        />
        <label for="">密码</label>
      </div>
      <n-button
        strong
        secondary
        color="#fff"
        size="large"
        @click="login"
        :loading="loading"
        :disabled="loading"
      >
        登入
      </n-button>
      <TipLabel
        v-if="loginInfo.showTip"
        :message="loginInfo.tipMessage"
        :type="loginInfo.tipType"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
      45deg,
      rgba(254, 172, 94, 0.5),
      rgba(199, 121, 208, 0.5),
      rgba(75, 192, 200, 0.5)
  );

  .login-form {
    width: 450px;
    height: 260px;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;

    .form-item {
      height: 80px;
      width: 80%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      position: relative;

      &::after {
        content: ' ';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #728fce;
        transition: all 0.5s;
      }

      > input {
        width: 100%;
        height: 30px;
        border-width: 0 0 2px 0;
        border-color: #fff;
        background-color: transparent;

        &:focus {
          outline: none;
        }
      }

      > label {
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fff;
        font-size: 18px;
        transition: all 0.3s;
      }

      // 选中后显示底部条
      &:focus-within {
        &::after {
          width: 100%;
        }
      }

      // 选中后或填写后上移30px, 是否填写利用input[required]属性，可以用valid选中
      &:focus-within label,
      input:valid ~ label {
        transform: translateY(-30px);
        font-size: 14px;
        color: #728fce;
      }
    }
  }

  .n-button {
    margin-top: 25px;
    width: 70%;
    background-color: #728fce;
  }
}
</style>
