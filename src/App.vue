<template>
  <div>
    <div id="app"
         v-loading="$store.state.spinning"
         element-loading-text="加载中，请稍后..."
         element-loading-background="rgba(0, 0, 0, .6)">
      <Header-Top v-if="$route.meta.isShowHead" />
      <div :class="{'router-view':$route.meta.isShowHead}">
        <keep-alive>
          <router-view v-if='$route.meta.keepAlive'></router-view>
        </keep-alive>
        <router-view v-if='!$route.meta.keepAlive'></router-view>
      </div>
    </div>
    <el-backtop :visibility-height=120
                :right=10
                :bottom=30>
      <i class="back-top-icon"></i>
    </el-backtop>
  </div>
</template>
<script>
import HeaderTop from '@/components/header'
export default {
  components: { HeaderTop },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {
    window.addEventListener('hashchange', () => {
      const currentPath = window.location.hash.slice(1)
      if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
        location.reload()
      }
    }, false)
  },
  methods: {
  }
}
</script>
<style lang="less">
</style>
