import manifest from "./manifest";

describe("PWA manifest", () => {
  it("is installable with Chinese identity and required icons", () => {
    const value = manifest();
    expect(value.name).toBe("Senthee IELTS");
    expect(value.short_name).toBe("Senthee IELTS");
    expect(value.display).toBe("standalone");
    expect(value.theme_color).toBe("#071b49");
    expect(value.icons?.map((icon) => icon.sizes)).toEqual(
      expect.arrayContaining(["192x192", "512x512"]),
    );
  });
});
