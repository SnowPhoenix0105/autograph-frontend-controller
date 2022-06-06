<template>
  <el-row>
    <!--  上传  -->
    <el-col :span="8">
      <div class="upload-center">
        <el-upload
            class="upload-demo"
            :action="upload_url"
            multiple
            :file-list="fileList"
        >
          <el-button type="primary">上传文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              docx/txt/pptx
            </div>
          </template>
        </el-upload>
      </div>
    </el-col>


    <el-col :span="8">
    </el-col>

  </el-row>
</template>

<script>
export default {
  name: "UploadFile",
  data() {
    return {
      fileList: [],
      upload_url: this.$controllServ + "/admin/upload",
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.upload-center {
  text-align: center;
}
</style>