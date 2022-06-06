<template>
  <div class="common-layout">
    <el-container>
      <el-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
          >
            <el-menu-item index="upload-files">
              上传课件
            </el-menu-item>
          </el-menu>


        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import RouterView from "vue-router/"

export default {
  name: "MainContainer",
  components: {RouterView},
  data() {
    return {
      header: {
        input_line: "",
      }
    }
  },
  methods: {
    searchHandler() {
      console.log(this.header.input_line)
    }
  }
}
</script>

<style scoped>

.el-header {
  position: relative;
  background-color: #0088ff;
  color: var(--el-text-color-primary);
  height: 70px;
}
.el-aside {
  color: var(--el-text-color-primary);
  background-color: #f0ffff;
  height: calc(100vh - 100px);
  text-align: center;
}
</style>