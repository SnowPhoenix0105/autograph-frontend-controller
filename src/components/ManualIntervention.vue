<template>
  <el-container>


    <el-aside>
      <el-row>
        <el-col
            :offset="2"
            :span="8">
          <el-input
              v-model="header.input_line"
              size="large"
              placeholder="请输入实体名"  />
        </el-col>
        <el-col
            :span="4">
          <el-input
              v-model="header.version"
              size="large"
              placeholder="请输入版本号"  />
        </el-col>
        <el-col :span="2">
          <el-button
              type="primary"
              size="large"
              @click="searchHandler" >搜索</el-button>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
      <knowledge-graph  :chartList="kg_data" @onNodeClick="tryVisit"></knowledge-graph>
    </el-aside>




    <el-main>
      <el-row class="relation-row">
        关系干预
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="1" :span="6">
          头实体
        </el-col>
        <el-col :span="6">
          关系
        </el-col>
        <el-col :span="6">
          尾实体
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="1"  :span="6">
          <el-input v-model="subject"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="predicate"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="object"></el-input>
        </el-col>
      </el-row>
      <el-row class="button-row" :gutter="20">
        <el-col :offset="7" :span="8">
          <el-button type="success" @click="handleAddSPO">
            添加SPO
          </el-button>
          <el-button type="danger" @click="handleDelSPO">
            删除SPO
          </el-button>
        </el-col>
      </el-row>
      <el-row></el-row>
      <el-row class="entity-row">
        实体干预
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="1"  :span="6">
          <el-input v-model="entity"></el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="success" @click="handleAddEntity">
            添加实体
          </el-button>
          <el-button type="danger" @click="handleDelEntity">
            删除实体
          </el-button>
        </el-col>
      </el-row>
      <el-row></el-row>
      <el-row class="submit-row">
        <el-button type="primary" @click="handleSubmit">
          提交
        </el-button>
      </el-row>



      <el-row class="res-title-row">
        添加实体
      </el-row>
      <el-row>
        {{add_entity_str}}
      </el-row>
      <el-row class="res-title-row">
        删除实体
      </el-row>
      <el-row>
        {{del_entity_str}}
      </el-row>
      <el-row class="res-title-row">
        添加关系
      </el-row>
      <el-row>
        {{add_relation_str}}
      </el-row>
      <el-row class="res-title-row">
        删除关系
      </el-row>
      <el-row>
        {{del_relation_str}}
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {ElMessage} from "element-plus";
import KnowledgeGraph from "@/components/KnowledgeGraph";

export default {
  name: "ManualIntervention",
  components: {KnowledgeGraph},
  data() {
    return {
      header: {
        input_line:"",
        version: "",
      },
      kg_data: {},
      entity: "",
      subject: "",
      predicate: "",
      object: "",
      add_relation: [],
      del_relation: [],
      add_entity: [],
      del_entity: [],
    }
  },
  computed: {
    add_entity_str() {
      if (!this.add_entity.length) {
        return "_"
      }
      return this.add_entity.join('、')
    },
    del_entity_str() {
      if (!this.del_entity.length) {
        return "_"
      }
      return this.del_entity.join('、')
    },
    add_relation_str() {
      if (!this.add_relation.length) {
        return "_"
      }

      return this.add_relation.map(this.spoToStr).join('、')
    },
    del_relation_str() {
      if (!this.del_relation.length) {
        return "_"
      }

      return this.del_relation.map(this.spoToStr).join('、')
    },
  },
  methods: {

    async tryVisit(nodeName) {
      let url = this.$controllServ + "/admin/search?q=" + encodeURI(nodeName)
      if (this.header.version) {
        url += "&v=" + this.header.version
      }

      let res = await this.$axios.get(url)

      if (res.status !== 200) {
        console.warn(res)
        return
      }

      // console.dir(res.data)

      if (res.data.code !== 0) {
        console.warn(res.data.message)
        return
      }

      if (!res.data.data.graph.nodes) {
        ElMessage.warning("无搜索结果")
        return
      }

      this.kg_data = res.data.data
    },

    async searchHandler() {
      const query = this.header.input_line
      // console.log("query=", query)
      await this.tryVisit(query)
    },


    spoToStr(spo) {
      return spo.subject + "-" + spo.predicate + "->" + spo.object
    },
    flushSPO() {
      if (!this.subject || !this.predicate || !this.object) {
        ElMessage.error("头实体、尾实体、关系类型必须都不为空")
        return null
      }

      const record = {
        subject: this.subject,
        predicate: this.predicate,
        object: this.object,
      }
      this.subject = ""
      this.predicate = ""
      this.object = ""

      return record
    },
    flushEntity() {
      if (!this.entity) {
        ElMessage.error("实体不能为空")
        return null
      }

      const ret = this.entity
      this.entity = ""
      return ret
    },
    handleAddSPO() {
      const record = this.flushSPO()
      if (!record) {
        return
      }
      this.add_relation.push(record)
      console.dir(this.add_relation)
    },
    handleDelSPO() {
      const record = this.flushSPO()
      if (!record) {
        return
      }
      this.del_relation.push(record)
      console.dir(this.del_relation)
    },
    handleAddEntity() {
      const record = this.flushEntity()
      if (!record) {
        return
      }
      this.add_entity.push(record)
      console.dir(this.add_entity)
    },
    handleDelEntity() {
      const record = this.flushEntity()
      if (!record) {
        return
      }
      this.del_entity.push(record)
      console.dir(this.del_entity)
    },
    async handleSubmit() {
      if (!this.add_entity.length && !this.del_entity.length && !this.add_relation.length && !this.del_relation.length) {
        ElMessage.warning("干预失败，无数据")
        return
      }

      const req = {
        add_entity: this.add_entity,
        del_entity: this.del_entity,
        add_relation: this.add_relation,
        del_relation: this.del_relation,
      }

      const resp = await this.$axios.post(this.$controllServ + "/admin/intervention", req)

      console.dir(resp)

      if (resp.data.code !== 0) {
        ElMessage.error("请求错误")
        console.error(resp.data.message)
        return
      }

      const res = resp.data.data
      if (!res.extractor_name) {
        ElMessage.info("干预失败，无数据")
        return
      }
      ElMessage.info("干预成功，图层为" + res.extractor_name)
      this.add_entity = []
      this.del_entity = []
      this.add_relation = []
      this.del_relation = []
    }
  }
}
</script>

<style scoped>
.relation-row {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 40px;
}
.entity-row {
  margin-top: 60px;
  margin-bottom: 20px;
  font-size: 40px;
}
.button-row {
  margin-top: 20px;
}
.submit-row {
  margin-top: 60px;
}
.el-aside {
  width: 1000px;
}
.res-title-row {
  margin-top: 40px;
}
.el-main {
  background-color: azure;
  height: calc(100vh - 100px);
}
</style>