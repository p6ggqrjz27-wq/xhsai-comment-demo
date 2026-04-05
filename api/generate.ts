export default async function handler(req: any, res: any) {
  try {
    const { comment } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `帮我给这条评论生成3条小红书风格回复：${comment}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "生成失败";

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: "error" });
  }
}
