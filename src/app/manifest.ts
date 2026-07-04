import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Senthee IELTS",
    short_name: "Senthee IELTS",
    description: "Senthee 的 IELTS 学习记录",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071b49",
    orientation: "portrait-primary",
    lang: "zh-CN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
