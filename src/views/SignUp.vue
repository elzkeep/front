<template>
  <el-form label-width="120px">
    <el-form-item label="Loginid">
      <el-input v-model="item.loginid" />
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="item.passwd" />
    </el-form-item>
    <el-form-item label="Password2">
      <el-input v-model="item.passwd2" />
    </el-form-item>
    <el-form-item label="tel">
      <el-input v-model="item.tel" />
    </el-form-item>
    <el-form-item label="email">
      <el-input v-model="item.email" />
    </el-form-item>
    <el-form-item label="사업자 번호">
      <el-input v-model="item.companyno" />
    </el-form-item>
    <el-form-item label="사업장명">
      <el-input v-model="item.companyname" />
    </el-form-item>
    <el-form-item label="대표자명">
      <el-input v-model="item.ceo" />
    </el-form-item>
    <el-form-item label="주소">
      <el-input v-model="item.address" />
      <el-input v-model="item.addressetc" />
    </el-form-item>
    <el-button type="primary" @click="clickSignup">가입신청 완료</el-button>
  </el-form>
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

  if (item.passwd != item.passwd2) {
    util.alert('비밀번호가 정확하지 않습니다')
    return
  }

  let ress = await Company.find({ comapnyno: item.companyno })
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

  let resCom = await Company.insert({
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
    level: 3,
    appproval: 3,
    status: 1,
    company: resCom.id,
  })

  util.loading(false)

  router.push('/signin')
}
</script>
