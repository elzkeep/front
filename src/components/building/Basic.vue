q<template>
  <y-table>
    <y-tr>
      <y-th style="width: 200px">수전설비 설치여부</y-th>
      <y-td>
        <el-switch v-model="data.item.value1" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>수전용량</y-th>
      <y-td> <el-input v-model="data.item.value2" style="width: 100px" /> kW </y-td>
    </y-tr>
    <y-tr>
      <y-th>수전형태</y-th>
      <y-td>
        <el-radio-group v-model="data.item.value3">
          <el-radio-button size="small" value="1">저압</el-radio-button>
          <el-radio-button size="small" value="2">특고압</el-radio-button>
        </el-radio-group>
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>수전위치</y-th>
      <y-td style="display: flex; border: none !important; gap: 10px">
        <el-select v-model="data.item.value4" placeholder="" style="width: 150px">
          <el-option v-for="item in data.positions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.item.value5" v-if="data.item.value4 == '7'" />
      </y-td>
    </y-tr>
  </y-table>

  <Title title="수배전설비" />

  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th style="width: 33%">수전 전압</y-th>
      <y-th style="width: 33%">형태</y-th>
      <y-th style="width: 33%">면수</y-th>
    </y-tr>
    <y-tr>
      <y-td>
        <el-select v-model="data.item.value6" placeholder="" style="width: 150px">
          <el-option v-for="item in data.volts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.item.value7" style="margin-left: 5px; width: 100px" v-if="data.item.value6 == '3'" />
      </y-td>
      <y-td>
        <el-select v-model="data.item.value8" placeholder="" style="width: 150px">
          <el-option v-for="item in data.faucets" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </y-td>

      <y-td>
        <el-select v-model="data.item.value9" placeholder="" style="width: 150px">
          <el-option v-for="item in data.sides" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-input v-model="data.item.value10" style="margin-left: 5px; width: 100px" v-if="data.item.value9 == '13'" />
      </y-td>
    </y-tr>
  </y-table>

  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th style="width: 33%">배전 전압</y-th>
      <y-th style="width: 33%">형태</y-th>
      <y-th style="width: 33%">면수</y-th>
      <y-th style="width: 30px"></y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <el-select v-model="data.items[index].value1" placeholder="" style="width: 150px" @change="changeVolt">
          <el-option v-for="item in data.volts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.items[index].value2" style="margin-left: 5px; width: 100px" v-if="data.items[index].value1 == '3'" />
      </y-td>
      <y-td>
        <el-select v-model="data.items[index].value3" placeholder="" style="width: 150px">
          <el-option v-for="item in data.supplys" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </y-td>
      <y-td>
        <el-select v-model="data.items[index].value4" placeholder="" style="width: 150px">
          <el-option v-for="item in data.sides" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.items[index].value5" style="margin-left: 5px; width: 100px" v-if="data.items[index].value4 == '13'" />
      </y-td>
      <y-td style="text-align: center">
        <el-button v-if="index == 0" size="small" class="filter-item" type="primary" @click="clickAdd"
          ><el-icon><Plus /></el-icon
        ></el-button>
        <el-button v-if="index != 0" size="small" class="filter-item" type="danger" @click="clickDelete(index)"
          ><el-icon><Close /></el-icon
        ></el-button>
      </y-td>
    </y-tr>
  </y-table>

  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th style="width: 200px">제조사</y-th>
      <y-td>
        <el-input v-model="data.item.value11" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>설치년월</y-th>
      <y-td>
        <el-input v-model="data.item.value12" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>단선결선도</y-th>
      <y-td>
        <el-upload class="file-uploader" :action="data.upload" :show-file-list="false" :on-success="handleFileSuccess" :auto-upload="true">
          <img v-if="imageUrl" :src="imageUrl" class="file" />
          <el-icon v-else class="file-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </y-td>
    </y-tr>
  </y-table>

  <Title title="변전설비" />

  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th>설비명</y-th>
      <y-th>형식</y-th>
      <y-th>정격용량</y-th>
      <y-th>%Z</y-th>
      <y-th>정격전압</y-th>
      <y-th>제조사</y-th>
      <y-th>제조번호</y-th>
      <y-th>제작년월</y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.transs">
      <y-td>
        <el-input v-model="data.transs[index].name" style="width: 150px" />
      </y-td>
      <y-td>
        <el-select v-model="data.transs[index].value2" placeholder="" style="width: 80px">
          <el-option v-for="item in data.forms" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </y-td>
      <y-td> <el-input v-model="data.transs[index].value3" style="width: 50px" /> kVA </y-td>
      <y-td> <el-input v-model="data.transs[index].value4" style="width: 50px" /> % </y-td>
      <y-td> <el-input v-model="data.transs[index].value5" style="width: 50px" /> V </y-td>
      <y-td>
        <el-input v-model="data.transs[index].value6" style="width: 100px" />
      </y-td>
      <y-td>
        <el-input v-model="data.transs[index].value7" style="width: 100px" />
      </y-td>
      <y-td> <el-input v-model="data.transs[index].value8" style="width: 50px" /> 년 <el-input v-model="data.transs[index].value9" style="width: 30px" /> 월 </y-td>
      <y-td style="text-align: center">
        <el-button v-if="index == 0" size="small" class="filter-item" type="primary" @click="clickAddTrans"
          ><el-icon><Plus /></el-icon
        ></el-button>
        <el-button v-if="index != 0" size="small" class="filter-item" type="danger" @click="clickDeleteTrans(index)"
          ><el-icon><Close /></el-icon
        ></el-button>
      </y-td>
    </y-tr>
  </y-table>

  <Title title="고압차단기" v-if="data.item.value3 == '2'" />

  <y-table style="margin-top: 10px" v-if="data.item.value3 == '2'">
    <y-tr>
      <y-th>설치장소</y-th>
      <y-th>차단기명</y-th>
      <y-th>차단용량</y-th>
      <y-th>정격전압</y-th>
      <y-th>전류</y-th>
      <y-th>제조사</y-th>
      <y-th>제조번호</y-th>
      <y-th>제작년월</y-th>
      <y-th>계전기</y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.highs">
      <y-td>
        <el-input v-model="data.highs[index].value1" style="width: 150px" />
      </y-td>
      <y-td>
        <el-select v-model="data.highs[index].value2" placeholder="" style="width: 80px">
          <el-option v-for="item in data.names" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </y-td>
      <y-td> <el-input v-model="data.highs[index].value3" style="width: 50px" /> kA </y-td>
      <y-td> <el-input v-model="data.highs[index].value4" style="width: 50px" /> kV </y-td>
      <y-td> <el-input v-model="data.highs[index].value5" style="width: 50px" /> A </y-td>
      <y-td>
        <el-input v-model="data.highs[index].value6" style="width: 100px" />
      </y-td>
      <y-td>
        <el-input v-model="data.highs[index].value7" style="width: 100px" />
      </y-td>
      <y-td> <el-input v-model="data.highs[index].value8" style="width: 50px" /> 년 <el-input v-model="data.highs[index].value9" style="width: 30px" /> 월 </y-td>

      <y-td>
        <y-table>
          <y-tr>
            <y-th>계전기명</y-th>
            <y-th>제조사</y-th>
            <y-th>제작년도</y-th>
            <y-th>형식</y-th>
            <y-th>계전기번호</y-th>
            <y-th>설치장소</y-th>
            <y-th>연결기기</y-th>
            <y-th></y-th>
          </y-tr>
          <y-tr v-for="(item2, index2) in data.highs[index].content">
            <y-td>
              <el-input v-model="data.highs[index].content[index2].value1" style="width: 150px" />
            </y-td>
            <y-td>
              <el-select v-model="data.highs[index].content[index2].value2" placeholder="" style="width: 80px">
                <el-option v-for="item in data.relaynames" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </y-td>
            <y-td>
              <el-input v-model="data.highs[index].content[index2].value3" />
            </y-td>
            <y-td>
              <el-input v-model="data.highs[index].content[index2].value4" />
            </y-td>
            <y-td>
              <el-input v-model="data.highs[index].content[index2].value5" />
            </y-td>
            <y-td>
              <el-input v-model="data.highs[index].content[index2].value6" />
            </y-td>

            <y-td>
              <el-select v-model="data.highs[index].content[index2].value7" placeholder="" style="width: 80px">
                <el-option v-for="item in data.transs" :key="item.value1" :label="item.value1" :value="item.value1" />
              </el-select>
            </y-td>

            <y-td style="text-align: center">
              <el-button v-if="index2 == 0" size="small" class="filter-item" type="primary" @click="clickAddRelay(index)"
                ><el-icon><Plus /></el-icon
              ></el-button>
              <el-button v-if="index2 != 0" size="small" class="filter-item" type="danger" @click="clickDeleteRelay(index, index2)"
                ><el-icon><Close /></el-icon
              ></el-button>
            </y-td>
          </y-tr>
        </y-table>
      </y-td>

      <y-td style="text-align: center">
        <el-button v-if="index == 0" size="small" class="filter-item" type="primary" @click="clickAddHigh"
          ><el-icon><Plus /></el-icon
        ></el-button>
        <el-button v-if="index != 0" size="small" class="filter-item" type="danger" @click="clickDeleteHigh(index)"
          ><el-icon><Close /></el-icon
        ></el-button>
      </y-td>
    </y-tr>
  </y-table>

  <div style="margin-top: 10px; text-align: left">
    <el-button class="filter-item" type="success" @click="clickSubmit">저장</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Company, Facility, Building } from "~/models"
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'

