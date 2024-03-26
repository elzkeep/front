<template>
  <Title title="점검 관리" />

  <el-tabs v-model="data.menu" @tab-click="clickTab">
    <el-tab-pane label="저압설비" name="low">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Low :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="고압설비" name="high">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Generator :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="변전설비" name="transs">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Sunlight :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="부하설비" name="load">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Charger :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="발전설비" name="generator">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Ess :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="기타안전설비" name="etc">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Ups :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="태양광 발전" name="sunlight">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Fuel :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="전기차 충전기" name="charger">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Wind :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="ESS" name="ess">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Wind :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="UPS" name="ups">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Wind :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="연료전지" name="fuel">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Wind :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="풍력발전" name="wind">
      <div :style="{ height: data.height, overflow: 'auto' }"></div>
    </el-tab-pane>
    <el-tab-pane label="수력발전" name="water">
      <div :style="{ height: data.height, overflow: 'auto' }">
        <Water :id="data.id" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import router from "~/router";
import { util, size } from "~/global";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const { width, height } = size();

const store = useStore();
const route = useRoute();

const data = reactive({
  id: 0,
  session: {
    level: 0,
    company: 0,
  },
  menu: "low",
});

async function clickSearch() {
  await getItems(true);
}

async function initData() {}

async function getItems() {}

onMounted(async () => {
  data.session = store.getters["getUser"];
  data.id = util.getInt(route.params.id);

  util.loading(true);

  await initData();
  await getItems();

  util.loading(false);
});

function clickTab() {}
</script>
