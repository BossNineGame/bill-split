import OpenAI from "openai";

export const getBillsFromImage = async (apiKey: string, base64Image: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  return await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        "role": "user", "content": [
          { type: "text", text: "from the image provided, give me a valid json object containing array of objects with name, price, and quantity of each bill item. Return just plain text without any markdown format" },
          { type: "image_url", image_url: { url: base64Image } }
        ]
      },
    ]
  }).then((response) => {
    return response.choices[0].message.content;
  });
}