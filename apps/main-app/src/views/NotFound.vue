<template>
  <div class="not-found">
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <el-button type="primary" @click="$router.push('/')">
      Go Home
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #6c757d;
}

.not-found h2 {
  margin-bottom: 1rem;
  color: #495057;
}

.not-found p {
  margin-bottom: 2rem;
}
</style>
