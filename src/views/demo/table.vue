<script setup>
const columns = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age'
  },
  {
    title: 'Address',
    key: 'address'
  }
]

const data = Array.from({ length: 46 }).map((_, index) => ({
  key: index,
  name: `King ${index}`,
  age: Math.floor((Math.random() * (5 - 2) + 2) * 10) + index,
  address: `QIN KING NO.${index}`
}))
const show = ref(true)
const list = ref([])
setTimeout(() => {
  show.value = false
  list.value = data
}, 2000)

const pagination = {
  pageSize: 10
}
</script>

<template>
  <n-spin :show="show">
    <n-data-table
      :columns="columns"
      :data="list"
      :pagination="pagination"
      :max-height="700"
    />
  </n-spin>
</template>

<style lang='scss' scoped>
</style>
