<template>
  <y-table>
    <y-tr>
      <y-th style="width: 100px">설비명</y-th>
      <y-td>
        <el-input v-model="data.item.name" readonly />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>설치장소</y-th>
      <y-td>
        <el-input v-model="data.item.value2" style="width: 200px" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>전압</y-th>
      <y-td>
        <div style="display: flex; justify-content: space-between">
          <div>
            <el-select size="small" v-model="data.item.value3" placeholder="" style="width: 150px">
              <el-option v-for="item in data.volts" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>

            <el-input v-model="data.item.value4" style="margin-left: 5px; width: 100px" v-if="data.item.value3 == '4'" />
          </div>

          <el-checkbox v-model="data.item.value25" label="수배전설비와 동일" size="small" />
        </div>
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>용량</y-th>
      <y-td> <el-input v-model="data.item.value5" style="width: 50px" /> kW </y-td>
    </y-tr>
        <y-tr>
      <y-th>형태</y-th>
      <y-td>
        <el-radio-group v-model="data.item.type">
          <el-radio-button size="small" value="1">저압</el-radio-button>
          <el-radio-button size="small" value="2">특고압</el-radio-button>
        </el-radio-group>
      </y-td>
        </y-tr>
  </y-table>

  <div style="display: flex; justify-content: space-between">
    <Title title="충전설비" />
    <div style="margin-top: 20px">총 {{ data.total }} kW</div>
  </div>

  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th>설치현황</y-th>
      <y-th>설치장소</y-th>
      <y-th>충전형식</y-th>
      <y-th>출력전압</y-th>
      <y-th>충전용량</y-th>
      <y-th>제조사</y-th>
      <y-th>모델명</y-th>
      <y-th>제작년월</y-th>
      <y-th style="width: 30px"></y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <el-input v-model="data.items[index].value1" style="width: 50px" @keyup="changeValue" /> kW X <el-input v-model="data.items[index].value2" style="width: 30px" @keyup="changeValue" /> 대
      </y-td>
      <y-td>
        <el-select size="small" v-model="data.items[index].value3" placeholder="" style="width: 150px">
          <el-option v-for="item in data.positions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.items[index].value4" style="margin-left: 5px; width: 100px" v-if="data.items[index].value3 == '3'" />
      </y-td>
      <y-td>
        <el-select size="small" v-model="data.items[index].value4" placeholder="" style="width: 150px">
          <el-option v-for="item in data.types" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </y-td>
      <y-td> <el-input v-model="data.items[index].value5" style="width: 100px" /> V </y-td>
      <y-td> <el-input v-model="data.items[index].value6" style="width: 100px" /> kVA </y-td>
      <y-td>
        <el-input v-model="data.items[index].value8" />
      </y-td>
      <y-td>
        <el-input v-model="data.items[index].value9" />
      </y-td>
      <y-td> <el-input v-model="data.items[index].value10" style="width: 50px" /> 년 <el-input v-model="data.items[index].value11" style="width: 30px" /> 월 </y-td>
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

  <div style="margin-top: 10px; text-align: left">
    <el-button class="filter-item" type="success" @click="clickSubmit">저장</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import router from "~/router";
import { util, size } from "~/global";
import { Company, Facility, Building } from "~/models";
import Extra from '~/models/extra'
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ElTable } from "element-plus";
import type { UploadProps } from "element-plus";

const props = defineProps({
  id: Number,
});

const { width, height } = size();

const store = useStore();
const route = useRoute();

const model = Facility;

const category = 40;

const item = {
  id: 0,
  type: 1,
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
  value11: "",
  value12: "",
  value13: "",
  value14: "",
  value15: "",
  value16: "",
  value17: "",
  value18: "",
  value19: "",
  value20: "",
  value25: false,
  building: 0,
};

const data = reactive({
  id: 0,
  item: util.clone(item),
  positions: [
    { id: "0", name: " " },
    { id: "1", name: "옥내" },
    { id: "2", name: "옥외" },
    { id: "3", name: "직접입력" },
  ],
  types: [
    { id: "0", name: " " },
    { id: "1", name: "DC차데모" },
    { id: "2", name: "DC콤보" },
    { id: "3", name: "AC3상" },
  ],
  volts: [
    { id: "0", name: " " },
    { id: "1", name: "380/220V" },
    { id: "2", name: "220V" },
    { id: "3", name: "22,900V" },
    { id: "4", name: "직접입력" },
  ],
  items: [],
  total: 0,
});

async function initData() {}

async function getItems() {
  let res = await model.find({
    building: data.id,
    category: category,
    orderby: "f_id",
  });

  if (res.items.length > 0) {
    if (res.items[0].value25 == 1) {
      res.items[0].value25 = true
    } else {
      res.items[0].value25 = false
    }
    data.item = res.items[0];
  } else {
    res = await Building.get(data.id);

    data.item.name = res.item.name + " EV충전기";
  }

  res = await model.find({
    building: data.id,
    category: category + 1,
    orderby: "f_id",
  });

  data.items = res.items;

  if (data.items.length == 0) {
    data.items.push(util.clone(item));
  }

  changeValue();
}

onMounted(async () => {
  data.id = util.getInt(route.params.id);

  util.loading(true);

  await initData();
  await getItems();

  util.loading(false);
});

function makeData(item) {
  for (let i = 1; i <= 20; i++) {
    const name = `value${i}`;
    item[name] = "" + item[name];
  }

  return item;
}

async function clickSubmit() {
  util.loading(true);

  let item = makeData(util.clone(data.item));
  item.building = data.id;
  item.category = category;
  item.type = util.getInt(item.type)

  if (item.value25 == true) {
    item.value25 = 1
  } else {
    item.value25 = 0
  }
  
  if (item.id > 0) {
    await model.update(item);
  } else {
    await model.insert(item);
  }

  await model.deleteByBuildingCategory(data.id, category + 1);

  for (let i = 0; i < data.items.length; i++) {
    let item = makeData(util.clone(data.items[i]));
    item.building = data.id;
    item.category = category + 1;
    item.type = util.getInt(item.type)

    await model.insert(item);
  }
  
  await Extra.score(data.id);

  util.alert("저장되었습니다");

  util.loading(false);
}

function clickAdd() {
  data.items.push(util.clone(item));
}

function clickDelete(pos) {
  let items = util.clone(data.items);

  items.splice(pos, 1);
  data.items = items;
}

function changeValue() {
  let total = 0;
  for (let i = 0; i < data.items.length; i++) {
    let item = data.items[i];

    let value1 = util.getInt(item.value1);
    let value2 = util.getInt(item.value2);

    total += value1 * value2;
  }

  data.total = total;
}

/*
async function clickRead() {
  let res = await model.find({
    building: data.id,
    category: 10,
    orderby: "f_id",
  });

  if (res.items.length == 0) {
    return;
  }

  let item = res.items[0];

  data.item.value5 = item.value2;

  if (item.value5 == "1") {
    data.item.value3 = "1";
  } else if (item.value5 == "2") {
    data.item.value3 = "3";
  } else if (item.value5 == "3") {
    data.item.value3 = "4";
    data.item.value4 = item.value6;
  }
}
*/
</script>
