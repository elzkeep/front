<template>
  <Title title="수량" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">    
    <div style="flex:1;text-align:right;gap:5;">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right:5px;">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>  

  
  <el-table :data="data.items" border :height="height(170)" ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column prop="index" label="NO" width="40" align="center" />
    <el-table-column prop="name" label="명칭" align="center" />    
    <el-table-column label="이미지" align="center">
      <template #default="scope">
        <el-image :src="util.getImagePath(scope.row.filename)" fit="cover" style="position:relative;top:5px;width:75px;height:50px;" @click="v3ImgPreviewFn(util.getImagePath(scope.row.filename))" />                                                               
      </template>
    </el-table-column>
    <el-table-column prop="order" label="순번" align="center" width="50" />
    <el-table-column prop="date" label="등록일" align="center" width="150" />
    <el-table-column label="" align="center" width="80">
      <template #default="scope">
        <el-button size="small" type="primary" @click="clickDraw(scope.row)">입력</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-dialog
    v-model="data.visible"
    width="800px"
  >

      <y-table>
        <y-tr>
          <y-th>명칭</y-th>
          <y-td>
            <el-input v-model="data.item.name" />
          </y-td>
        </y-tr>        
        <y-tr>
          <y-th>순번</y-th>
          <y-td>
            <el-input v-model.number="data.item.order" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>이미지</y-th>
          <y-td>

            <el-upload              
              style="float:left;"
              class="upload-demo"
              ref="upload"            
              :action="data.upload"
              :headers="headers"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="handelSuccess"
              :show-file-list="false"
              :auto-upload="true"
              :data="{path:'area'}"
              :accept="'image/*'"
            >
              <el-button size="small" type="danger" @click="submitUpload">이미지 업로드</el-button>

            </el-upload>
            
            
          </y-td>
        </y-tr>
      </y-table>

      <template #footer>
        <el-button size="small" @click="clickCancel">취소</el-button>
        <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
      </template>
  </el-dialog>


  <div style="position:absolute;left:0px;top:0px;background:#FFF;z-index:99999999;" :style="{width: width(0), height: height(0)}" v-show="data.visibleDraw">
    <div style="display:flex;flex-direction: row;justify-content: space-between;padding: 10px 10px;" @keyup="inputKey">
      <el-radio-group v-model.number="data.type" @change="changeType">
        <el-radio-button size="small" label="1">길이</el-radio-button>
        <el-radio-button size="small" label="2">면적</el-radio-button>
        <el-radio-button size="small" label="3">연속길이</el-radio-button>

        <div style="width:50px;"></div>
        <el-button size="small" @click="clickZoomUp"><el-icon><Plus /></el-icon></el-button>
        <el-button size="small" @click="clickZoomDown"><el-icon><Minus /></el-icon></el-button>
        
        <div style="width:50px;"></div>
        <el-button size="small" @click="clickUndo"><el-icon><ArrowLeft /></el-icon></el-button>
        <el-button size="small" @click="clickRedo"><el-icon><ArrowRight /></el-icon></el-button>
      </el-radio-group>

      <div>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
      </div>
    </div>

    <div id="canvasFrame" style="margin-left:10px;border:1px solid #999;text-align:left;overflow:auto;" :style="{width: width(20), height: height(70)}">
    <canvas id="canvas" @mousedown.left="clickMouseLeft" @mousedown.right="clickMouseRight" @mousemove="moveMouse" @keyup="inputKey" @input="inputKey" @contextmenu.prevent></canvas>
    </div>
  </div>
  
</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Repairarea } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import { v3ImgPreviewFn } from 'v3-img-preview'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Repairarea

const headers = {
  Authorization: 'Bearer ' + store.state.token
}

const canvas = ref(null);
const ctx = ref(null);

const item = {
  id: 0,
  name: '',
  filename: '',
  order: 0,
  apt: 0,
  date: ''
}

