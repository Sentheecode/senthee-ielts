import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Senthee IELTS 7 · 学习 Agent",
    short_name: "Senthee IELTS",
    description: "为中国学习者设计的 IELTS General Training 私人学习系统",
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
