<template>
  <div>
    <div style="width: 100px; border: solid 2px grey; margin-bottom: 10px">
      折线图
    </div>
    <div class="customchart" ref="hello1" style="width: 500px; height: 300px;display:flex;justify-content: center;" ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { onMounted,ref } from "vue";
export default {
  name: "barCompo",
  props: {
    msg: String,
  },
  setup(props) {
    const hello1 = ref(null);
    onMounted(() => {
      const myChart = echarts.init(hello1.value);
      const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    });

    return {hello1};
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
