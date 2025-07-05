import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/api/yonghumokuaixiangguanjiekou.ts'

export const useLoginUserStore =
  defineStore('loginUser', () => {
    // 定义用户登录信息
    const loginUser = ref<any>({
      userName: "未登录",
    })

    async function fetchLoginUser() {
      // 获取登录用户信息
      const res = await getLoginUserUsingGet();
      if(res.data.code === 200 && res.data.data){
        loginUser.value = res.data.data;
      }
    }

    function setLoginUser(newLoginUser: any) {
      loginUser.value = newLoginUser;
    }

    return { loginUser, fetchLoginUser, setLoginUser}
  })
