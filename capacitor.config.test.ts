import config from "./capacitor.config";

describe("Capacitor config", () => {
  it("ships the IELTS app locally so startup does not depend on the network", () => {
    expect(config.appId).toBe("com.senthee.ielts");
    expect(config.appName).toBe("Senthee IELTS");
    expect(config.webDir).toBe("native/www");
    expect(config.server).toBeUndefined();
    expect(config.ios?.contentInset).toBe("never");
  });
});