const props = defineProps({
  id: Number,
});

const { width, height } = size();

const store = useStore();
const route = useRoute();

const model = Facility;

const item = {
  id: 0,
  value1: "",
  value2: "",
  value3: "",
  value4: "",
  value5: "",
  value6: "",
  value7: "",
  value8: "",
  value9: "",
  value10: "",
  building: 0,
};

const data = reactive({
  id: 0,
  item: util.clone(item),
  positions: [
    { id: "0", name: " " },
    { id: "1", name: "지하" },
    { id: "2", name: "단독/옥내" },
    { id: "3", name: "옥상" },
    { id: "4", name: "옥외" },
    { id: "5", name: "복도/계단" },
    { id: "6", name: "현관" },
    { id: "7", name: "직접입력" },
  ],
  volts: [
    { id: "0", name: " " },
    { id: "1", name: "[저압] 380/220" },
    { id: "2", name: "[특고압] 22,900" },
    { id: "3", name: "직접입력" },
  ],
  faucets: [
    { id: "0", name: " " },
    { id: "1", name: "일반형" },
    { id: "2", name: "일체형" },
  ],
  supplys: [
    { id: "0", name: " " },
    { id: "1", name: "매입형" },
    { id: "2", name: "노출형" },
  ],
  sides: [
    { id: "0", name: " " },
    { id: "1", name: "1~5" },
    { id: "2", name: "6~10" },
    { id: "3", name: "11~20" },
    { id: "4", name: "21~30" },
    { id: "5", name: "31~40" },
    { id: "6", name: "41~50" },
    { id: "7", name: "51~60" },
    { id: "8", name: "61~70" },
    { id: "9", name: "71~80" },
    { id: "10", name: "81~90" },
    { id: "11", name: "91~100" },
    { id: "12", name: "100초과" },
    { id: "13", name: "직접입력" },
  ],
  names: [
    { id: "0", name: " " },
    { id: "1", name: "VCB" },
    { id: "2", name: "GCV" },
  ],
  relaynames: [
    { id: "0", name: " " },
    { id: "1", name: "OCR" },
    { id: "2", name: "OCGR" },
    { id: "3", name: "UVR" },
    { id: "4", name: "OVR" },
    { id: "5", name: "POR" },
    { id: "6", name: "디지털" },
  ],
  forms: [
    { id: "0", name: " " },
    { id: "1", name: "유입형" },
    { id: "2", name: "몰드형" },
  ],
  items: [],
  highs: [],
  transs: [],
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`,
});

async function initData() {}

async function getItems() {
  let res = await model.find({
    building: data.id,
    category: 10,
    orderby: "f_id",
  });

  if (res.items.length > 0) {
    data.item = res.items[0];
  }

  res = await model.find({
    building: data.id,
    category: 11,
    orderby: "f_id",
  });

  data.items = res.items;

  if (data.items.length == 0) {
    data.items.push(util.clone(item));
  }

  res = await model.find({
    building: data.id,
    category: 12,
    orderby: "f_id",
  });

  data.transs = res.items;

  if (data.transs.length == 0) {
    let item2 = util.clone(item);
    item2.name = "TR1";
    data.transs.push(item2);
  }

  res = await model.find({
    building: data.id,
    category: 13,
    orderby: "f_id",
  });

  data.highs = res.items;

  if (data.highs.length == 0) {
    let item2 = util.clone(item);

    item2.content = [util.clone(item)];

    data.highs.push(item2);
  } else {
    for (let i = 0; i < data.highs.length; i++) {
      data.highs[i].content = JSON.parse(data.highs[i].content);
    }
  }
}

onMounted(async () => {
  data.id = util.getInt(route.params.id);

  util.loading(true);

  await initData();
  await getItems();

  util.loading(false);
});

function clickAdd() {
  data.items.push(util.clone(item));
}

function clickDelete(pos) {
  let items = util.clone(data.items);

  items.splice(pos, 1);
  data.items = items;
}

function changeVolt(item) {}

function makeData(item) {
  for (let i = 1; i <= 10; i++) {
    const name = `value${i}`;
    item[name] = "" + item[name];
  }

  return item;
}
async function clickSubmit() {
  util.loading(true);

  let item = makeData(util.clone(data.item));
  item.building = data.id;
  item.category = 10;

  if (item.id > 0) {
    await model.update(item);
  } else {
    await model.insert(item);
  }

  await model.deleteByBuildingCategory(data.id, 11);

  for (let i = 0; i < data.items.length; i++) {
    let item = makeData(util.clone(data.items[i]));
    item.building = data.id;
    item.category = 11;

    await model.insert(item);
  }

  await model.deleteByBuildingCategory(data.id, 12);

  for (let i = 0; i < data.transs.length; i++) {
    let item = makeData(util.clone(data.transs[i]));
    item.building = data.id;
    item.category = 12;

    await model.insert(item);
  }

  await model.deleteByBuildingCategory(data.id, 13);

  for (let i = 0; i < data.highs.length; i++) {
    let item = makeData(util.clone(data.highs[i]));
    item.building = data.id;
    item.category = 13;

    item.content = JSON.stringify(item.content);

    await model.insert(item);
  }

  await Extra.score(data.id);  
  
  util.alert('저장되었습니다')
  
  util.loading(false)  
}

const imageUrl = ref("");

const handleFileSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  
  console.log(response.filename);
  console.log(response.originalfilename);
  data.filename = response.filename;
  data.originalfilename = response.originalfilename;
};

const beforeFileUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type !== "image/jpeg") {
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    return false;
  }
  return true;
};

function clickAddHigh() {
  data.highs.push(util.clone(item));
}

function clickDeleteHigh(pos) {
  let items = util.clone(data.highs);

  items.splice(pos, 1);
  data.highs = items;
}

function clickAddTrans() {
  const regex = /TR[0-9]+/;
  let pos = 1;
  for (let i = 0; i < data.transs.length; i++) {
    let item2 = data.transs[i];
    if (regex.test(item2.name)) {
      item2.name = `TR${pos}`;
      pos++;
    }
  }

  let item2 = util.clone(item);
  item2.name = `TR${pos}`;
  data.transs.push(item2);
}

function clickDeleteTrans(pos) {
  let items = util.clone(data.transs);

  items.splice(pos, 1);

  const regex = /TR[0-9]+/;
  let num = 1;
  for (let i = 0; i < items.length; i++) {
    let item2 = items[i];
    if (regex.test(item2.name)) {
      item2.name = `TR${num}`;
      num++;
    }
  }

  data.transs = items;
}

function clickAddRelay(index) {
  data.highs[index].content.push(util.clone(item));
}

function clickDeleteRelay(index, pos) {
  let items = util.clone(data.highs[index].content);

  items.splice(pos, 1);
  data.highs[index].content = items;
}
</script>
