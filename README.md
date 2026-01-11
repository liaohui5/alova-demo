## 说明

复现 alova 使用 axiosAdapter 无法触发 自动刷新 token 的问题

## 启动

```sh
git clone https://github.com/liaohui5/alova-demo.git
cd alova-demo
pnpm install

# client
pnpm run dev

# server
pnpm run start
```

## 服务端

- 代码在: `/server.js`

## 客户端

- 实例化 alova 在: `/src/api/index.ts`
- 具体接口: `/src/api/service.ts`
- 调用接口: `/src/App.vue` 和 `/src/components/HelloWorld.vue`
