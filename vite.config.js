import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 自动导入组件
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// 自动导入hooks
import AutoImport from 'unplugin-auto-import/vite'
// import postcssPxToViewport from 'postcss-px-to-viewport'
import topLevelAwait from 'vite-plugin-top-level-await'
import babel from 'vite-plugin-babel'

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const viteEnv = loadEnv(mode, root)
  console.log(viteEnv.VITE_APP_BASE_API, '111')
  return {
    build: {
      target: 'es2015'
    },
    plugins: [
      babel(),
      vue(),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        resolvers: [NaiveUiResolver()],
        // 解决eslint报错
        eslintrc: {
          enabled: true, // Default `false` 为true时，会根据filepath生成一个eslint的配置文件, 这个文件需要引入到eslint的配置文件中,生成后配置为false，不然每次都会生成
          filepath: './.vscode/.eslintai.json',
          globalsPropValue: true, // Default `true`
        },
      }),
      topLevelAwait(),
    ],
  base:"/gzt/",
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: `${resolve(__dirname, 'src')}/`,
        },
      ],
    },
    //配置代理
    server: {
      host: '0.0.0.0',
      port: 8000,
      proxy: {
        [viteEnv.VITE_APP_BASE_API]: {
          target: `http://localhost:8000/web`,
          changeOrigin: true,
          pathRewrite: {
            ['^' + viteEnv.VITE_APP_BASE_API]: '',
          },
        },
      },
    },
    css: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          // postcssPxToViewport({
          //   unitToConvert: 'px', // 转化单位
          //   viewportWidth: 1920, // UI设计稿宽度
          //   unitPrecision: 5, // 转换后的精度 即小数点位数
          //   propList: ['*'], // 指定转换的css属性
          //   viewportUnit: 'vw', // 指定需要转换成的视窗单位
          //   fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位
          //   selectorBlackList: [], // 指定不需要转换为视窗单位的类名
          //   minPixelValue: 1, // 默认值1 小于或等于1px则不转换,
          //   mediaQuery: true, // 是否在媒体查询中转换
          //   replace: true, // 是否转换后直接更换属性值
          //   landscape: false // 是否处理横屏情况
          // })
        ],
      },
    },
  }
})
