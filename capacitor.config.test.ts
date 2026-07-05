import config from "./capacitor.config";

describe("Capacitor config", () => {
  it("wraps the IELTS web app as Senthee's iOS app", () => {
    expect(config.appId).toBe("com.senthee.ielts");
    expect(config.appName).toBe("Senthee IELTS");
    expect(config.webDir).toBe("native/www");
    expect(config.server?.url).toBe("http://139.224.211.170:3000");
    expect(config.server?.cleartext).toBe(true);
  });
});
