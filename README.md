<div align="center">
    <img width="180px" height="180px" src="./src/assets/logo.png" />
    <h1>Vue3-Vite2</h1>
    <b>Vue3 + Vite2 现代前端框架</b>
    <p>轻量/自动/工程化/开箱即用, 快的不止那么一点点~</p>
</div>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) [![nodejs](https://img.shields.io/badge/nodejs-14+-grass?logo=v-art)](https://registry.npmmirror.com/binary.html?path=node/v16.15.0/) [![vue](https://img.shields.io/badge/vue-3+-grass?logo=v-art)](https://v3.cn.vuejs.org/) [![vite](https://img.shields.io/badge/vite-2+-a652fe?logo=vite&logoColor=ffbc14)](https://cn.vitejs.dev/)

</div>

## 脚手架简介

Vue3 in Vite2+ 全新写法，让前端开发舒畅无比，一套学习 Vue3 快速上手的原型脚手架库，MIT 协议，可商业。`它快得不止那么一点点...` ^-^

> 轮子原型 **[vitesse](https://github.com/antfu/vitesse)** 。感谢 antfu 提供那么棒的插件，有兴趣的小伙伴可前往他的 [vitesse](https://github.com/antfu/vitesse) 仓库观摩

## 脚手架特性

- **最新技术栈**：使用 `Vue3`/`vite2+` 等前端前沿技术开发
- **依赖包管理**：支持 npm、pnpm、yarn, 可 gzip 压缩打包编译
- **代码规范**：eslint 命名规范、注释规范、缩进排版规范、文件名规范、声明规范
- **状态管理**：使用 Pinia，并支持持久化记忆
- **图标超集**：支持 iconify 图标库 和 iconfont 字体图标

## 工欲善其事

》必先利其器，使用 vscode 打开项目后会自动提示是否安装推荐扩展，详见 `.vscode/extensions.json` 文件

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=MisterJ.vue-volar-extention-pack)

- 特别推荐使用 Vue 3 `<script setup>` 语法糖, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## 安装(必须使用 Nodejs 14+)

> 本脚手架可用 pnpm 或 npm，具体命令自行查阅相关文档，这里使用 yarn 作为示例

```
### Nodejs >= 14.18.0
yarn
```

## 更新

```
npx npm-check-updates -u
yarn install
```

## 开发

```
yarn dev
```

## 打包(生产)

```
yarn build
```

# 更多技术栈

这里注意，目前一些国产浏览器（360 安全浏览器、搜狗浏览器、腾讯 QQ 浏览器等）集成的谷歌内核版本都较低，尽量别用这些浏览器做开发测试，涉及到较多前沿技术，建议使用谷歌浏览器开发，打包后不受此约束。

详见 `package.json`

