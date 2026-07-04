module.exports = {
  apps: [
    {
      name: "senthee-ielts",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3000",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        DEEPSEEK_MODEL: "deepseek-v4-flash",
      },
    },
  ],
};
