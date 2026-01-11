import express from "express";
import cors from "cors";
import { Buffer } from "node:buffer";

const app = express();
app.use(cors());

// 模拟创建 jwt => { exp: xxx } -> base64 string
function createTokenWithExp(seconds) {
  const exp = Date.now() + seconds * 1000;
  const str = JSON.stringify({ exp });
  return Buffer.from(str, "utf8").toString("base64");
}

// 解码 token => base64 string -> JSON.parse('{"exp": xxx}')
function tokenDecode(token) {
  const str = Buffer.from(token, "base64").toString("utf8");
  return JSON.parse(str);
}

// 判断 token 是否过期
function tokenExpired(token) {
  try {
    const now = Date.now();
    const exp = tokenDecode(token).exp;
    return now > exp;
  } catch (e) {
    console.error("[tokenExpired]", e);
    return true;
  }
}

// 1.登录接口
app.post("/api/login", (_req, res) => {
  return res.status(200).json({
    id: "1",
    name: "admin",
    email: "admin@example.com",
    accessToken: createTokenWithExp(5), // 5s
    refreshToken: createTokenWithExp(5 * Math.pow(60, 2)), // 5h
  });
});

// 2.刷新 accessToken 接口
app.get("/api/refresh_access_token", (req, res) => {
  if (!req.query.refreshToken) {
    res.status(401).send("Unauthorized or refreshToken expired");
  }
  const refreshToken = req.query.refreshToken;
  if (tokenExpired(refreshToken)) {
    res.status(401).send("refreshToken expired, please login again");
  }
  return res.status(200).json({
    accessToken: createTokenWithExp(10), // 10s
  });
});

// 3.检测 token 中间件
function auth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized");
  }

  const accessToken = req.headers.authorization.slice(7);
  if (tokenExpired(accessToken)) {
    res.status(401).send("Unauthorized, accessToken expired");
  }

  next();
}

// 4.可能响应 401 的接口
// 因为会检测 header, 如果 header 中的 token 过期则会响应 401
app.get("/api/maybe401", auth, (_req, res) => {
  return res.status(200).json({
    data: "success",
  });
});

app.listen(3000, () => {
  console.log(">>> server started: http://localhost:3000");
});
