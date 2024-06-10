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
  geocoder: null,
  position: [],
})

const props = defineProps({
  positions: Array,
  positionName: Array,
})

onMounted(async () => {
  if (!('geolocation' in navigator)) {
    return
  }
  const key = import.meta.env.VITE_KAKAOMAP_KEY

  // get position 나의 위치
  navigator.geolocation.getCurrentPosition(
    async pos => {
      data.latitude = pos.coords.latitude
      data.longitude = pos.coords.longitude

      if (window.kakao && window.kakao.maps) {
        await loadPositions()
        initMap()
      } else {
        const script = document.createElement('script')
        script.onload = async () => {
          kakao.maps.load(async () => {
            await loadPositions()
            initMap()
          })
        }
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${key}&libraries=services`
        document.head.appendChild(script)
      }
    },
    err => {
      alert(err.message)
    }
  )
})

async function loadPositions() {
  const geocoder = new kakao.maps.services.Geocoder()
  const positionPromises = props.positionName.map(name => searchMap(name, geocoder))
  const positions = await Promise.all(positionPromises)
  // Filter out any null results
  data.position = positions.filter(position => position !== null)
}

async function searchMap(address, geocoder) {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve([parseFloat(result[0].y), parseFloat(result[0].x)])
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        resolve(null) // No result found for the address
      } else {
        reject(new Error(`Failed to search address: ${address}`))
      }
    })
  })
}

function initMap() {
  const container = document.getElementById('map')
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 1,
  }
  data.map = new kakao.maps.Map(container, options)

  displayMarker(data.position)
}

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
