# Senthee IELTS

Senthee 的 IELTS 学习记录 App。学习贡献图、连续天数、每日 diff 都只来自真实学习动作，不包含演示进度。

## 当前部署与数据口径

- 线上地址：`https://ielts-green.vercel.app`
- 后端：部署在 Vercel 的 Next.js API Route，当前用于 `/api/coach` 调 DeepSeek。
- 数据：学习记录保存在当前设备浏览器的 `localStorage`，首页可导出 JSON。
- Supabase：今晚不需要登录。后续要做 iPhone / 安卓 / 电脑多端同步时，再把本地仓储替换成 Supabase。
- Supabase 准备文件：新项目建好后可运行 `docs/supabase/schema.sql`，再配置 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- App 化：iPhone 用 Safari 打开线上地址，点“分享 → 添加到主屏幕”，之后从桌面图标 `Senthee IELTS` 打开，不需要从浏览器标签页进入。
- 国内访问：Vercel 在国内可能慢或需要 VPN；日常使用建议按 `docs/deploy/aliyun.md` 部署到阿里云 ECS。
- 如果不用 Docker，可按 `docs/deploy/pm2.md` 从 GitHub 拉代码并用 PM2 常驻运行。
- iOS 原生壳：已加入 Capacitor 工程，见 `docs/mobile/ios-capacitor.md`。

## 本地运行

需要 Node.js 22+。

```bash
npm install
cp .env.example .env.local
npm run dev -- --hostname 0.0.0.0
```

电脑访问 `http://localhost:3000`。同一 Wi-Fi 下的 iPhone 访问 `http://电脑局域网IP:3000`。iPhone Safari 中点击“分享 → 添加到主屏幕”即可安装 PWA；正式部署到 HTTPS 后离线缓存与麦克风能力最稳定。

不配置 `DEEPSEEK_API_KEY` 时，Agent 会明确使用离线建议，其他学习功能照常工作。密钥只能放在服务器环境变量中，不能放在浏览器代码或 Git。

## 验证

```bash
npm run test:run
npm run typecheck
npm run lint
npm run build
npm run e2e
```

## Vercel 部署

1. 将仓库导入 Vercel，或用 `npx vercel deploy --prod` 直接部署。
2. 在项目 Environment Variables 中添加轮换后的 `DEEPSEEK_API_KEY`。
3. 可选添加 `DEEPSEEK_MODEL=deepseek-v4-flash`。
4. 部署后在 iPhone Safari 打开 HTTPS 地址并添加到主屏幕。

GitHub Pages 只能托管纯静态页面，无法安全保存 DeepSeek Key 或运行 `/api/coach`，因此不作为完整版本的首选部署方式。

## 阿里云 2C2G 部署

这台配置足以运行本应用，因为模型推理由 DeepSeek API 完成。服务器无需安装 Pi、Hermes 或 OpenClaw。

```bash
cp .env.example .env
# 在 .env 中填写新生成的 DEEPSEEK_API_KEY
docker compose up -d --build
```

容器监听 3000 端口。生产环境建议在前面配置 Caddy 或 Nginx，绑定域名并启用 HTTPS。口语音频当前只在浏览器中回放，不上传服务器；后续若长期保存，建议直传阿里云 OSS。

更详细的国内部署说明见 [`docs/deploy/aliyun.md`](docs/deploy/aliyun.md)。

如果你打算在服务器上 `git pull + npm ci + pm2`，直接看 [`docs/deploy/pm2.md`](docs/deploy/pm2.md)。

服务器手动更新可以二选一：

```bash
# PM2
git pull && bash scripts/server-update-pm2.sh

# Docker
git pull && bash scripts/server-update-docker.sh
```

## 数据与材料

- 学习记录当前保存在浏览器 `localStorage`，可从首页“今日学习 diff”区域导出 JSON。
- 已接入真实记录的动作：首页任务完成、阅读检查、写作提交、词库复习。
- 真题页只保存书名、Test、部分、答题卡、错题号和订正记录；不内置官方题干、阅读文章或音频。
- 清理浏览器数据会删除本机记录，请定期导出。
- 官方样题通过外链访问；内置练习只作为日常训练使用，不冒充真题。
- 下一阶段可把本地仓储接口替换为 Supabase，实现多设备同步而不改动主要页面流程。

## DeepSeek 接口

服务端使用 OpenAI 兼容的 `https://api.deepseek.com/chat/completions`，默认模型为 `deepseek-v4-flash`。接口限制单次内容不超过 12,000 字符，并在超时、余额不足或未配置密钥时返回标记清晰的离线反馈。
