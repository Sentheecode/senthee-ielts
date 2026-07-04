import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? "https://ielts-green.vercel.app";

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
