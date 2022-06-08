<template>
  <el-container>
    <el-main>
      <div v-for="version in version_list" :key="version.id">
        <el-row>
          <div v-if="version.id === current_version">
            <el-button class="version-button"  type="primary" @click="handleButton(version.id)">
              {{version.time_str}}
              <br/>
              {{version.desc}}
            </el-button>
          </div>
          <div v-else>
            <el-button class="version-button" @click="handleButton(version.id)">
              {{version.time_str}}
              <br/>
              {{version.desc}}
            </el-button>
          </div>
        </el-row>
      </div>

    </el-main>
    <el-aside>
      <el-row class="title-row">
        <el-col :offset="1" span="17">
          版本构建
        </el-col>
      </el-row>

      <el-row>
        <el-col
            :offset="2"
            :span="8">
          <el-input
              v-model="desc"
              size="large"
              placeholder="请输入版本描述"  />
        </el-col>
        <el-col :span="2">
          <el-button
              type="primary"
              size="large"
              @click="handleBuild" >构建</el-button>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>

      <div v-for="extractor in extractor_list"  :key="extractor.id">
        <el-row>
          <el-col :offset="2" :span="12">
            <div class="checkbox-item">
              <el-checkbox v-model="extractor.selected" size="large">
                {{extractor.name}}:
                {{extractor.desc}}
              </el-checkbox>
            </div>
          </el-col>

        </el-row>

      </div>

    </el-aside>
  </el-container>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "VersionManage",
  data() {
    return {
      extractor_list: [],
      version_list: [],
      current_version: 0,
      desc: "",
    }
  },
  async mounted() {
    let extractor_list_resp = await this.$axios.get(this.$controllServ + "/admin/listextractor")

    let extractor_list = []
    extractor_list_resp.data.forEach(function (e) {
      extractor_list.push({
        name: e.name,
        desc: e.desc,
        id: e.id,
        selected: false,
      })
    })
    this.extractor_list = extractor_list
    await this.freshVersionList()
  },
  methods: {
    async handleButton(id) {
      await this.$axios.get(this.$searchServ + "/set-version?v=" + id)
      await this.freshVersionList()
    },
    async freshVersionList() {
      let current_version_resp = await this.$axios.get(this.$searchServ + "/version")
      this.current_version = current_version_resp.data.data
      let version_list_resp = await this.$axios.get(this.$controllServ + "/admin/listversion")
      this.version_list = version_list_resp.data
      console.dir((this.version_list))
      console.log(this.current_version)
    },
    async handleBuild() {
      let extractor_list = []
      this.extractor_list.forEach(function (e) {
        if (e.selected) {
          extractor_list.push(e.id)
        }
      })

      let resp = await this.$axios.post(this.$controllServ + "/admin/build", {
        extractor_list: extractor_list,
        desc: this.desc,
      })
      if (resp.data.code !== 0) {
        ElMessage.error("构建失败")
      }
      ElMessage.info("构建成功，版本号为" + resp.data.data.version)

      await this.freshVersionList()
    }
  }
}
</script>

<style scoped>
.version-button {
  margin-top: 20px;
  width: 400px;
  height: 100px;
  font-size: 20px;
}
.title-row {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 40px;
}
.checkbox-item {
  text-align: left;
}
.el-checkbox {
  font-size: 40px;
}
.el-aside {
  width: 500px;
  color: var(--el-text-color-primary);
  background-color: #f0ffff;
  height: calc(100vh - 100px);
  text-align: center;
}
</style>