<template>  
  <el-menu @select="clickMenu" :collapse="false" style="padding-top:10px;">
    <el-menu-item index="1">
      <template #title>
        <el-icon><Document /></el-icon>업체 관리
      </template>
    </el-menu-item>

    <el-menu-item index="2">
      <template #title>
        <el-icon><Coin /></el-icon>팀 관리
      </template>
    </el-menu-item>

    <el-menu-item index="3">
      <template #title>
        <el-icon><User /></el-icon>직원 관리
      </template>
    </el-menu-item>    
    
    <el-menu-item index="4">
      <template #title>
        <el-icon><Cpu /></el-icon>면허 관리
      </template>
    </el-menu-item>

    <el-menu-item index="5">
      <template #title>
        <el-icon><OfficeBuilding /></el-icon>건물 관리
      </template>
    </el-menu-item>

    <el-menu-item index="6">
      <template #title>
        <el-icon><Money /></el-icon>고객 관리
      </template>
    </el-menu-item>    

  </el-menu>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const clickMenu = async (key: string, keyPath: string[]) => {
  if (key == '1') {
    router.push('/management/company')
  } else if (key == '2') {
    router.push('/management/department')
  } else if (key == '3') {
    router.push('/management/user')    
  } else if (key == '4') {
    router.push('/management/license')
  } else if (key == '5') {
    router.push('/management/building')
  } else if (key == '6') {
    router.push('/management/customer')    
  }
}

</script>
