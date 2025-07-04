<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue';
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header :style="headerStyle" class="header">
        <GlobalHeader></GlobalHeader>
      </a-layout-header>
      <a-layout-content :style="contentStyle" class="content">
        <router-view/>
      </a-layout-content>
      <a-layout-footer :style="footerStyle" class="footer">
        <a href="https://www.doubao.com" target="_blank">豆包</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {

}
#basicLayout .footer{
  background: #efefef;
  padding: 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
#basicLayout .content{
  padding: 30px;
  margin-bottom: 28px;
}
#basicLayout .header{
  background: white;
  padding-inline: 20px;
}
</style>
