# iOS App 壳（Capacitor）

当前 iOS App 方案不是 React Native 重写，而是 Capacitor 封装现有 Next/React 应用。

优点：

- 不重写 UI，现有 TypeScript/React 代码继续用。
- 可以安装到 iPhone，入口像 App。
- 后端地址可切换：先用 Vercel，阿里云部署好后改成阿里云。

## 默认配置

- App 名：`Senthee IELTS`
- Bundle ID：`com.senthee.ielts`
- 默认地址：`http://139.224.211.170:3000`
- 当前为了直接连接公网 IP，iOS 临时允许 HTTP；绑定域名并启用 HTTPS 后应移除此例外。

配置文件：`capacitor.config.ts`

## 改成阿里云后端

如果你的阿里云访问地址是：

```text
http://服务器公网IP:3000
```

同步 iOS 工程：

```bash
CAPACITOR_SERVER_URL=http://服务器公网IP:3000 npm run cap:sync:ios
```

更推荐绑定 HTTPS 域名：

```bash
CAPACITOR_SERVER_URL=https://ielts.your-domain.com npm run cap:sync:ios
```

## 打开 Xcode

```bash
npm run ios:open
```

然后选择你的 iPhone 16 Pro，点 Run。

真机安装通常需要：

- Apple ID 登录 Xcode；
- Signing & Capabilities 里选择 Team；
- iPhone 信任开发者证书。

## 验证

已通过：

```bash
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination 'generic/platform=iOS Simulator' build
```
