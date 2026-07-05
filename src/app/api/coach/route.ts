import { NextResponse } from "next/server";

const corsHeaders = {
  "access-control-allow-origin": "capacitor://localhost",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

const SYSTEM_PROMPT = `你是一名简洁、具体的 IELTS 学习助手。只给下一步行动和必要反馈，不要写口号，不要夸大效果，不要伪造分数。优先指出 1-3 个最值得改的问题，回答要短、可执行。`;

export async function POST(request: Request) {
  let body: { mode?: string; content?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "请求不是有效 JSON" }, { status: 400, headers: corsHeaders });
  }
  if (!body.content?.trim() || body.content.length > 12000) {
    return NextResponse.json(
      { error: "内容不能为空且不得超过 12000 字符" },
      { status: 400, headers: corsHeaders },
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      provider: "offline",
      feedback:
        body.mode === "writing"
          ? "目的表达清楚。下一步补充一个具体影响和一个可执行请求，再检查冠词与句子衔接。"
          : "完成下一项任务，并记录错因。有空再继续做下一项。",
    }, { headers: corsHeaders });
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
    return NextResponse.json({ provider: "deepseek", feedback }, { headers: corsHeaders });
  } catch {
    return NextResponse.json({
      provider: "offline",
      feedback:
        "在线模型暂时不可用。先继续完成今日任务并记录错因，稍后可以再次提交。",
    }, { headers: corsHeaders });
  }
}
