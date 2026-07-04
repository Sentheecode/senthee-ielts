# 阿里云 PM2 部署

适合你的当前操作方式：服务器直接从 GitHub 拉代码，安装依赖，构建，再用 PM2 常驻。

## 服务器准备

```bash
# Node 22，推荐用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

npm i -g pm2
```

如果服务器无法访问 GitHub 或 npm 很慢，可以先配置代理或 npm 镜像。

## 首次部署

```bash
cd /opt
git clone <你的 GitHub 仓库 URL> senthee-ielts
cd senthee-ielts

cp .env.example .env.local
vim .env.local
# 填轮换后的 DEEPSEEK_API_KEY；不填也能用离线 Agent

npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

也可以直接用脚本：

```bash
bash scripts/server-update-pm2.sh
```

访问：

```text
http://服务器公网IP:3000
```

阿里云安全组需要开放 `3000/tcp`。正式使用建议绑定域名并用 Nginx/Caddy 做 HTTPS。

## 更新部署

```bash
cd /opt/senthee-ielts
git pull
bash scripts/server-update-pm2.sh
```

## 查看状态和日志

```bash
pm2 status
pm2 logs senthee-ielts
```

## iPhone App 壳后端地址

如果用 Capacitor iOS 壳指向阿里云：

```bash
CAPACITOR_SERVER_URL=http://服务器公网IP:3000 npx cap sync ios
open ios/App/App.xcworkspace
```

iOS 更推荐 HTTPS 域名；纯 HTTP 可能受到系统安全策略限制。
