# Claude Code 交接

## 当前状态

- GitHub：`https://github.com/Sentheecode/senthee-ielts`
- Web：Next.js 16，阿里云 `http://139.224.211.170:3000`
- iOS：Capacitor 8，bundle id `com.senthee.ielts`
- iOS 已改为离线优先：`native/www/` 随 App 打包，启动与基础练习不依赖服务器。
- Agent 请求：`http://139.224.211.170:3000/api/coach`，服务端调用 DeepSeek。
- 学习记录：iOS 当前保存在 localStorage；Supabase 尚未接入。

## 关键文件

- `native/www/app.js`：iOS 本地题库、页面、交互和学习记录。
- `native/www/app.css`：iPhone 布局与安全区。
- `capacitor.config.ts`：默认使用本地 `native/www`；只有显式设置 `CAPACITOR_SERVER_URL` 才切远程页面。
- `src/app/api/coach/route.ts`：Agent API 与 Capacitor CORS。
- `src/`：独立的 Next.js 网页版。
- `scripts/aliyun-deploy.sh`：旧 Docker 部署入口；当前服务器因 Snap Docker 与 Docker Hub 网络问题，实际使用 Node 22 直接运行。

## 本地验证

```bash
npm run typecheck
npm run test:run
npm run lint
npm run build
node --check native/www/app.js
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -destination 'generic/platform=iOS' CODE_SIGN_STYLE=Automatic -allowProvisioningUpdates build
```

实体机设备 ID：`AC92FA4E-5E6E-5019-B914-0EBE4F75EE8B`。安装前先确认用户手机在线且已解锁：

```bash
xcrun devicectl list devices
xcrun devicectl device install app --device AC92FA4E-5E6E-5019-B914-0EBE4F75EE8B ~/Library/Developer/Xcode/DerivedData/App-bovcgdjcexqjgreqxrgfodlqnqjp/Build/Products/Debug-iphoneos/App.app
xcrun devicectl device process launch --device AC92FA4E-5E6E-5019-B914-0EBE4F75EE8B --terminate-existing com.senthee.ielts
```

## 服务器更新

```bash
cd /opt/senthee-ielts
git pull --ff-only
npm run build
fuser -k 3000/tcp
nohup npm run start > /opt/senthee-ielts/server.log 2>&1 &
```

安全组和 UFW 均已放行 TCP 3000。当前服务不是开机自启；后续优先改为 systemd。

## 内容边界

- 用户拥有 Cambridge IELTS 书，但仓库不应复制或公开分发书中受版权保护的题文与音频。
- App 内置的是原创考试格式练习、词块，以及 Cambridge 答案/错题记录器。
- 可继续接入 IELTS 官方公开样题和明确允许再利用的开放材料，必须保留来源与许可说明。

## 下一批优先事项

1. 扩充离线题库并把题目数据从 `app.js` 拆到版本化 JSON；加入题目 ID、难度、技能、答案、解析和来源字段。
2. 加入听力音频缓存/下载，而不是只用系统 TTS。
3. 将 iOS localStorage 数据同步到新 Supabase 项目，保留离线队列和冲突策略。
4. Agent 读取最近练习、错因和词汇掌握情况，给固定下一组任务。
5. 用 systemd 托管阿里云服务，并配置域名、HTTPS、反向代理；App 再移除临时任意 HTTP 放行。

## 给 Claude Code 的首条提示词

阅读根目录 `AGENTS.md`、本文件和 Obsidian 中 IELTS 学习系统的每日概览/问题记录。不要推翻离线优先架构。先运行现有验证命令并检查 git 状态，然后继续把 `native/www/app.js` 的题库拆成可测试的 JSON 数据模块，保持首页、分科练习、真题记录、词库、Agent 五个入口可用。新增内容必须有明确来源字段；不要复制 Cambridge 书的题文或音频。完成后在 393×852 视口验证阅读作答、听力播放、写作提交、词汇复习、真题记录和 Agent 请求，并更新 Obsidian 记录。
