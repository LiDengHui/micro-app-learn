<template>
  <div id="micro-content">
    <micro-app
      name="vue-users-app"
      url="http://localhost:7102/users"
      baseroute="/vue"
    ></micro-app>
  </div>
</template>

<script setup lang="ts">
// Vue Users sub-application view
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
