<template>
  <div id="userLoginPage">
    <h1 class="title">智图协作助手 · 登录</h1>
    <h3 class="desc">企业级智能协同云图库</h3>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish">
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: 'Please enter your account！' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入用户账号" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[{ required: true, message: 'Please enter your password！' }]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码" />
      </a-form-item>

      <div class="tips">没有账号？<router-link to="/user/register">点击注册</router-link></div>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { userLoginUsingPost } from '@/api/yonghumokuaixiangguanjiekou.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = reactive<API.UserLoginDTO>({
  userAccount: '',
  userPassword: ''
});
const onFinish = async (values: any) => {
  const res = await userLoginUsingPost(values);
  if(res.data.code === 0 || res.data.data){
    await useLoginUserStore().fetchLoginUser()
    message.success("登陆成功");
    router.push({
      path: '/',
      // 登录成功后替换登录页，防止用户按 “返回” 键回到登录页。
      replace: true
    });
  }else{
    message.error("登陆失败" + res.data.message);
  }
};
</script>

<style scoped>
#userLoginPage {
  max-width: 360px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 16px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}
</style>
