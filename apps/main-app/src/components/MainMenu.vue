<template>
  <el-menu
    ref="innerMenuRef"
    :default-active="activeIndex"
    mode="horizontal"
    class="main-nav"
    @select="onSelect"
  >
    <el-sub-menu
      v-for="group in menuData"
      :key="group.title"
      :index="group.title"
    >
      <template #title>
        <span>{{ group.title }}</span>
      </template>

      <template v-for="item in group.children" :key="item.title">
        <el-menu-item
          v-if="!item.children || item.children.length === 0"
          :index="
            (item.name ? item.name : item.moduleUrl) +
            ':' +
            (item.path ? item.path : item.moduleUrl)
          "
        >
          {{ item.title }}
        </el-menu-item>

        <el-sub-menu v-else :index="item.title">
          <template #title>{{ item.title }}</template>

          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.title"
            :index="
              (subItem.name ? subItem.name : subItem.moduleUrl) +
              ':' +
              (subItem.path ? subItem.path : subItem.moduleUrl)
            "
          >
            {{ subItem.title }}
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from "vue";
import type { MenuGroup } from "../config/menu";

const props = defineProps<{
  menuData: MenuGroup[];
  activeIndex: string;
}>();

const emit = defineEmits<{ (e: "select", index: string): void }>();

const innerMenuRef = ref<any>(null);

const onSelect = (index: string) => {
  emit("select", index);
};

defineExpose({
  updateActiveIndex: (index: string) => {
    innerMenuRef.value?.updateActiveIndex?.(index);
  },
});
</script>

<style scoped>
.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  background: transparent !important;
  border-bottom: none !important;
}

.main-nav :deep(.el-menu) {
  background: transparent !important;
  border-bottom: none !important;
}

.main-nav :deep(.el-menu-item),
.main-nav :deep(.el-sub-menu__title) {
  color: white !important;
}

.main-nav :deep(.el-menu-item:hover),
.main-nav :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #3498db !important;
}

.main-nav :deep(.el-menu-item.is-active) {
  background-color: #3498db !important;
  color: white !important;
}
</style>
