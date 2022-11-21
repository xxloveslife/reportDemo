import trackHtml from "./index.html";
import "./index.css";
export default class TrackFaceComponent {
  constructor(a) {
    this.html = parseDom(trackHtml);
    this.vertices = [778,122,988,122,988,344,778,344];
    this.recConfig = this.handleXYZ(this.vertices);
    this.timeSection = [9200,15800];
  }

  createEl(el, player) {
    el.appendChild(this.html);
    // 获取比例
    this.rateObj = getTrackRate(player, el);
  }

  ready(player, e) {}

  playing(player, e) {}

  timeupdate(player, timeStamp) {
    // console.log(timeStamp,'timeStamp');
    console.log(this.timeSection,timeStamp.target.currentTime);
    if(timeStamp.target.currentTime*1000>this.timeSection[0] && timeStamp.target.currentTime*1000<this.timeSection[1] ){
      this.setTrackRec(player,true);
    }else {
      this.setTrackRec(player,false);
    }
    
  }

  setTrackRec(player,b){
    // 是否全屏
    let isFullScreen = player.fullscreenService.isFullScreen;
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
      // let currentwords = 'ceshixx';
      // let modifywords = componentEl.innerText;
      if (display === "none") {
        componentEl.style.setProperty("display", "block");
      }
      if (opacity !== "1") {
        componentEl.style.setProperty("opacity", "1");
      }
      if (visibility === "hidden" || b) {
        componentEl.style.setProperty("visibility", "visible");
      }else if(!b){
        componentEl.style.setProperty("display", "none");
      }
      // if (currentwords != modifywords) {
      //   componentEl.innerText = currentwords;
      // }
      componentEl.style.width = isFullScreen
        ? `${this.recConfig.width * this.rateObj.wRate}px`
        : `${this.recConfig.width}px`;
      componentEl.style.height = isFullScreen
        ? `${this.recConfig.height * this.rateObj.hRate}px`
        : `${this.recConfig.height}px`;
      componentEl.style.border = "1px solid red";
      componentEl.style.left = `${this.recConfig.leftTopPoint.left}px`;
      componentEl.style.left = `${this.recConfig.leftTopPoint.bottom}px`
    }
  }

  handleXYZ(val = [778,122,988,122,988,344,778,344]){
    let leftTopPoint,width,height;
    if(val.length == 8){
        // 确定左上角顶点距离左下角原点 第四个顶点
      leftTopPoint = {left:val[6],bottom:val[7]};
      // x轴长度  (第二个顶点x轴 - 第一个顶点x轴)
      width=val[2]-val[0];
      // y轴长度  (第四个顶点y轴 - 第一个顶点y轴)
      height = val[7]-val[1];
    }else {
      console.error('坐标数据不正确');
    }

    return {leftTopPoint,width,height};
    
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

