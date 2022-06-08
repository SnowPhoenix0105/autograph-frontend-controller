<template>
  <el-row>
    <el-col :span="24">
      <div id="container">
        <div style="width: 100%; height: 100%" ref="chart"></div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "KnowledgeGraph",
  props: {
    chartList: {
      type: Object,
      required: true,
    },
  },
  emits: [
    "onNodeClick"
  ],
  watch: {
    chartList: {
      handler(val) {
        this.draw(val || null, true);
      },
    },
  },
  data() {
    return {
      myChart: "",
      colors: ["#a3d2ca", "#056676", "#ea2c62", "#16a596", "#03c4a1", "#f5a25d",
        "#8CD282", "#32e0c4", "#00FAE1", "#f05454"],
    };
  },
  methods: {
    /**
     * 节点点击事件
     */
    async nodeClick(params) {
      // console.dir(params)
      this.$emit("onNodeClick", params.data.name)
    },
    /**
     * 设置this.$echarts配置项,重绘画布
     */
    draw(data) {
      let graph = data.graph
      let query = data.query

      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.chart);
        this.myChart.on("click", (params) => {
          if (params.dataType === "node") {
            //判断点击的是图表的节点部分
            this.nodeClick(params);
          }
        });
      }
      if (!graph) {
        return
      }
      // 指定图表的配置项和数据
      graph.nodes.forEach(function (node) {
        if (node.name === query) {
          node.symbolSize = 150
          node.x = 0
          node.y = 0
        } else {
          node.symbolSize = 100;
          node.x = Math.random() * 400 - 200
          node.y = Math.random() * 400 - 200
        }

        const r = Math.floor(Math.random() * 255)
        const g = Math.floor(Math.random() * 255)
        const b = Math.floor(Math.random() * 255)
        const color = 'rgba('+ r +','+ g +','+ b +',1)'

        node.itemStyle = {
          color: color
        }
        node.category = 0

        delete node.value
      });
      console.dir(graph)
      let option = {
        tooltip: {},
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 100,
          draggable: true,
          roam: true,
          // focusNodeAdjacency: true,
          categories: [], //graph.categories,
          data: graph.nodes,
          links: graph.links,
          edgeSymbol: ['', 'arrow'],
          edgeSymbolSize: [80, 10],
          edgeLabel: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 10
              },
              formatter: function (param) {
                return param.data.name
              }
            }
          },
          radius: 1,
          scaleLimit: {
            min: 0.1, //最小的缩放值
            max: 10, //最大的缩放值
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3
          },
          label: {
            show: true
          },
          force: {
            repulsion: 460, //节点之间的斥力因子,即值越大节点间的连线越长
            edgeLength: 80, //引力因子,值越大越往中心靠拢
          },
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },

  },
};
</script>

<style scoped>
#container {
  height: calc(100vh - 120px);
}

.chart {
  height: 100%;
}
</style>