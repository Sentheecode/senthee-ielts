# IELTS 7 · 个人学习 Agent

面向中国在职学习者的 IELTS General Training PWA。当前版本包含学习贡献图、按可用时长选任务、每日学习 diff、阅读/写作/口语练习、个人词块、DeepSeek 教练接口和本地数据导出。

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

1. 将仓库导入 Vercel。
2. 在项目 Environment Variables 中添加新的 `DEEPSEEK_API_KEY`。
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

## 数据与材料

- 学习记录当前保存在浏览器 `localStorage`，可从首页“今日学习 diff”区域导出 JSON。
- 清理浏览器数据会删除本机记录，请定期导出。
- 官方样题通过外链访问；内置示例均标记为 AI 原创，不冒充真题。
- 下一阶段可把本地仓储接口替换为 Supabase，实现多设备同步而不改动主要页面流程。

## DeepSeek 接口

服务端使用 OpenAI 兼容的 `https://api.deepseek.com/chat/completions`，默认模型为 `deepseek-v4-flash`。接口限制单次内容不超过 12,000 字符，并在超时、余额不足或未配置密钥时返回标记清晰的离线反馈。
