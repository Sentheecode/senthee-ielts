# 阿里云国内部署

Vercel 在国内访问经常慢或需要 VPN。日常学习 App 建议放到国内服务器或国内 CDN。

当前最稳路线：阿里云 ECS 跑 Docker 版 Next.js。

## 服务器要求

- 2C2G / 3M 带宽可以跑。
- 模型推理走 DeepSeek API，本机不跑大模型。
- 建议开放安全组：`3000/tcp` 临时测试；正式使用再用 Nginx/Caddy 反代到 80/443。

## 部署命令

在服务器上安装 Docker 后，把项目目录复制到 `/opt/senthee-ielts`，然后：

```bash
cd /opt/senthee-ielts
cp .env.example .env
# 编辑 .env，填轮换后的 DEEPSEEK_API_KEY；没有 Key 也能离线使用
bash scripts/aliyun-deploy.sh
```

如果项目已经在服务器上，以后更新可以：

```bash
cd /opt/senthee-ielts
git pull
bash scripts/server-update-docker.sh
```

访问：

```text
http://服务器公网IP:3000
```

iPhone Safari 打开后，点“分享 → 添加到主屏幕”。

## 不想折腾 Docker

可以直接：

```bash
npm ci
npm run build
PORT=3000 npm run start
```

但长期运行建议用 Docker 或 systemd/pm2 托管。

## 后续建议

- 绑定域名并启用 HTTPS，否则 iOS PWA、麦克风等能力可能受限。
- 如果 3M 带宽首屏仍慢，再把静态资源挂到阿里云 OSS/CDN。
