<template>
  <div class="container">
    <div class="item">
      <HelloWorld v-bind="fetchAdapterProps" />
    </div>
    <div class="item border-left">
      <HelloWorld v-bind="axiosAdapterProps" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue";
import {
  axiosLogin,
  axiosMaybe401,
  fetchLogin,
  fetchMaybe401,
} from "./api/service";

const fetchAdapterProps = {
  title: "使用 Fetch Adapter",
  loginMethod: fetchLogin,
  maybe401Method: fetchMaybe401,
};

const axiosAdapterProps = {
  title: "使用 Axios Adapter",
  loginMethod: axiosLogin,
  maybe401Method: axiosMaybe401,
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
}
.container .border-left {
  border-left: 1px solid #ccc;
}
.container .item {
  flex: 1;
}
</style>
