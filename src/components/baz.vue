<template>
  <div>
    <div style="width: 100px; border: solid 2px grey; margin-bottom: 10px">
      数据图
    </div>
    <div class="customchart" ref="hello2" style="width: 500px; height: 300px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted,ref } from "vue";
export default {
  name: "bazCompo",
  props: {
    msg: String,
  },
  setup(props) {
    const hello2 = ref(null);
    onMounted(() => {
      const myChart = echarts.init(hello2.value);
      const option = {
        dataset: [
          {
            dimensions: ["name", "age", "profession", "score", "date"],
            source: [
              ["Hannah Krause", 41, "Engineer", 314, "2011-02-12"],
              ["Zhao Qian", 20, "Teacher", 351, "2011-03-01"],
              ["Jasmin Krause ", 52, "Musician", 287, "2011-02-14"],
              ["Li Lei", 37, "Teacher", 219, "2011-02-18"],
              ["Karle Neumann", 25, "Engineer", 253, "2011-04-02"],
              ["Adrian Groß", 19, "Teacher", "-", "2011-01-16"],
              ["Mia Neumann", 71, "Engineer", 165, "2011-03-19"],
              ["Böhm Fuchs", 36, "Musician", 318, "2011-02-24"],
              ["Han Meimei", 67, "Engineer", 366, "2011-03-12"],
            ],
          },
          {
            transform: {
              type: "sort",
              config: { dimension: "score", order: "desc" },
            },
          },
        ],
        xAxis: {
          type: "category",
          axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
          type: "bar",
          encode: { x: "name", y: "score" },
          datasetIndex: 1,
        },
      };
      myChart.setOption(option);
    });

    return {hello2};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
