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
        <div>
          <el-link :underline="false" @click="clickSignup">가입신청</el-link> | <el-link :underline="false" @click="clickId">아이디 찾기</el-link> |
          <el-link :underline="false" @click="clickPasswd">비밀번호 찾기</el-link>
        </div>
      </el-form>
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
