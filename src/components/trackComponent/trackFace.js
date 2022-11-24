import trackHtml from "./index.html";
import "./index.css";
export default class TrackFaceComponent {
  // [{points:[],section:[startTime,endTime]}...]
  constructor(a) {
    // 原视频信息
    this.originalInfo = [];
    // 方向
    this.orientation = "";
    // 当前视频信息
    this.currentInfo = [];
    this.html = parseDom(trackHtml);
    this.receiveVertices = [277, 510, 394, 510, 394, 625, 277, 625];
    this.timeSection = [0, 30000];
    this.receiveData = [{verticles:[275, 200, 458, 200, 458, 374, 275, 374],section:[6600, 8900]}]
  }

  // handleTimeInSection(timePoint) {
  //   this.receiveData.length>0 && this.receiveData.forEach(item=>{
  //     if(timePoint > item.section[0] && timePoint < item.section[1]){
  //       this.receiveVertices = item.verticles;
  //       this.timeSection = item.section;
  //     }
  //   })
  // }

  getRecConfig(player, isFullScreen) {
    return this.handleVertices(
      this.receiveVertices,
      this.originalInfo
    );
  }
  // 烛龙项目视频,横向上下留黑(宽度拉满100),竖向左右留黑(高度拉满100)
  // 1.根据原始宽高,和现有视频宽高,换算所有vertices点
  // 2.计算最左边留黑部分举例视频左边的值(判断宽高,暂时按竖屏视频,左右留黑计算),将这部分值加上leftPoint的实际获取值

  handleVertices(val, videoInfos, isFullScreen = false) {
    //
    // 判断视频横竖向
    let hR, wR;
    // 页面video实际宽高
    hR = videoInfos[1] / this.currentInfo[1];
    wR = videoInfos[0] / this.currentInfo[0];

    
    let t = [];
    for (let index = 0; index < val.length / 2; index++) {
      t.push(Math.round(val[index * 2] / wR));
      t.push(Math.round(val[index * 2 + 1] / hR));
    }
    // if(isFullScreen){
    //   console.log('fullscreen .. t',t);
    // }else {
    //   console.log('not fullScreen.. t',t)
    // }

    this.currentVerticles = t;

  
    return this.handleXYZ(t);
  }

  createEl(el, player) {
    this.videoEl = [el.clientWidth, el.clientHeight];
    el.appendChild(this.html);
    // 获取比例
    this.rateObj = getTrackRate(player, el);
  }

  getOffset(isFullScreen=false) {
    let offset = "";
    if (this.orientation == "vertical") {
      if(isFullScreen){
        offset = (window.screen.width - this.currentInfo[0]) /2;
      }else {
        offset = (this.videoEl[0] - this.currentInfo[0]) / 2;
      }
    }
    return offset;
  }

  getCurrentVideoInfoAndOffSet(isFullScreen=false){
    // 当前视频信息 默认根据videoEl计算. 全屏下按全屏计算
    let refer ;
    if(!isFullScreen){
      refer = this.videoEl;
    }else{
      refer = [window.screen.width,window.screen.height]
    }
    if (this.orientation == "landscape") {
      // 横向
      const t = Math.round(
        refer[0] / (this.originalInfo[0] / this.originalInfo[1])
      );
      this.currentInfo = [refer[0], t];
    } else if (this.orientation == "vertical") {
      // 竖向
      const t = Math.round(
        refer[1] * (this.originalInfo[0] / this.originalInfo[1])
      );
      this.currentInfo = [t, refer[1]];
    }

    // 计算偏移量
    this.offset = this.getOffset(isFullScreen);
  }

  ready(player, e) {
    // 获取原视频信息
    this.originalInfo = [player.tag.videoWidth, player.tag.videoHeight];
    // 方向
    this.orientation =
      player.tag.videoWidth > player.tag.videoHeight ? "landscape" : "vertical";
    this.getCurrentVideoInfoAndOffSet();
  }

  playing(player, e) {}

  timeupdate(player, timeStamp) {
    if (
      timeStamp.target.currentTime * 1000 > this.timeSection[0] &&
      timeStamp.target.currentTime * 1000 < this.timeSection[1]
    ) {
      this.setTrackRec(player, true);
    } else {
      this.setTrackRec(player, false);
    }
  }

  setTrackRec(player, b) {
    // 是否全屏
    let isFullScreen = player.fullscreenService.isFullScreen;
    this.getCurrentVideoInfoAndOffSet(isFullScreen);
    this.recConfig = this.getRecConfig(player, isFullScreen);
    let el = player.el();
    let componentEl = el.querySelector(".track-rec");
    if (!componentEl) {
      el.appendChild(this.html);
    } else {
      if (componentEl.className !== "track-rec") {
        componentEl.className = "track-rec";
      }
      let cssStyles = getComputedStyle(componentEl);
      let display = cssStyles.getPropertyValue("display");
      let opacity = cssStyles.getPropertyValue("opacity");
      let visibility = cssStyles.getPropertyValue("visibility");

      if (display === "none") {
        componentEl.style.setProperty("display", "block");
      }
      if (opacity !== "1") {
        componentEl.style.setProperty("opacity", "1");
      }
      if (visibility === "hidden" || b) {
        componentEl.style.setProperty("visibility", "visible");
      } else if (!b) {
        componentEl.style.setProperty("display", "none");
      }

      componentEl.style.width =`${this.recConfig.width}px`;
      componentEl.style.height = `${this.recConfig.height}px`;
      componentEl.style.border = "2px solid red";
      if(isFullScreen){
        console.log('fullScreen offset',this.offset);
      }
      if (this.orientation == "vertical") {
        componentEl.style.left = `${
          this.recConfig.leftTopPoint.left + this.offset
        }px`;
      } else {
        componentEl.style.left = `${this.recConfig.leftTopPoint.left}px`;
      }

      componentEl.style.top = `${this.recConfig.leftTopPoint.top}px`;
    }
  }

  handleXYZ(val) {
    let leftTopPoint, width, height;
    if (val.length == 8) {
      //  第1个顶点
      leftTopPoint = { left: val[0], top: val[1] };
      // x轴长度  (第二个顶点x轴 - 第一个顶点x轴)
      width = val[2] - val[0];
      // y轴长度  (第四个顶点y轴 - 第一个顶点y轴)
      height = val[7] - val[1];
    } else {
      console.error("坐标数据不正确");
    }

    return { leftTopPoint, width, height };
  }
}

export function parseDom(html) {
  let ele = document.createElement("div");
  ele.innerHTML = html;
  return ele.childNodes[0];
}

function computedRec(priHeight, priWidth) {
  // 获取设备全屏下的高度;
  const docHeight = window.screen.height;
  const docWidth = window.screen.width;
  return {
    hRate: Math.round(docHeight / priHeight),
    wRate: Math.round(docWidth / priWidth),
  };
}

function getTrackRate(player, el) {
  const priHeight = player.getOptions().height.replace("px", "");
  // 获取视频宽度
  const priWidth = el.clientWidth;
  // const priWidth = player.getOptions().width.replace("px", "");

  return computedRec(priHeight, priWidth);
}
