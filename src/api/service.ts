import { alovaAxiosInst, alovaFetchInst } from "@/api";
import * as tokenManager from "@/api/tokenManager";

export function fetchLogin() {
  const method = alovaFetchInst.Post("/api/login");
  method.meta = {
    authRole: "login",
  };
  return method;
}

export function fetchRefreshAccessToken() {
  const refreshToken = tokenManager.getRefreshToken();
  const method = alovaFetchInst.Get("/api/refresh_access_token", {
    params: {
      refreshToken,
    },
  });
  method.meta = {
    authRole: "refreshToken",
  };
  return method;
}

export function fetchMaybe401() {
  return alovaFetchInst.Get("/api/maybe401");
}

//--------------------------//

export function axiosLogin() {
  const method = alovaAxiosInst.Post("/api/login");
  method.meta = {
    authRole: "login",
  };
  return method;
}

export function axiosRefreshAccessToken() {
  const refreshToken = tokenManager.getRefreshToken();
  const method = alovaFetchInst.Get("/api/refresh_access_token", {
    params: {
      refreshToken,
    },
  });
  return method;
}

export function axiosMaybe401() {
  return alovaAxiosInst.Get("/api/maybe401");
}
