<template>
  <h2>{{ props.title }}</h2>
  <button @click="login">登录</button>
  <button @click="maybe401">发送可能会 401 的请求</button>
</template>

<script lang="ts" setup>
import * as tokenManager from "@/api/tokenManager";
import { useRequest } from "alova/client";

const props = defineProps<{
  title: "";
  loginMethod: any;
  maybe401Method: any;
}>();

// 登录: 保存 accessToken 和 refreshToken
const { send: login, data: loginData } = useRequest(() => props.loginMethod(), {
  immediate: false,
})
  .onError((alovaInst) => {
    console.log("登录失败", alovaInst.error.message);
  })
  .onSuccess(() => {
    console.log("登录成功");
    tokenManager.saveAccessToken(loginData.value.accessToken);
    tokenManager.saveRefreshToken(loginData.value.refreshToken);
  });

// 发送可能会 401 的请求
const { send: maybe401 } = useRequest(() => props.maybe401Method(), {
  immediate: false,
})
  .onError((alovaInst) => {
    console.log("maybe 401 error", alovaInst.error.message);
  })
  .onSuccess((alovaInst) => {
    console.log("maybe 401 success", alovaInst.data);
  });
</script>
