<template>
  <div class="flex-container">
    <el-card class="box-card">
      <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
        <el-input placeholder="이름 입력" v-model="data.name" style="height: 32px" />
      </div>
      <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
        <el-input placeholder="이메일 주소 입력" v-model="data.email" style="width: 300px" />
        <el-button type="primary" @click="clickSns">인증번호 발송</el-button>
      </div>
      <div v-if="data.sendAuthNum" style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
        <el-input placeholder="인증번호 입력" v-model="data.authNumber" style="width: 300px" />
        <el-button type="primary" @click="clickSubmit">확인</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { util } from '~/global'
import { Login, Company, User } from '~/models'
import router from '~/router'

const store = useStore()

const sns = {
  to: '',
  message: `지킴E 가입 URL\n팀명: \nURL: https://app.zkeep.space/#/join/user`,
  url: 'https://app.zkeep.space/#/join/user',
}

const data = reactive({
  name: '',
  email: '',
  authNumber: '',
  sendAuthNum: false,
  sns: util.clone(sns),
})

onMounted(async () => {})

async function clickSns() {
  if (data.name === '') {
    util.alert('이름을 입력하세요')
    return
  }

  if (data.email === '') {
    util.alert('이메일를 입력하세요')
    return
  }

  let res = await User.find({ name: data.name, email: data.email })

  data.sendAuthNum = true

  // const res = await Login.login(data)
  // if (res.code === 'ok') {
  //   util.login(store, res)

  //   if (res.user.level != User.level.rootadmin) {
  //     let res2 = await Company.get(res.user.company)
  //     console.log(res2)
  //     let company = res2.data

  //     store.commit('setCompany', company)
  //   }

  //   router.push('/')
  // } else {
  //   console.log(res)
  //   util.alert('로그인 정보가 정확하지 않습니다')
  // }
}

async function clickSubmit() {}
</script>
<style>
.flex-container {
  width: 100%;
  height: 400px;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;

  -webkit-box-align: center;
  -moz-box-align: center;
  -ms-flex-align: center;
  align-datas: center; /* 수직 정렬 */

  -webkit-box-pack: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center; /* 수평 정렬 */
}
</style>
