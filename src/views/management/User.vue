<template>
  <Title title="소속회원 관리" />

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-select v-model.number="data.search.department" size="small" placeholder="" style="width: 150px">
      <el-option v-for="item in data.departments2" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-select v-model.number="data.search.status" size="small" placeholder="" style="width: 90px">
      <el-option v-for="item in data.statuss" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="clickSearch" />

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="warning" @click="clickExcel" style="margin-right: -5px">엑셀</el-button>
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right: -5px">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsertSelect">등록</el-button>
      <el-button size="small" type="success" @click="clickApprovalManage">승인관리</el-button>
    </div>
  </div>

  <div style="margin-top: 10px; margin-bottom: 20px; display: flex; gap: 20px">
    <div style="float: left; width: 280px; padding: 10px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">전체 회원수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.status.totalusers }}</p>
    </div>
    <div style="float: left; width: 280px; padding: 10px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">재직 회원수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.status.users }}</p>
    </div>
    <div style="float: left; width: 280px; padding: 10px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">점수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ getTotalscore(data.status.totalscore) }} / {{ getTotalscore(data.status.score) }}</p>
    </div>
  </div>

  <el-table :data="data.items" border :height="height(340)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList" v-infinite="getItems">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="업체" align="left" v-if="data.session.level == User.level.rootadmin">
      <template #default="scope">
        {{ getCompany(scope.row.company) }}
      </template>
    </el-table-column>
    <el-table-column label="팀" align="left" width="100">
      <template #default="scope">
        {{ getDepartment(scope.row.department) }}
      </template>
    </el-table-column>
    <el-table-column prop="loginid" label="로그인아이디" align="left" />
    <el-table-column prop="name" label="이름" align="left" width="80" />
    <el-table-column prop="email" label="이메일" align="left" />
    <el-table-column prop="tel" label="연락처" align="left" width="100" />
    <el-table-column label="주소" align="left">
      <template #default="scope"> {{ scope.row.address }} {{ scope.row.addressetc }} </template>
    </el-table-column>
    <el-table-column label="권한" align="center" width="70">
      <template #default="scope">
        {{ getLevel(scope.row.level) }}
      </template>
    </el-table-column>
    <el-table-column label="상태" align="center" width="70">
      <template #default="scope">
        <span v-if="scope.row.status == 1">사용</span>
        <span v-if="scope.row.status == 2">사용중지</span>
      </template>
    </el-table-column>
    <el-table-column label="점수" align="center" width="70">
      <template #default="scope"> {{ getTotalscore(scope.row.totalscore) }} / {{ scope.row.score }} </template>
    </el-table-column>
    <el-table-column label="자격증" align="center" width="70">
      <template #default="scope">
        <el-button size="small" type="primary" @click="clickViewLicense(scope.row)" style="margin-right: -5px">보기</el-button>
      </template>
    </el-table-column>
    <el-table-column label="등록일" align="center" width="140">
      <template #default="scope">
        {{ util.viewDatetime(scope.row.date) }}
      </template>
    </el-table-column>
    <el-table-column label="고객배치현황" align="center" width="80">
      <template #default="scope">
        <el-button size="small" type="primary" @click="clickView(scope.row)" style="margin-right: -5px">보기</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="data.visible" width="800px">
    <y-table>
      <y-tr v-if="data.session.level == User.level.rootadmin">
        <y-th>업체</y-th>
        <y-td>
          <el-select size="small" v-model.number="data.item.company" placeholder="업체" style="width: 150px" @change="changeCompany">
            <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>팀</y-th>
        <y-td>
          <el-select size="small" v-model.number="data.item.department" placeholder="팀" style="width: 150px">
            <el-option v-for="item in data.departments" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>로그인아이디</y-th>
        <y-td>
          <el-input v-model="data.item.loginid" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>비밀번호</y-th>
        <y-td>
          <el-input v-model="data.item.passwd" show-password />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>비밀번호 확인</y-th>
        <y-td>
          <el-input v-model="data.item.passwd2" show-password />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이름</y-th>
        <y-td>
          <el-input v-model="data.item.name" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이메일</y-th>
        <y-td>
          <el-input v-model="data.item.email" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>연락처</y-th>
        <y-td>
          <el-input v-model="data.item.tel" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소</y-th>
        <y-td>
          <el-input v-model="data.item.address" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상세주소</y-th>
        <y-td>
          <el-input v-model="data.item.addressetc" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>입사일</y-th>
        <y-td>
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.item.joindate" @change="changeJoindate" format="YYYY.MM.DD" value-format="YYYY-MM-DD" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>경력</y-th>
        <y-td>
          {{ calculateDateDifference(data.item.joindate, data.item.careeryear, data.item.careermonth) }}
          <!-- <el-input v-model="data.item.careeryear" style="width: 50px" /> {{ data.item.careeryear }} 년 <el-input v-model="data.item.careermonth" style="width: 50px" /> {{ data.item.joindate }} 월 -->
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>권한</y-th>
        <y-td>
          <el-select size="small" v-model.number="data.item.level" placeholder="권한" style="width: 150px">
            <el-option v-for="item in data.levels" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.status">
            <el-radio-button size="small" value="1">사용</el-radio-button>
            <el-radio-button size="small" value="2">사용중지</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>점수</y-th>
        <y-td>
          <el-input v-model="data.item.score" />
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleViewLicense" width="800px">
    <Title title="자격정보" />
    <y-table v-for="item in data.license.items" :key="item.id" style="margin-bottom: 10px">
      <y-tr>
        <y-th rowspan="2" colspan="1">기술자격증명</y-th>
        <y-td> (자격명) </y-td>
        <y-td>
          {{ item.extra.licensecategory.name }}
        </y-td>
        <y-td> (등록번호) </y-td>
        <y-td>
          {{ item.number }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-td> (기술자격등급) </y-td>
        <y-td>
          {{ item.extra.licenselevel.name }}
        </y-td>
        <y-td> (취득일) </y-td>
        <y-td>
          {{ item.takingdate }}
        </y-td>
      </y-tr>
    </y-table>
    <!-- <y-table style="margin-top: 10px">
      <y-tr>
        <y-th>법정교육일자</y-th>
        <y-td>
          {{ data.item.educationdate }}
        </y-td>
        <y-th>법정교육기관</y-th>
        <y-td>
          {{ data.item.educationinstitution }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>특별교육일자</y-th>
        <y-td>
          {{ data.item.specialeducationdate }}
        </y-td>
        <y-th>특별교육기관</y-th>
        <y-td>
          {{ data.item.specialeducationinstitution }}
        </y-td>
      </y-tr>
    </y-table> -->
    <!-- <el-table :data="data.license.items" border :height="'500px'">
      <el-table-column prop="extra.building.name" label="건물명" align="left" width="100" />
      <el-table-column label="고객명" align="left" width="100">
        <template #default="scope">
          {{ getCompany(scope.row.extra.building.company) }}
        </template>
      </el-table-column>
      <el-table-column label="주소" align="left">
        <template #default="scope"> {{ scope.row.extra.building.address }} {{ scope.row.extra.building.addressetc }} </template>
      </el-table-column>
      <el-table-column prop="extra.building.score" label="점수" align="right" width="70" />
    </el-table> -->
  </el-dialog>

  <el-dialog v-model="data.visibleView" width="800px">
    <el-table :data="data.customers" border :height="'500px'">
      <el-table-column prop="extra.building.name" label="건물명" align="left" width="100" />
      <el-table-column label="고객명" align="left" width="100">
        <template #default="scope">
          {{ getCompany(scope.row.extra.building.company) }}
        </template>
      </el-table-column>
      <el-table-column label="주소" align="left">
        <template #default="scope"> {{ scope.row.extra.building.address }} {{ scope.row.extra.building.addressetc }} </template>
      </el-table-column>
      <el-table-column label="점수" align="right" width="70">
        <template #default="scope">
          {{ getTotalscore(scope.row.extra.building.score) }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="data.approval.visible" width="800px">
    <el-radio-group v-model.number="data.approval.status" style="display: flex; margin-bottom: 10px">
      <el-radio-button size="small" value="1" @click="getApproval(1)" label="거래처 신청" />
      <el-radio-button size="small" value="2" @click="getApproval(2)" label="거절" />
    </el-radio-group>
    <el-table v-if="data.approval.status == 1" :data="data.approval.items" border :height="'500px'" @row-click="clickApproval">
      <el-table-column prop="joindate" label="신청일시" align="left" width="100" />
      <el-table-column prop="loginid" label="ID" align="left" width="100" />
      <el-table-column prop="name" label="이름" align="left" />
      <el-table-column prop="tel" label="휴대폰번호" align="left" />
      <el-table-column prop="email" label="이메일" align="right" />
      <el-table-column label="승인" align="center" width="160">
        <template #default="scope">
          <el-button size="small" type="primary" @click="clickApprovalOk(scope.row)" style="margin-right: -5px">승인</el-button>
          <el-button size="small" type="danger" @click="clickApprovalCancle(scope.row)" style="margin-right: -5px">거절</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="data.approval.status == 2" :data="data.approval.items" border :height="'500px'" @row-click="clickApproval">
      <el-table-column prop="joindate" label="신청일시" align="left" width="100" />
      <el-table-column prop="loginid" label="ID" align="left" width="100" />
      <el-table-column prop="name" label="이름" align="left" />
      <el-table-column prop="tel" label="휴대폰번호" align="left" />
      <el-table-column prop="email" label="이메일" align="right" />
      <el-table-column label="처리내역" align="center" width="160">
        <template #default="scope">
          <span v-if="scope.row.approval == 3">승인</span>
          <span v-if="scope.row.approval == 2">거절</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="data.approval.visibleView" width="800px">
    <Title title="기본정보" />
    <y-table>
      <y-tr>
        <y-th>로그인아이디</y-th>
        <y-td>
          {{ data.item.loginid }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이름</y-th>
        <y-td>
          {{ data.item.name }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이메일</y-th>
        <y-td>
          {{ data.item.email }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>연락처</y-th>
        <y-td>
          {{ data.item.tel }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소</y-th>
        <y-td>
          {{ data.item.address }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상세주소</y-th>
        <y-td>
          {{ data.item.addressetc }}
        </y-td>
      </y-tr>
    </y-table>
    <Title title="자격정보" />
    <y-table v-for="item in data.license.items" :key="item.id" style="margin-bottom: 10px">
      <y-tr>
        <y-th rowspan="2" colspan="1">기술자격증명</y-th>
        <y-td> (자격명) </y-td>
        <y-td>
          {{ item.extra.licensecategory.name }}
        </y-td>
        <y-td> (등록번호) </y-td>
        <y-td>
          {{ item.number }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-td> (기술자격등급) </y-td>
        <y-td>
          {{ item.extra.licenselevel.name }}
        </y-td>
        <y-td> (취득일) </y-td>
        <y-td>
          {{ item.takingdate }}
        </y-td>
      </y-tr>
    </y-table>
    <y-table style="margin-top: 10px">
      <y-tr>
        <y-th>법정교육일자</y-th>
        <y-td>
          {{ data.item.educationdate }}
        </y-td>
        <y-th>법정교육기관</y-th>
        <y-td>
          {{ data.item.educationinstitution }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>특별교육일자</y-th>
        <y-td>
          {{ data.item.specialeducationdate }}
        </y-td>
        <y-th>특별교육기관</y-th>
        <y-td>
          {{ data.item.specialeducationinstitution }}
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <!-- <el-button size="small" @click="clickCancel">취소</el-button> -->
      <!-- <el-button size="small" type="primary" @click="clickSubmit">등록</el-button> -->
    </template>
  </el-dialog>

  <el-dialog v-model="data.approval.visibleOk" width="800px">
    <Title title="기본정보" />
    <y-table>
      <y-tr>
        <y-th>로그인아이디</y-th>
        <y-td>
          {{ data.item.loginid }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이름</y-th>
        <y-td>
          {{ data.item.name }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이메일</y-th>
        <y-td>
          {{ data.item.email }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>연락처</y-th>
        <y-td>
          {{ data.item.tel }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소</y-th>
        <y-td>
          {{ data.item.address }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상세주소</y-th>
        <y-td>
          {{ data.item.addressetc }}
        </y-td>
      </y-tr>
    </y-table>
    <Title title="자격정보" />
    <y-table v-for="item in data.license.items" :key="item.id" style="margin-bottom: 10px">
      <y-tr>
        <y-th rowspan="2" colspan="1">기술자격증명</y-th>
        <y-td> (자격명) </y-td>
        <y-td>
          {{ item.extra.licensecategory.name }}
        </y-td>
        <y-td> (등록번호) </y-td>
        <y-td>
          {{ item.number }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-td> (기술자격등급) </y-td>
        <y-td>
          {{ item.extra.licenselevel.name }}
        </y-td>
        <y-td> (취득일) </y-td>
        <y-td>
          {{ item.takingdate }}
        </y-td>
      </y-tr>
    </y-table>
    <y-table style="margin-top: 10px">
      <y-tr>
        <y-th>법정교육일자</y-th>
        <y-td>
          {{ data.item.educationdate }}
        </y-td>
        <y-th>법정교육기관</y-th>
        <y-td>
          {{ data.item.educationinstitution }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>특별교육일자</y-th>
        <y-td>
          {{ data.item.specialeducationdate }}
        </y-td>
        <y-th>특별교육기관</y-th>
        <y-td>
          {{ data.item.specialeducationinstitution }}
        </y-td>
      </y-tr>
    </y-table>

    <Title title="처리정보" />
    <y-table>
      <y-tr>
        <y-th>팀</y-th>
        <y-td>
          <el-select v-model.number="data.item.department" placeholder="팀" style="width: 150px">
            <el-option v-for="item in data.departments" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>경력</y-th>
        <y-td> <el-input v-model="data.item.careeryear" style="width: 50px" /> 년 <el-input v-model="data.item.careermonth" style="width: 50px" /> 월 </y-td>
      </y-tr>
      <y-tr>
        <y-th>권한</y-th>
        <y-td>
          <el-select v-model.number="data.item.level" placeholder="권한" style="width: 150px">
            <el-option v-for="item in data.levels" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.status">
            <el-radio-button size="small" value="1">사용</el-radio-button>
            <el-radio-button size="small" value="2">사용중지</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>점수</y-th>
        <y-td>
          <el-input v-model="data.item.score" />
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <!-- <el-button size="small" @click="clickCancel">취소</el-button> -->
      <el-button size="small" type="primary" @click="clickApprovalRealOk">승인</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleSelect" width="400px">
    <div style="margin-top: 20px" />
    <el-button size="large" type="success" @click="clickInsert">단건 등록</el-button>
    <el-button size="large" type="success" @click="clickMulti">일괄 등록</el-button>

    <template #footer>
      <el-button size="small" @click="data.visibleSelect = false">취소</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleMulti" width="800px">
    <y-table>
      <y-tr>
        <y-th>*파일등록</y-th>
        <y-td>
          <el-row>
            <el-col :span="12">
              <el-text tag="b"> 설정대상 <br /><br /></el-text>
              <el-text style="font-size: 12px">
                A열 = 팀<br />
                B열 = 로그인아이디<br />
                C열 = 이름<br />
                D열 = 이메일<br />
                E열 = 연락처<br />
                F열 = 주소<br />
                G열 = 권한<br />
                H열 = 상태<br />
                I열 = 점수<br />
                J열 = 등록일<br />
              </el-text>
            </el-col>
            <el-col :span="12">
              <div style="flex: 1; text-align: right; gap: 5">
                <el-upload
                  class="upload"
                  :action="external.upload"
                  :headers="headers"
                  :show-file-list="true"
                  :on-success="handleFileSuccess"
                  :auto-upload="true"
                  :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                  v-model:file-list="external.files"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px"> 엑셀 등록 </el-button>
                  </template>
                  <el-button type="primary" @click="clickDownloadExcelExample"> 예제파일 다운로드 </el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="data.visibleMulti = false">취소</el-button>
      <el-button size="small" type="primary" @click="clickMultiSubmit">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Userlist, Company, Department, Customer, License } from '~/models'
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import moment from 'moment'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const headers = {
  Authorization: 'Bearer ' + store.state.token,
}

const model = User

const item = {
  id: 0,
  loginid: '',
  passwd: '',
  name: '',
  email: '',
  tel: '',
  address: '',
  addressetc: '',
  joindate: '',
  careeryear: 0,
  careermonth: 0,
  level: 1,
  approval: 1,
  rejectreason: '',
  status: 1,
  company: 0,
  department: 0,
  date: '',
}

const data = reactive({
  session: {
    level: 0,
    company: 0,
  },
  id: 0,
  mode: 'normal',
  items: [],
  total: 0,
  page: 1,
  pagesize: 50,
  item: util.clone(item),
  visible: false,
  visibleView: false,
  visibleSelect: false,
  visibleMulti: false,
  visibleViewLicense: false,
  search: {
    text: '',
    department: 0,
    status: 1,
    company: 0,
    department: 0,
  },
  company: {},
  companys: [],
  departments: [],
  statuss: [
    { id: 0, name: '상태' },
    { id: 1, name: '사용' },
    { id: 2, name: '사용 중지' },
  ],
  levels: [
    { id: 0, name: ' ' },
    { id: 1, name: '일반' },
    { id: 2, name: '팀장' },
    { id: 3, name: '관리자' },
    { id: 4, name: '전체관리자' },
  ],
  customers: [],
  approval: {
    status: 1,
    page: 1,
    pagesize: 20,
    // item: util.clone(item),
    visible: false,
    visibleView: false,
    visibleOk: false,
    items: [],
    total: 0,
  },
  license: {
    items: [],
    total: 0,
  },
  status: {
    users: 0,
    totalusers: 0,
    score: 0,
    totalscore: 0,
  },
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Company.find({
    page: data.page,
    pagesize: data.pagesize,
    orderby: 'c_name',
  })

  data.companys = [{ id: 0, name: ' ' }, ...res.items]

  res = await Company.get(data.session.company)
  data.company = res.item

  res = await Department.find({
    page: 0,
    pagesize: data.pagesize,
    company: data.session.company,
    orderby: 'de_order,de_name',
  })

  data.departments = [{ id: 0, name: data.company.name }, ...res.items]
  data.departments2 = [{ id: 0, name: '팀' }, ...res.items]

  data.levels = [
    { id: 0, name: ' ' },
    { id: 1, name: '일반' },
    { id: 2, name: '팀장' },
    { id: 3, name: '관리자' },
  ]

  res = await Userlist.init()
  data.status = res
}

async function getItems(reset) {
  if (reset == true) {
    data.page = 1
    data.items = []
  }

  if (data.session.level != User.level.rootadmin) {
    data.search.company = data.session.company
  }

  let res = await Userlist.find({
    name: data.search.text,
    department: data.search.department,
    status: data.search.status,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    approval: 3,
    orderby: 'u_name, u_id',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = (data.page - 1) * data.pagesize + i
    items.push(item)
  }

  data.total = res.total
  data.items = data.items.concat(items)

  data.page++
}

async function getApproval(id) {
  let res = await User.find({
    page: data.approval.page,
    pagesize: data.approval.pagesize,
    company: data.search.company,
    approval: id,
    orderby: 'u_id',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = i + 1
    items.push(item)
  }

  data.approval.total = res.total
  data.approval.items = items
}

async function getLicense(id) {
  let res = await License.find({
    // page: data.approval.page,
    // pagesize: data.approval.pagesize,
    user: id,
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = i + 1
    items.push(item)
  }

  data.license.total = res.total
  data.license.items = items
}

function licenseText(item) {
  let text = ''
  for (let i = 0; i < data.license.items.length; i++) {
    if (item == 'category') {
      text += data.license.items[i].extra.licensecategory.name + ', '
    }
    if (item == 'level') {
      text += data.license.items[i].extra.licenselevel.name + ', '
    }
    if (item == 'number') {
      text += data.license.items[i].number + ', '
    }
    if (item == 'takingdate') {
      text += data.license.items[i].takingdate + ', '
    }
  }

  return text
}

function clickApproval(item, index) {
  // if (index.no == 0) {
  //   return
  // }

  if (data.approval.status == 2 && index.no == 5) {
    util.messagebox('거절사유', item.rejectreason, function () {})
    return
  }

  if (index.no == 5) {
    return
  }

  getLicense(item.id)

  data.item = util.clone(item)
  data.approval.visibleView = true
}

function clickInsert() {
  data.visibleSelect = false

  if (data.session.level == User.level.rootadmin) {
    data.departments = []
  }

  data.item = util.clone(item)
  data.item.passwd2 = data.item.passwd
  data.item.joindate = moment().format('YYYY.MM.DD')
  data.visible = true
}

function clickApprovalManage() {
  data.approval.status = 1
  getApproval(1)
  data.approval.visible = true
}

async function clickApprovalOk(item) {
  data.item = util.clone(item)
  data.approval.visibleOk = true
}

async function clickApprovalRealOk() {
  let item = data.item
  util.confirm('승인하시겠습니까?', async function () {
    util.loading(true)
    item.approval = 3
    item.company = util.getInt(item.company)
    item.department = util.getInt(item.department)
    item.careeryear = util.getInt(item.careeryear)
    item.careermonth = util.getInt(item.careermonth)
    item.joindate = util.convertDBDate(item.joindate)
    item.level = util.getInt(item.level)
    item.status = util.getInt(item.status)
    item.score = util.getFloat(item.score)

    await model.update(data.item)
    await getApproval(1)
    util.loading(false)
  })
}

async function clickApprovalCancle(item) {
  util.prompt('거절하시겠습니까?', async function (value) {
    console.log(value)
    util.loading(true)
    let item1 = util.clone(item)
    item1.approval = 2
    item1.rejectreason = value
    await model.update(item1)
    await getApproval(1)
    util.loading(false)
  })
}

function clickUpdate(item, index) {
  if (index.no == 0) {
    return
  }

  if (index.no == 10) {
    return
  }

  if (index.no == 12) {
    return
  }

  data.item = util.clone(item)
  data.item.passwd2 = data.item.passwd
  data.visible = true
}

onMounted(async () => {
  data.session = store.getters['getUser']

  util.loading(true)

  await initData()
  await getItems()

  data.visible = false
  util.loading(false)
})

function clickCancel() {
  data.visible = false
}

const listRef = ref<InstanceType<typeof ElTable>>()
const listSelection = ref([])
const toggleListSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      listRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    listRef.value!.clearSelection()
  }
}
const changeList = val => {
  let list = []
  for (let i = 0; i < val.length; i++) {
    if (val[i].id == data.session.id || val[i].level == 3) {
      listRef.value!.toggleRowSelection(val[i], undefined)
      continue
    }
    list.push(val[i])
  }
  listSelection.value = list
}

function clickDeleteMulti() {
  util.confirm('삭제하시겠습니까', async function () {
    util.loading(true)

    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let item = {
        id: value.id,
      }

      await model.remove(item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)

    util.loading(false)
  })
}

async function clickSubmit() {
  let item = util.clone(data.item)

  item.company = data.session.company

  if (item.status == 1) {
    if (item.department == 0) {
      util.alert('팀을 선택하세요')
      return
    }

    if (item.loginid == '') {
      util.alert('로그인아이디를 입력하세요')
      return
    }

    let res = await User.find({ loginid: item.loginid })
    if ((item.id == 0 && res.items.length > 0) || (item.id != 0 && res.items.length > 1)) {
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

    if (item.name == '') {
      util.alert('이름을 입력하세요')
      return
    }

    if (item.passwd != item.passwd2) {
      util.alert('비밀번호가 정확하지 않습니다')
      return
    }

    if (item.level == 0) {
      util.alert('권한을 선택하세요')
      return
    }
  }

  util.loading(true)

  item.company = util.getInt(item.company)
  item.department = util.getInt(item.department)
  item.careeryear = util.getInt(item.careeryear)
  item.careermonth = util.getInt(item.careermonth)
  item.joindate = util.convertDBDate(item.joindate)
  item.level = util.getInt(item.level)
  item.status = util.getInt(item.status)

  item.score = util.getFloat(item.score)

  if (item.id > 0) {
    await model.update(item)
  } else {
    await model.insert(item)
  }

  //util.info('등록되었습니다')

  await getItems(true)

  data.visible = false
  util.loading(false)
}

function getCompany(id) {
  let items = data.companys.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function getDepartment(id) {
  let items = data.departments.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function getLevel(id) {
  let items = data.levels.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

async function changeCompany(item) {
  let res = await Department.find({
    company: item,
    page: data.page,
    pagesize: data.pagesize,
    orderby: 'de_order,de_name',
  })

  data.departments = [{ id: 0, name: data.company.name }, ...res.items]

  data.item.department = 0
}

async function clickView(item) {
  let res = await Customer.find({
    user: item.id,
    status: 1,
    orderby: 'b_name',
  })

  data.customers = res.items

  data.visibleView = true
}

function clickCancelView() {
  data.visibleView = false
}

async function clickViewLicense(item) {
  getLicense(item.id)

  data.visibleViewLicense = true
}

function clickCancelViewLicense() {
  data.license.items = []
  data.license.total = 0
  data.visibleViewLicense = false
}

function changeJoindate() {
  let joindate = moment(data.item.joindate)
  let now = moment()
  let diff = moment.duration(now.diff(joindate))
  let year = parseInt(diff.asYears())
  let month = parseInt(diff.asMonths() - year * 12)

  data.item.careeryear = year
  data.item.careermonth = month
}

function getTotalscore(value) {
  if (value == 0) {
    return 0
  }

  return value.toFixed(1)
}

function clickExcel() {
  let url = '/api/download/user'
  let filename = `소속회원-${moment().format('YYYY-MM-DD')}.xlsx`
  util.download(store, url, filename)
}

function clickInsertSelect() {
  data.visibleSelect = true
}

function clickMulti() {
  data.visibleSelect = false
  data.visibleMulti = true
}

async function clickMultiSubmit() {
  util.loading(true)

  let filename = external.files[0].response.filename
  await Extra.user(filename)

  data.visibleSelect = false
  data.visibleMulti = false

  util.alert('저장되었습니다')

  await getItems(true)

  util.loading(false)
}

function clickDownloadExcelExample() {
  let url = '/api/download/userexample'
  let filename = `소속회원.xlsx`
  util.download(store, url, filename)
}

const external = reactive({
  type: 1,
  filename: '',
  originalfilename: '',
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`,
  files: [],
})

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  console.log(response)
  console.log(response.filename)
  console.log(response.originalfilename)
  external.filename = response.filename
  external.originalfilename = response.originalfilename
}

function calculateDateDifference(dateString: string, careeryear: string, careermonth: string): string {
  let date1
  if (dateString == '') {
    date1 = new Date()
  } else {
    date1 = new Date(dateString)
  }
  const date2 = new Date()

  let years = date2.getFullYear() - date1.getFullYear()
  let months = date2.getMonth() - date1.getMonth()

  // Adjust years and months if necessary
  if (months < 0) {
    years -= 1
    months += 12
  }

  // if (careeryear == '') {
  //   career
  // }

  return `${years + Number(careeryear)}년 ${months + Number(careermonth)}개월`
}
</script>
