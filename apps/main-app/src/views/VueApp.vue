<template>
  <div id="micro-content">
    <micro-app
      name="vue-app"
      url="http://localhost:7102"
      baseroute="/vue/*"
      iframe
      ssr
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
// Vue sub-application view
</script>

<style scoped>
#micro-content {
  height: 100%;
  width: 100%;
}

micro-app {
  height: 100%;
  width: 100%;
}
</style>
