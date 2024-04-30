<template>
  <BaseHeader v-if="store.state.token != null && store.state.token != ''" />

  <div style="display:flex;">
    <AdminMenu v-if="getLevel() == 4" />
    <CheckMenu v-if="getLevel() != 4 && (data.menu == 'management' || data.menu == 'building')" />
    <div style="flex:1;">
      <div style="padding: 10px 10px;">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
const store = useStore()
const route = useRoute()

const data = reactive({
  menu: '',
})

watchEffect(() => {
  var s = route.path.split('/')

  if (s[1] == 'management') {
    /*
       if (s.length == 3) {
       data.menu = s[1]
       } else {
       data.menu = `${s[1]}/${s[2]}`
       }
     */
    data.menu = s[1]
  } else if (s[1] == 'building') {
    data.menu = s[1]
  } else {
    data.menu = s[2]
  }
})

function getLevel() {
  if (store.state.user == null || store.state.user == undefined) {
    return 0
  }

  return store.state.user.level    
}

</script>

<!-- <style>
body {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.file-uploader .file {
  width: 100px;
  height: 100px;
  display: block;
}

.file-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.file-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.file-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

</style> -->

<style lang="css">
@import '../src/assets/css/reset.css';
@import '../src/assets/css/main.css';
</style>
