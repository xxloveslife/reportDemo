<template>
  <div class="hello" style="width: 30%">
    <AliPlayerV3
      :source="defaultUrl"
      ref="VueAliplayerV3"
      :options="options"
      :height="600"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { AliPlayerV3 } from "vue-aliplayer-v3";
import TestComponent from './trackComponent/trackFace'
export default {
  name: "HelloWorld",
  components: { AliPlayerV3 },
  props: {
    msg: String,
  },
  setup() {
    const danmukuList = [
      {
        mode: 1,
        text: "test",
        stime: 1000,
        size: 25,
        color: 0xffffff,
      },
      {
        mode: 1,
        text: "test",
        stime: 2000,
        size: 25,
        color: 0xff0000,
      },
    ];
    const options = ref({
      isLive: false,
      waitingTimeout: 3000,
      language: "zh-custom", // 自定义语言包
      languageTexts: {
        // 播放器自定义提示文字
        "zh-custom": {
          Error_Play_Text: "链接失效啦",
          Error_Retry_Text: "请点击下方查看原文！",
          Play: "播放",
          Pause: "暂停",
          Auto: "自动",
          Setting: "设置",
          Volume: "音量",
          Fullscreen: "全屏",
          Exist_Fullscreen: "退出全屏",
          ExistFullScreen: "退出全屏",
          CC_Switch_To: "字幕切换到 ",
          AudioTrack_Switch_To: "音轨切换到 ",
          Subtitle: "字幕",
          AudioTrack: "音轨",
          Curent_Volume: "当前音量：",
          Quality_Change_Fail_Switch_Text: "不能播放，切换为",
          Quality_Change_Text: "正在为您切换到 ",
          Speed_Switch_To: "倍速切换到 ",
          Speed: "倍速",
          Speed_05X_Text: "0.5X",
          Speed_1X_Text: "1.0X",
          Speed_125X_Text: "1.25X",
          Speed_15X_Text: "1.5X",
          Speed_2X_Text: "2X",
          Quality: "清晰度",
        },
      },
      components: [
        {
          name: "testComponent",
          type: TestComponent,
          args: ['test'],
        },
      ],
    });

    const defaultUrl = ref("http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4");
    return { options, defaultUrl };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.test-center {
  /* background-color: red; */
  text-align: center;
}
.dragArea {
  height: 100%;
  overflow: scroll;
}
.dragArea::-webkit-scrollbar {
  display: none;
}
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

.item {
  border: solid 1px #eee;
  padding: 6px 10px;
  text-align: left;
}

.item:hover {
  /* cursor: move; */
  cursor: pointer;
}

.item + .item {
  margin-top: 10px;
}

.ghost {
  border: solid 1px rgb(19, 41, 239) !important;
}

.chosenClass {
  background-color: #eee;
  opacity: 1;
  border: solid 1px red;
}

.fallbackClass {
  background-color: aquamarine;
}
</style>
