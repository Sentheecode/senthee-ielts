import { expect, test } from "@playwright/test";

test("complete a task and see the learning diff", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Senthee，今天继续靠近 7 分" })).toBeVisible();
  await page.getByRole("button", { name: "10 分钟" }).click();
  await expect(page.getByText("Section 1 表格填空")).toBeVisible();
  await page.getByRole("button", { name: "完成并记录" }).click();
  await expect(page.getByText("10 pts")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出学习数据" })).toBeVisible();
});

test("check reading and open the personal phrase review", async ({ page }) => {
  await page.goto("/practice");
  await page.getByLabel("flexible working hours").check();
  await page.getByRole("button", { name: "检查答案" }).click();
  await expect(page.getByText("回答正确：你识别出了同义替换。")) .toBeVisible();
  await page.goto("/vocabulary");
  await page.getByRole("button", { name: "显示释义" }).click();
  await expect(page.getByText("按时完成；赶上截止时间")).toBeVisible();
});
