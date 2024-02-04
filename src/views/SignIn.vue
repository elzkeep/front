<template>
  <div class="flex-container">
    <el-card class="box-card">
      <el-form label-width="120px">
        <el-form-item label="Loginid">
          <el-input v-model="item.loginid" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="item.passwd" show-password @keyup.enter.native="clickSignin" />
        </el-form-item>
        <el-button type="primary" @click="clickSignin">Sign In</el-button>
      </el-form>
    </el-card>    
  </div>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { util } from '~/global'
import { Login } from "~/models"
import router from '~/router'

const store = useStore()

const item = reactive({
  loginid: '',
  passwd: ''
})

async function clickSignin() {
  if (item.loginid === '') {
    util.error('로그인 아이디를 입력하세요')
    return
  }

  if (item.passwd === '') {
    util.error('패스워드를 입력하세요')
    return
  }  

  const res = await Login.login(item)
  if (res.code === 'ok') {
    store.commit('setRepair', null)
    util.login(store, res)
    router.push('/')
  } else {
    console.log(res);
    util.error('로그인 정보가 정확하지 않습니다')
  }
}

</script>
<style>
.flex-container{ 
  width: 100%; 
  height: 400px; 
  display: -webkit-box; 
  display: -moz-box;
  display: -ms-flexbox; 
  display: flex; 
  
  -webkit-box-align: center; 
  -moz-box-align: center;
  -ms-flex-align: center;
  align-items: center; /* 수직 정렬 */
  
  -webkit-box-pack: center;
  -moz-box-pack: center; 
  -ms-flex-pack: center; 
  justify-content: center;/* 수평 정렬 */
}
</style>
