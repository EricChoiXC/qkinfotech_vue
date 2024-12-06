<script setup>
const route = useRoute()
const router = useRouter()
onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  router.replace({
    path: '/' + (Array.isArray(path) ? path.join('/') : path),
    query,
  })
})
</script>


<style lang='scss' scoped>
</style>
