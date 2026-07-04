import { POST } from "./route";

describe("coach API", () => {
  it("rejects an empty coaching request", async () => {
    const response = await POST(new Request("http://localhost/api/coach", { method: "POST", body: JSON.stringify({ content: "" }) }));
    expect(response.status).toBe(400);
  });

  it("returns a labeled offline response without a server API key", async () => {
    const previous = process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    const response = await POST(new Request("http://localhost/api/coach", { method: "POST", body: JSON.stringify({ mode: "coach", content: "今天练什么？" }) }));
    const data = await response.json();
    expect(data.provider).toBe("offline");
    expect(data.feedback).toContain("完成下一项任务");
    process.env.DEEPSEEK_API_KEY = previous;
  });
});
