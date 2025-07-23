<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';
import GlobalSider from '@/components/GlobalSider.vue'; // 引入 GlobalSider 组件
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header :style="headerStyle" class="header">
        <GlobalHeader></GlobalHeader>
      </a-layout-header>

      <a-layout class="sider-content-wrapper">
        <GlobalSider></GlobalSider>

        <a-layout-content :style="contentStyle" class="content">
          <router-view/>
        </a-layout-content>
      </a-layout>

      <a-layout-footer :style="footerStyle" class="footer">
        <a href="https://www.doubao.com" target="_blank">豆包</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
  min-height: 100vh; /* 确保整个布局占满视口高度 */
  display: flex; /* 使用 flex 布局让子元素垂直排列 */
  flex-direction: column; /* 确保 Header -> (Sider+Content) -> Footer 的垂直顺序 */
}

/* 头部样式 */
#basicLayout .header {
  background: white;
  padding-inline: 20px; /* Ant Design 默认的内边距，保持不变 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 增加阴影，使头部更具层次感 */
  z-index: 10; /* 确保头部在最上层 */
  height: 64px; /* 显式设置头部高度，Ant Design 默认值 */
  line-height: 64px; /* 使头部内容垂直居中 */
}

/* 侧边栏和内容区域的组合布局样式 */
/* 这个类应用于中间的 a-layout，使其占据头部和底部之间的所有空间 */
.sider-content-wrapper {
  flex: 1; /* 占据父容器（a-layout）中除头部和底部外的所有可用垂直空间 */
}

/* 内容区域样式 */
#basicLayout .content {
  padding: 30px; /* 保持原有的内边距 */
  margin-bottom: 28px; /* 为固定底部的 Footer 留出空间 */
  background: #f0f2f5; /* 添加一个浅灰色背景，让内容区更显眼和舒适 */
  flex: 1; /* 让内容区域横向占据剩余的所有空间（相对于侧边栏） */
  overflow-y: auto; /* 允许内容区内部滚动 */
}

/* 底部样式 */
#basicLayout .footer {
  background: #efefef;
  padding: 20px;
  position: fixed; /* 固定在底部 */
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08); /* 底部上方添加阴影 */
  z-index: 9; /* 确保底部在内容之上 */
}

/* 针对 GlobalSider 的额外样式，如果需要 */
/* 由于 GlobalSider 本身没有 scoped 样式，或者其内部样式可能不足，可以在这里补充 */
/* 例如，让侧边栏看起来更融入整体布局 */
/* 你可以在 GlobalSider.vue 内部添加这些样式，如果其 <style scoped> 标签允许 */
/*
#globalSider .sider {
  background: #001529; // Ant Design 侧边栏默认深色背景
  box-shadow: 2px 0 8px rgba(0,0,0,0.08); // 右侧阴影
}
*/
</style>
