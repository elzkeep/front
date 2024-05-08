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
          <el-input v-model="item.loginid" placeholder="아이디를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.passwd" placeholder="비밀번호를 입력하세요." show-password style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.passwd2" placeholder="비밀번호를 입력하세요." show-password style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.tel" placeholder="전화번호를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.email" placeholder="이메일를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.companyno" placeholder="사업자번호를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.companyname" placeholder="사업장명를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.ceo" placeholder="대표자명를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.address" placeholder="주소를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <div style="margin-bottom: 10px">
          <el-input v-model="item.addressetc" placeholder="상세주소를 입력하세요." style="width: 400px; height: 40px" />
        </div>
        <button style="width: 400px; height: 40px; background-color: #ee5f39; color: white" @click="clickSignup">가입신청 완료</button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { request, util } from '~/global'
import { Company, User } from '~/models'
import router from '~/router'

const item = reactive({
  loginid: '',
  passwd: '',
  passwd2: '',
  tel: '',
  email: '',
  companyno: '',
  companyname: '',
  ceo: '',
  address: '',
  addressetc: '',
})

async function clickSignup() {
  if (item.loginid === '') {
    util.error('로그인 아이디를 입력하세요')
    return
  }

  let res = await User.find({ loginid: item.loginid })
  if (res.items.length > 0) {
    util.alert('이미 등록된 로그인아이디 입니다')
    return
  }

  if (item.passwd == '') {
    util.alert('비밀번호를 입력하세요')
    return
  }

  if (item.passwd2 == '') {
    util.alert('비밀번호를 입력하세요')
    return
  }

  if (item.email == '') {
    util.alert('이메일을 입력하세요')
    return
  }

  res = await User.find({ email: item.email })
  if (res.items.length > 0) {
    util.alert('이미 등록된 이메일 입니다')
    return
  }

  if (item.passwd != item.passwd2) {
    util.alert('비밀번호가 정확하지 않습니다')
    return
  }

  res = await Company.find({ companyno: item.companyno })
  if (res.items.length > 0) {
    util.alert('이미 등록된 사업장입니다.')
    return
  }

  if (item.companyname == '') {
    util.alert('사업장 이름을 입력하세요')
    return
  }

  if (item.ceo == '') {
    util.alert('대표자명을 입력하세요')
    return
  }

  if (item.address == '') {
    util.alert('주소를 입력하세요')
    return
  }

  util.loading(true)

  res = await Company.insert({
    name: item.companyname,
    companyno: item.companyno,
    ceo: item.ceo,
    tel: item.tel,
    email: item.email,
    address: item.address,
    addressetc: item.addressetc,
    type: 1,
  })

  await User.insert({
    loginid: item.loginid,
    passwd: item.passwd,
    name: item.ceo,
    email: item.email,
    tel: item.tel,
    address: item.address,
    addressetc: item.addressetc,
    level: User.level.admin,
    approval: User.approval.complete,
    status: User.status.use,
    company: res.id,
  })

  util.loading(false)

  router.push('/signin')
}
</script>
