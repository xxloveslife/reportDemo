<template>
  <div class="hello">
    <div style="display: flex; margin-left: 10%">
      <div style="width: 200px; height: 800px; background-color: aqua">
        <draggable
          class="dragArea"
          :list="list"
          ghost-class="ghost"
          chosen-class="chosenClass"
          animation="300"
          @start="onStart"
          @end="onEnd"
          @update="onUpdate"
          :sort="false"
          :disabled="false"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :clone="cloneDog"
        >
          <template #item="{ element }">
            <div class="item">
              {{ element.label }}
            </div>
          </template>
        </draggable>
      </div>
      <div
        id="preDownload"
        style="
          width: 800px;
          height: 100%;
          min-height: 800px;
          border: 2px solid grey;
        "
      >
        <!-- <div v-for="(item, index) in l" :key="index" >
          <component :is="item"></component>
        </div> -->
        <div class="test-center">
          <div style="text-align: center">
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
           
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <div>div</div>
            <div>ceshi </div>
            <p style="font-size: 35px">set font-size</p>
            <p style="color: red">set font-color</p>
          </div>
        </div>
        <draggable
          class="dragArea list-group"
          :list="list2"
          group="people"
          @change="log"
          :scroll="true"
          handle=".mover"
        >
          <template #item="{ element, index }">
            <div class="item" style="position: relative">
              <!-- drag handle -->

              <!-- component delete -->
              <i
                class="mover"
                style="position: absolute; top: 30px; right: 140px"
                >move me</i
              >
              <i
                class="mover"
                style="position: absolute; top: 30px; right: 20px"
                @click="handleDelete(index)"
                >delete me</i
              >
              <component :is="element.label"></component>
            </div>
          </template>

          <!-- <template #item="{ element }">
          <div class="item">
            {{element.label}}
          </div>
        </template> -->
        </draggable>
      </div>
      <!-- <button @click="test">click me</button> -->
    </div>
    <div style="position: fixed; top: 100px; right: 400px">
      <button @click="wordExport('preDownload', '??????')">??????word</button>
      <button @click="pdfExport('preDownload', '??????')">??????pdf</button>
    </div>
  </div>
</template>

<script>
import foo from "./foo.vue";
import bar from "./bar.vue";
import baz from "./baz.vue";
import { ref } from "vue";
import draggable from "vuedraggable";
import domtoimage from "dom-to-image";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import { Print } from 'nb-fe-pdf';
export default {
  name: "HelloWorld",
  components: {
    foo,
    bar,
    baz,
    draggable,
  },
  props: {
    msg: String,
  },
  setup() {
    const list = ref([{ label: "foo" }, { label: "bar" }, { label: "baz" }]);
    const list2 = ref([]);
    const l = ref(["foo", "bar"]);

    const handleDelete = (index) => {
      list2.value.splice(index, 1);
    };

    const onStart = () => {};
    const onEnd = (e) => {};

    const cloneDog = ({ label }) => {
      return { label };
    };

    // const test = function () {
    //   l.value.push("baz");
    // };

    const wordExport = (id, fileName) => {
      let contentNode = document.getElementById(id);
      // dom??????canvas??????????????????
      let cloneContentNode = contentNode.cloneNode(true); //??????dom??????
      const imgList = contentNode.querySelectorAll(".customchart"); //???????????????????????????
      const cloneImgList = cloneContentNode.querySelectorAll(".customchart"); //???????????????????????????????????????
      const promisesTitle = Array.from(imgList).map((tit, index) => {
        return new Promise((res) => {
          domtoimage.toPng(tit).then(function (url) {
            let img = new Image();
            res();
            img.src = url;
            // ?????????clone???dom????????????
            cloneImgList[index].parentNode.insertBefore(
              img,
              cloneImgList[index]
            );
            // ????????????dom
            cloneImgList[index].parentNode.removeChild(cloneImgList[index]);
          });
        });
      });
      // ???dom?????????????????????????????????????????????????????????
      return Promise.all(promisesTitle)
        .then(() => {
          let template = `
                    <!DOCTYPE html>
                    <html lang="en">
                    ${document.head.outerHTML}
                    <body>
                    ${cloneContentNode.outerHTML}
                    </body>
                    <style>
                      .test-center{
                        display:flex;
                        text-align:center;
                      }
                    </style>
                    </html>`;
          asBlob(template).then((res) => {
            saveAs(res, `${fileName}.docx`);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    function handleGeneratePDF(id) {
      const t = new Print({
        moduleId: `#${id}`, // ???????????????id
        pageInfo: {
          defaultType: "HEADER_TYPE",
          needTpl: false,
          waterMark: false,
          // waterMarkConfig: {
          //   waterMarkContent: 'testWaterMark',
          //   waterMarkId: 'print-operate-report', //???????????????????????????id
          // },
        },
      });

      return t.deviceParams;
    }

    const pdfExport = (id, fileName) => {
      // ??????nb-pdf?????????dom
      const splitHeight = handleGeneratePDF(id).height;
      const ele = document.getElementById(id);
      html2Canvas(ele, {
        allowTaint: true,
      }).then((canvas) => {
        const PDF = new JsPDF("p", "mm", "a4"); // A4????????????
        const ctx = canvas.getContext("2d");
        const a4w = 190;
        const a4h = 277; // A4?????????210mm x 297mm??????????????????10mm????????????????????????190x277
        // eslint-disable-next-line no-mixed-operators
        // const imgHeight = Math.floor((a4h * canvas.width) / a4w); // ???A4?????????????????????????????????????????????
        const imgHeight = splitHeight;
        let renderedHeight = 0;

        while (renderedHeight < canvas.height) {
          const page = document.createElement("canvas");
          page.width = canvas.width;
          page.height = Math.min(imgHeight, canvas.height - renderedHeight); // ????????????????????????
          // ???getImageData?????????????????????????????????????????????canvas?????????
          page
            .getContext("2d")
            .putImageData(
              ctx.getImageData(
                0,
                renderedHeight,
                canvas.width,
                Math.min(imgHeight, canvas.height - renderedHeight)
              ),
              0,
              0
            );
          // ??????????????????????????????10mm??????
          // eslint-disable-next-line no-mixed-operators
          PDF.addImage(
            page.toDataURL("image/jpeg", 1.0),
            "JPEG",
            10,
            10,
            a4w,
            Math.min(a4h, (a4w * page.height) / page.width)
          );

          renderedHeight += imgHeight;
          if (renderedHeight < canvas.height) {
            PDF.addPage();
          } // ?????????????????????????????????????????????
        }
        PDF.save(`${fileName}.pdf`);
      });
    };
    return {
      l,
      // test,
      list,
      list2,
      onStart,
      onEnd,
      cloneDog,
      handleDelete,
      wordExport,
      pdfExport,
    };
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
