<template>

  <el-row style="border-bottom: 1px solid #ccc;height:">
    <el-col :span="12" style="text-align:left;">
      <div style="display:flex;margin: 10px 10px 10px 10px;gap:10px;">
        <img src="../../assets/logo.png" width="25" height="25" @click="clickBase('/management/dashboard')" />
        <span style="font-size:20px;font-weight:bold;" @click="clickBase('/management/dashboard')">지킴</span>
      </div>
    </el-col>

    <el-col :span="12">
      <div style="float:right;margin-top:20px;text-align:right;font-size:12px;margin-right:20px;">
        <el-dropdown>
          <span style="font-size:12px;">            
            {{store.getters['getUser'].name}}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item style="font-size:12px;">회원정보 수정</el-dropdown-item>
              <el-dropdown-item style="font-size:12px;" divided @click="clickLogout" >로그아웃</el-dropdown-item>
            </el-dropdown-menu>
          </template>
      </el-dropdown>
      </div>


      <div style="clear:both;"></div>
    </el-col>
  </el-row>

</template>

<script setup lang="ts">

import { ref, reactive, onMounted, computed, watch, watchEffect } from "vue"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import router from '~/router'
import { util }  from "~/global"

const store = useStore()
const route = useRoute()

const repairInsert = ref({});
const detailInsert = ref({});
const periodicInsert = ref({});

const data = reactive({
  id: 0,
  apt: {
    id: 0,
    tel: ''
  },
  repair: {
    reportdate: ''
  },
  menu: ''
})

const apt = ref({})


watch(() => route.params.id, async () => {
  data.id = util.getInt(route.params.id)
})

watch(() => route.path, async () => {
  var s = route.path.split('/')

  let menu = ''
  if (s[1] == 'management') {
    if (s.length == 3) {
      menu = s[1]
    } else {
      menu = `${s[1]}/${s[2]}`
    }
  } else {
    menu = s[2]
  }

  if (data.menu != menu) {
    data.menu = menu
  }

  if (menu == 'repair') {
    if (data.id == 0) {
      data.repair = { reportdate: '' }
      return
    } else {
      const res = await Repair.get(data.id)
      data.repair = res.item
    }
  }
})

onMounted(async () => {    
})

function clickLogout() {
  store.commit('setLogout')
  router.push('/')
}

function clickHome() {
  if (store.getters['getLevel'] == 'admin') {
    router.push('/management/sales')
  } else {
    router.push('/')
  }
}

function clickBase(url) {
  router.push(url)
}

</script>
