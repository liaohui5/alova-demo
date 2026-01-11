import { axiosRequestAdapter } from "@alova/adapter-axios";
import { createAlova } from "alova";
import { createServerTokenAuthentication } from "alova/client";
import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";
import * as tokenManager from "@/api/tokenManager";
import { axiosRefreshAccessToken, fetchRefreshAccessToken } from "./service";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL;

// 发送请求自动添加 bearer token
function withBearerToken(config: any) {
  if (tokenManager.hasAccessToken()) {
    config.headers = Object.assign({}, config.headers, {
      Authorization: tokenManager.getBearerToken(),
    });
  }
}

// 使用 fetch 发送请求
function createAlovaWithFetch() {
  // 自动刷新 token, 详情查看文档
  // https://alova.js.org/zh-CN/tutorial/client/strategy/token-authentication
  const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
    refreshTokenOnSuccess: {
      isExpired: (res) => {
        return res.status === 401;
      },
      handler: async () => {
        try {
          alert("服务端返回 401, 触发刷新 accessToken");
          const res = await fetchRefreshAccessToken();

          /* @ts-ignore */
          tokenManager.saveAccessToken(res.accessToken);
        } catch (e) {
          alert("refreshToken 过期, 请重新登录");
          throw e;
        }
      },
    },
    assignToken: (alovaInst) => {
      withBearerToken(alovaInst.config);
    },
  });

  return createAlova({
    baseURL,
    statesHook: vueHook,
    cacheFor: null, // 禁止缓存
    requestAdapter: adapterFetch(),
    beforeRequest: onAuthRequired(),
    responded: onResponseRefreshToken(async (res) => {
      const body = await res.json();
      return body;
    }),
  });
}

// 使用 axios 发送请求
function createAlovaWithAxios() {
  const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
    refreshTokenOnSuccess: {
      isExpired: (res) => {
        return res.status === 401;
      },
      handler: async () => {
        try {
          alert("服务端返回 401, 触发刷新 accessToken");
          const res = await axiosRefreshAccessToken(); // 这一行不一样

          /* @ts-ignore */
          tokenManager.saveAccessToken(res.accessToken);
        } catch (e) {
          alert("refreshToken 过期, 请重新登录");
          throw e;
        }
      },
    },
    assignToken: (alovaInst) => {
      withBearerToken(alovaInst.config);
    },
  });

  return createAlova({
    baseURL,
    statesHook: vueHook,
    cacheFor: null, // 禁止缓存
    /* @ts-ignore */
    requestAdapter: axiosRequestAdapter(),
    /* @ts-ignore */
    beforeRequest: onAuthRequired(),
    /* @ts-ignore */
    responded: onResponseRefreshToken((res: any) => {
      return res.data; // 这一行不一样
    }),
  });
}

// 创建两个实例
export const alovaFetchInst = createAlovaWithFetch();
export const alovaAxiosInst = createAlovaWithAxios();
