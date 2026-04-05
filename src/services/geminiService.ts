import { GoogleGenAI, Type } from "@google/genai";
import { UserStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateXiaohongshuReplies(
  commentContent: string,
  userStyle: UserStyle
): Promise<string[]> {
  const prompt = `
    你是一个小红书博主的 AI 回复助手。你的任务是根据用户的评论内容，生成 3 个不同侧重点但都符合博主个人风格的回复选项。

    博主风格设定：
    - 核心风格：${userStyle.selectedStyle === 'lively' ? '活泼开朗' : userStyle.selectedStyle === 'gentle' ? '温柔体贴' : userStyle.selectedStyle === 'sharp' ? '犀利毒舌' : userStyle.selectedStyle === 'chill' ? '佛系随性' : '霸道高冷'}
    - 人设描述：${userStyle.persona}
    - 常用语：${userStyle.commonPhrases.join(", ")}
    - 语气：${userStyle.tone === "warm" ? "温暖亲切" : userStyle.tone === "cool" ? "高冷简洁" : "中性客观"}
    - 表情符号偏好：${userStyle.emojiPreference === "high" ? "多用表情" : userStyle.emojiPreference === "medium" ? "适量使用" : "少用表情"}

    待回复的评论内容：
    "${commentContent}"

    要求：
    1. 生成 3 个不同的回复选项。
    2. 选项 1：侧重于直接回应和互动。
    3. 选项 2：侧重于引导关注或私信（如果适用）。
    4. 选项 3：侧重于展示博主个性和幽默感。
    5. 严格遵守博主的人设和常用语。
    6. 包含适当的小红书风格表情符号。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 different reply options",
            }
          },
          required: ["replies"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"replies": []}');
    return data.replies.slice(0, 3);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return ["生成失败，请稍后再试。"];
  }
}