const data = reactive({
  apt: 0,
  id: 0,
  mode: 'normal',
  items: [],
  total: 0,
  page: 1,
  pagesize: 0,
  item: util.clone(item),
  visible: false,
  visibleDraw: false,
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`,
  filename: '',
  start: true,
  points: [],
  type: 1,
  zoom: 1.0
})

async function initData() {  
}

async function getItems() {
  let res = await model.find({
    page: data.page,
    pagesize: data.pagesize,
    periodic: data.id,
    orderby: 'ra_order,ra_id'
  })

  if (res.items != null) {   
    for (let i = 0; i < res.items.length; i++) {
      res.items[i].index = i + 1
    }
  }

  data.total = res.total
  if (res.items == null) {
    res.items = []
  }

  data.items = res.items
}

function clickInsert() {  
  data.item = util.clone(item)
  data.visible = true  
}

onMounted(async () => {  
  canvas.value = document.getElementById("canvas")
  ctx.value = canvas.value.getContext("2d")  

  data.apt = parseInt(route.params.apt)

  util.loading(true)
  
  await initData()
  await getItems()

  window.addEventListener('keyup', function(ev) {
    inputKey(ev)
  });
  
  data.visible = false
  util.loading(false)
})

function clickCancel() {
  data.visible = false
}

const listRef = ref<InstanceType<typeof ElTable>>()
const listSelection = ref([])
const toggleListSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      listRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    listRef.value!.clearSelection()
  }
}
const changeList = (val) => {
  listSelection.value = val
}

function clickDeleteMulti() {
  util.confirm('삭제하시겠습니까', async function() {
    util.loading(true)

    let items = []
    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let item = {
        id: value.id
      }

      await model.remove(item)      
    }
    
    util.info('삭제되었습니다')
    await getItems()

    util.loading(false)
  })
}

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
}

async function handelSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  const filename = response.filename
  data.filename = filename    
}

const submitUpload = () => {
  upload.value.clearFiles()
  upload.value!.submit()
}

async function clickSubmit() {
  util.loading(true)

  let item = util.clone(data.item)
  item.order = util.getInt(item.order)
  item.filename = data.filename
  await model.insert(item)

  await getItems()
  util.info('등록되었습니다')
  util.loading(false)

  data.visible = false
}

function repaint() {
  ctx.value.beginPath()
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.lineWidth = 1
  ctx.value.fillStyle = 'rgb(255, 0, 0)'
  ctx.value.strokeStyle = 'rgb(255, 0, 0)'

  ctx.value.drawImage(data.img, 0, 0, data.imgWidth * data.zoom, data.imgHeight * data.zoom)
  ctx.value.beginPath()
  
  for (let i = 0; i < data.points.length; i++) {
    let item = data.points[i]

    ctx.value.beginPath()
    
    for (let j = 0; j < item.length; j++) {
      let point = item[j]
      let x = point.x * data.zoom
      let y = point.y * data.zoom      

      if (j == 0) {
        if (data.start == false && i == data.points.length - 1) {
          ctx.value.arc(x, y, 5, 0, 2 * Math.PI)
        }

        ctx.value.moveTo(x, y)
      } else {
        ctx.value.lineTo(x, y)
      }
    }

    ctx.value.stroke()
  }
}

function clickDraw(item) {
  data.item = util.clone(item)
  
  canvas.value.width = parseInt(width(20).replace('px', ''))
  canvas.value.height = parseInt(height(70).replace('px', ''))
  
  let img = new Image()
  img.src = util.getImagePath(item.filename)
  img.onload = function() {
    data.imgWidth = img.width
    data.imgHeight = img.height

    canvas.value.width = img.width
    canvas.value.height = img.height
    
    data.img = img
    repaint()

    data.visibleDraw = true
  }  
}

function clickMouseLeft(e) {
  let margin = document.getElementById("canvas").getBoundingClientRect()  
  let x = (e.clientX - margin.x + 1) / data.zoom
  let y = (e.clientY - margin.y + 1) / data.zoom
  let point = {x:x, y:y}

  let points = util.clone(data.points)
  
  if (data.start) {
    points.push([point, point])
    
    data.start = false
  } else {
    let start = points[points.length - 1][0]

    if (Math.sqrt(Math.pow(Math.abs(start.x - x), 2) * Math.pow(Math.abs(start.y - y), 2)) < 5) {
      point = {x:start.x, y:start.y}
      data.start = true
    }

    points[points.length - 1].push(point)

    if (data.type == 1) {
      data.start = true
    }
  }

  data.points = points

  repaint()  
}

function clickMouseRight() {
  data.start = true
}

function moveMouse(e) {
  if (data.start == true) {
    return
  }
  
  let margin = document.getElementById("canvas").getBoundingClientRect()
  let x = (e.clientX - margin.x + 1) / data.zoom
  let y = (e.clientY - margin.y + 1) / data.zoom  
  let point = {x:x, y:y}

  let points = util.clone(data.points)

  points[points.length - 1][points[points.length - 1].length - 1] = point

  data.points = points
  repaint()
}

function changeType() {
  if (data.start != true) {
    let points = util.clone(data.points)
    points = points.pop()
    data.points = points
    repaint()
  }  
}

function clickZoomUp() {
  if (data.zoom >= 10.0) {
    return
  }
  
  data.zoom += 0.5

  canvas.value.width = data.imgWidth * data.zoom
  canvas.value.height = data.imgHeight * data.zoom
  
  repaint()
}

function clickZoomDown() {
  if (data.zoom <= 1.0) {
    return
  }
  
  data.zoom -= 0.5

  canvas.value.width = data.imgWidth * data.zoom
  canvas.value.height = data.imgHeight * data.zoom
  
  repaint()
}

function inputKey(e) {
  let frame = document.getElementById('canvasFrame')
  let top = frame.scrollTop
  let left = frame.scrollLeft

  let width = frame.getBoundingClientRect().width
  let height = frame.getBoundingClientRect().height

  let inc = 100 * data.zoom
  
  if (e.key == 'z') {
    clickZoomUp()
  } else if (e.key == 'x') {
    clickZoomDown()
  } else if (e.key == 'a') {
    left -= inc
    if (left <= 0) {
      left = 0
    }

    frame.scroll({
      top: top,
      left: left,
      behavior: 'smooth',
    })
  } else if (e.key == 'd') {
    left += inc
    let max = (data.imgWidth * data.zoom) - width 
    if (left >= max) {
      left = max
    }

    frame.scroll({
      top: top,
      left: left,
      behavior: 'smooth',
    })
  } else if (e.key == 'w') {
    top -= inc
    if (top <= 0) {
      top = 0
    }

    frame.scroll({
      top: top,
      left: left,
      behavior: 'smooth',
    })
  } else if (e.key == 's') {
    top += inc
    let max = (data.imgHeight * data.zoom) - height 
    if (top >= max) {
      top = max
    }

    frame.scroll({
      top: top,
      left: left,
      behavior: 'smooth',
    })
  } else if (e.key == '1') {
    data.type = 1
    data.start = true
    repaint()
  } else if (e.key == '2') {
    data.type = 2
    data.start = true
    repaint()
  } else if (e.key == '3') {
    data.type = 3
    data.start = true
    repaint()
  }
}

function clickUndo() {
}

function clickRedo() {
}
</script>
