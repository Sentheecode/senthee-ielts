import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是一名严谨、鼓励但不空泛的 IELTS General Training 中文教练。学习者当前约大学英语四级，目标六个月后总分与单项达到 7。优先指出 1-3 个最值得改的问题，解释中国学习者常见的中式直译、冠词、时态、单复数、搭配和连贯问题。不要伪造官方分数；没有完整样本时只给训练反馈。回答简洁、可执行。`;

export async function POST(request: Request) {
  let body: { mode?: string; content?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "请求不是有效 JSON" }, { status: 400 });
  }
  if (!body.content?.trim() || body.content.length > 12000) {
    return NextResponse.json(
      { error: "内容不能为空且不得超过 12000 字符" },
      { status: 400 },
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      provider: "offline",
      feedback:
        body.mode === "writing"
          ? "目的表达清楚。下一步补充一个具体影响和一个可执行请求，再检查冠词与句子衔接。"
          : "先完成一项 10 分钟任务，并记录错因。首周优先建立四科基线，不要急着刷大量题。",
    });
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: body.content },
        ],
        thinking: { type: "disabled" },
        max_tokens: 700,
        stream: false,
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw new Error(`DeepSeek ${response.status}`);
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const feedback = data.choices?.[0]?.message?.content?.trim();
    if (!feedback) throw new Error("Empty DeepSeek response");
    return NextResponse.json({ provider: "deepseek", feedback });
  } catch {
    return NextResponse.json({
      provider: "offline",
      feedback:
        "在线模型暂时不可用。先继续完成今日任务并记录错因，稍后可以再次提交。",
    });
  }
}
