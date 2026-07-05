import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.senthee.ielts",
  appName: "Senthee IELTS",
  webDir: "native/www",
  ...(serverUrl
    ? { server: { url: serverUrl, cleartext: serverUrl.startsWith("http://") } }
    : {}),
  ios: {
    scheme: "App",
    preferredContentMode: "mobile",
    contentInset: "never",
    scrollEnabled: true,
  },
};

export default config;
