<template>
  <div  >
    <div style="width:100px;border:solid 2px grey;margin-bottom: 10px;">柱状图</div>
    <div style="width:100%;display:flex;" class="customchart">
      <div ref="chart1" style="width:500px;height: 300px;"></div>
  </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted,ref } from "vue";
export default {
  name: "fooCompo",
  props: {
    msg: String,
  },
  setup(props) {
    const chart1 = ref(null);
    onMounted(() => {
      const myChart = echarts.init(chart1.value);
      const option = {
        title: {
          text: "Referer of a Website",
          subtext: "Fake Data",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    });

    return {chart1};
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
