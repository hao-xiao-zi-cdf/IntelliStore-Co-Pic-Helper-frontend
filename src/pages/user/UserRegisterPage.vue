<template>
  <div id="userRegisterPage">
    <h1 class="title">智图协作助手 · 注册</h1>
    <h3 class="desc">企业级智能协同云图库</h3>
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="onFinish"
    >
      <a-form-item
        name="userAccount"
        :rules="[{ required: true, message: 'Please input your account!' }]"
      >
        <a-input v-model:value="formState.userAccount" placeholder="请输入用户账号">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入用户密码">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        name="checkPassword"
        :rules="[{ required: true, message: 'Please input again your password!' }]"
      >
        <a-input-password v-model:value="formState.checkPassword" placeholder="请重新输入密码">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="tips">已有账号？<router-link to="/user/login">点击登录</router-link></div>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button" style="width: 100%">
          点击注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { userRegisterUsingPost } from '@/api/yonghumokuaixiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import router from '@/router'

const formState = reactive<API.UserRegisterDTO>({
  checkPassword: '',
  userAccount: '',
  userPassword: ''
});
const onFinish = async (values: any) => {
  const res = await userRegisterUsingPost(values);
  if(res.data.code === 200 && res.data.data ){
    message.success("注册成功");
    router.push({
      path: '/',
      replace: true
    })
  }else{
    message.error("注册失败: " + res.data.message);
  }
};

const disabled = computed(() => {
  return !(formState.userAccount && formState.userPassword && formState.checkPassword);
});
</script>
<style scoped>
#userRegisterPage {
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
