import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? "http://139.224.211.170:3000";

const config: CapacitorConfig = {
  appId: "com.senthee.ielts",
  appName: "Senthee IELTS",
  webDir: "native/www",
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith("http://"),
  },
  ios: {
    scheme: "App",
    preferredContentMode: "mobile",
    scrollEnabled: true,
  },
};

export default config;
