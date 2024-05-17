<template>
  <section class="test">
    <div id="map"></div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

const data = reactive({
  map: null,
  markers: [],
  latitude: 0,
  longitude: 0,
})

const props = defineProps({
  positions: Array<Array<number>>,
})

onMounted(async () => {
  if (!('geolocation' in navigator)) {
    return
  }
  const key = import.meta.env.VITE_KAKAOMAP_KEY

  // get position 나의 위치
  navigator.geolocation.getCurrentPosition(
    pos => {
      data.latitude = pos.coords.latitude
      data.longitude = pos.coords.longitude

      if (window.kakao && window.kakao.maps) {
        initMap()
      } else {
        const script = document.createElement('script')
        /* global kakao */
        script.onload = () => kakao.maps.load(initMap)
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${key}`
        document.head.appendChild(script)
      }
    },
    err => {
      alert(err.message)
    }
  )
})

function initMap() {
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 1,
  }
  data.map = new kakao.maps.Map(container, options)
  // displayMarker([[data.latitude, data.longitude]])
  displayMarker(props.positions)
}

//markerPositions <- 위도 경도 2차원 배열로 넣어주면 됨
function displayMarker(markerPositions) {
  if (data.markers.length > 0) {
    data.markers.forEach(marker => marker.setMap(null))
  }

  const positions = markerPositions.map(position => new kakao.maps.LatLng(...position))

  if (positions.length > 0) {
    data.markers = positions.map(
      position =>
        new kakao.maps.Marker({
          map: data.map,
          position,
        })
    )

    const bounds = positions.reduce((bounds, latlng) => bounds.extend(latlng), new kakao.maps.LatLngBounds())

    data.map.setBounds(bounds)
  }
}
</script>

<style scoped>
.test {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#map {
  width: 100%;
  height: 500px;
  border: 1px #a8a8a8 solid;
}
</style>
