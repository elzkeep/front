<template>
  <div class="flex-container" style="margin-top: 15%">
    <el-card class="box-card">
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 5px">
        <h1 style="display: flex; justify-content: center">여러분의 안전,</h1>
      </div>
      <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 30px">
        <h2><img alt="zkeep" src="../assets/logo.png" /></h2>
        <h1 style="font-weight: bold">지킴E</h1>
        <h1>에 오신걸 환영합니다.</h1>
      </div>
      <div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.loginid" placeholder="아이디를 입력하세요." style="width: 400px; height: 40px" :prefix-icon="UserFilled" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.passwd" placeholder="비밀번호를 입력하세요." show-password @keyup.enter.native="clickSignin" style="width: 400px; height: 40px" :prefix-icon="Lock" />
        </div>
        <button style="width: 400px; height: 40px; background-color: #ee5f39; color: white" @click="clickSignin">LOGIN</button>
        <div style="margin-top: 10px; display: flex; justify-content: center">
          <el-link :underline="false" @click="clickSignup" style="margin-right: 10px; margin-left: 10px">가입신청</el-link>|<el-link
            :underline="false"
            @click="clickId"
            style="margin-right: 10px; margin-left: 10px"
            >아이디 찾기</el-link
          >|
          <el-link :underline="false" @click="clickPasswd" style="margin-left: 10px">비밀번호 찾기</el-link>
        </div>
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
import { Lock, UserFilled } from '@element-plus/icons-vue'

const store = useStore()

const item = reactive({
  loginid: '',
  passwd: '',
})

onMounted(async () => {})

async function clickSignin() {
  if (item.loginid === '') {
    util.alert('로그인 아이디를 입력하세요')
    return
  }

  if (item.passwd === '') {
    util.alert('패스워드를 입력하세요')
    return
  }

  const res = await Login.login(item)
  if (res.code === 'ok') {
    util.login(store, res)

    if (res.user.level != User.level.rootadmin) {
      let res2 = await Company.get(res.user.company)
      let company = res2.item

      store.commit('setCompany', company)
    }

    router.push('/')
  } else {
    console.log(res)
    util.alert('로그인 정보가 정확하지 않습니다')
  }
}

function clickSignup() {
  router.push('/signup')
}

function clickId() {
  router.push('/findid')
}

function clickPasswd() {
  router.push('/findpasswd')
}
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
  align-items: center; /* 수직 정렬 */

  -webkit-box-pack: center;
  -moz-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center; /* 수평 정렬 */
}
</style>
