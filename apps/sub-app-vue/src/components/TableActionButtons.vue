<template>
  <div class="table-action-buttons">
    <!-- 显示前几个按钮 -->
    <template
      v-for="(button, index) in visibleButtons"
      :key="`visible-${index}`"
    >
      <component :is="button" />
    </template>

    <!-- 下拉菜单按钮 -->
    <el-dropdown v-if="hasDropdownButtons" @command="handleDropdownCommand">
      <el-button type="primary" size="small">
        更多操作
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(button, index) in dropdownButtons"
            :key="`dropdown-${index}`"
            :command="`button-${index + maxVisible}`"
          >
            <span class="dropdown-button-text">{{
              getButtonText(button)
            }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import type { VNode } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

interface Props {
  maxVisible?: number; // 最大可见按钮数量，默认为2
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 2,
});

const slots = useSlots();

// 获取默认插槽中的所有按钮
const allButtons = computed(() => {
  if (!slots.default) return [];

  const children = slots.default();
  if (!Array.isArray(children)) return [children];

  // 递归提取所有有效的按钮节点
  const extractButtons = (nodes: any[]): VNode[] => {
    const buttons: VNode[] = [];

    if (import.meta.env.DEV) {
      console.log("=== 提取按钮节点调试信息 ===");
      console.log("传入的nodes:", nodes);
    }

    for (const node of nodes) {
      if (!node) continue;

      if (import.meta.env.DEV) {
        console.log("处理node:", node);
        console.log("node.type:", node.type);
        console.log("node.children:", node.children);
      }

      if (typeof node === "object" && "type" in node) {
        // 检查是否是 el-button 组件
        if (
          node.type &&
          (node.type.name === "ElButton" ||
            node.type.__name === "ElButton" ||
            (typeof node.type === "object" && node.type.name === "ElButton"))
        ) {
          buttons.push(node);
        }
        // 检查是否是 Fragment 或其他容器节点
        else if (node.children && Array.isArray(node.children)) {
          buttons.push(...extractButtons(node.children));
        }
        // 检查是否是条件渲染节点
        else if (node.type && typeof node.type === "symbol") {
          // Fragment 节点，继续递归查找
          if (node.children && Array.isArray(node.children)) {
            buttons.push(...extractButtons(node.children));
          }
        }
      }
    }

    return buttons;
  };

  return extractButtons(children);
});

// 计算可见的按钮
const visibleButtons = computed(() => {
  return allButtons.value.slice(0, props.maxVisible);
});

// 计算需要放入下拉菜单的按钮
const dropdownButtons = computed(() => {
  return allButtons.value.slice(props.maxVisible);
});

// 是否有下拉菜单
const hasDropdownButtons = computed(() => {
  return dropdownButtons.value.length > 0;
});

// 获取按钮文本
const getButtonText = (button: VNode): string => {
  // 递归提取文本内容
  const extractText = (node: any): string => {
    // 处理字符串文本
    if (typeof node === "string") {
      return node.trim();
    }

    // 处理数组节点
    if (Array.isArray(node)) {
      return node.map(extractText).filter(Boolean).join(" ");
    }

    // 处理对象节点
    if (node && typeof node === "object") {
      // 跳过非显示的节点（如注释节点）
      if (node.type && typeof node.type === "symbol") {
        // Fragment 或注释节点，检查 children
        if (node.children) {
          return extractText(node.children);
        }
        return "";
      }

      // 处理 VNode 的 children
      if (node.children) {
        // 如果 children 是函数（插槽），尝试执行它
        if (typeof node.children === "function") {
          try {
            const slotContent = node.children();
            return extractText(slotContent);
          } catch (e) {
            // 忽略插槽执行错误
          }
        }
        // 如果 children 是对象且有 default 插槽
        else if (typeof node.children === "object" && node.children.default) {
          if (typeof node.children.default === "function") {
            try {
              const slotContent = node.children.default();
              return extractText(slotContent);
            } catch (e) {
              // 忽略插槽执行错误
            }
          } else {
            return extractText(node.children.default);
          }
        }
        // 其他情况直接处理 children
        else {
          return extractText(node.children);
        }
      }
    }

    return "";
  };

  try {
    const text = extractText(button);

    // 调试信息（仅在开发环境下）
    if (import.meta.env.DEV) {
      console.log("=== 按钮VNode调试信息 ===");
      console.log("VNode:", button);
      console.log("VNode.type:", button.type);
      console.log("VNode.props:", button.props);
      console.log("VNode.children:", button.children);
      console.log("提取的文本:", text);
      console.log("========================");
    }

    return text || "操作";
  } catch (error) {
    console.warn("提取按钮文本时出错:", error);
    return "操作";
  }
};

// 处理下拉菜单命令
const handleDropdownCommand = (command: string) => {
  // 从命令中提取按钮索引
  const buttonIndex = parseInt(command.replace("button-", ""));
  const actualIndex = buttonIndex - props.maxVisible;

  if (actualIndex >= 0 && actualIndex < dropdownButtons.value.length) {
    const button = dropdownButtons.value[actualIndex];
    // 触发按钮的点击事件
    if (button && typeof button === "object" && "props" in button) {
      const props = button.props;
      if (props && typeof props.onClick === "function") {
        props.onClick();
      }
    }
  }
};
</script>

<style scoped>
.table-action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.table-action-buttons .el-button {
  margin: 0;
}

/* 下拉菜单中的按钮样式 */
:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-button-text {
  display: block;
  width: 100%;
  text-align: left;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
}
</style>
