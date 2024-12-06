<script setup>
import * as echarts from 'echarts'
import geoJson from '@/assets/json/shandong.json'

onMounted(() => {
  initEchart()
})

let myChart = null
let timer = null
let index = 0

const initEchart = () => {
  echarts.registerMap('shandong', geoJson)
  myChart = echarts.init(document.getElementById('chartContainer'))
  // 指定图表的配置项和数据
  const option = {
    geo: [
      {
        map: 'shandong',
        zoom: 1.1,
      },
    ],
    tooltip: {
      // 窗口外框
      trigger: 'item',
    },
    series: {
      name: '山东省',
      type: 'map',
      map: 'shandong',
      showLegendSymbol: true,
      label: {
        show: true,
      },
      itemStyle: {
        borderColor: 'rgba(147,235,248,1)',
        borderWidth: 1,
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
            },
          ],
          globalCoord: false, // 缺省为 false
        },
        shadowColor: 'rgba(128, 217, 248, 1)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
      },
      emphasis: {
        // 鼠标移入动态的时候显示的默认样式
        itemStyle: {
          areaColor: '#4adcf0',
          borderColor: '#404a59',
          borderWidth: 1,
        },
        label: {
          // 文字
          show: true,
          color: '#fff',
          fontSize: 10,
        },
      },
      layoutCenter: ['50%', '50%'],
      layoutSize: '130%',
      markPoint: {
        symbol: 'none',
      },
      data: geoJson.features.map((v) => ({
        value: (Math.random() * 1000).toFixed(2),
        name: v.properties.name,
      })),
    },
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
  // 调用移动方法
  mapActive()
  myChart.on('mouseover', {}, function () {
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: index,
    })
    clearInterval(timer)
  })

  myChart.on('mouseout', {}, function () {
    mapActive()
  })
}

onBeforeUnmount(() => {
  clearInterval(timer)
})

const mapActive = () => {
  const dataLength = geoJson.features.length
  // 定时器控制高亮
  timer = setInterval(() => {
    // 取消高亮
    myChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: index,
    })
    index++
    // 当前下标高亮
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index,
    })
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: index,
    })
    if (index > dataLength) {
      index = 0
    }
  }, 3000)
}
</script>

<template>
  <div id="chartContainer" />
</template>

<style lang="scss" scoped>
#chartContainer {
  width: 80%;
  height: 500px;
  margin: 5% 10%;
}
</style>
