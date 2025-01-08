import OpenAI from "openai";

export const getBillsFromImage = async (apiKey: string, base64Image: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "user", "content": [
              { type: "text", text: "from the image provided, give me a valid json object containing array of objects with name, price, and quantity of each bill item. If the name is in any other language than English, translate them into English first. Return just plain text without any markdown format" },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          },
        ]
      });

      console.log(response);
      return response.choices[0].message.content;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error);
      if (attempts >= maxAttempts) {
        alert("Failed to ask ChatGPT after 3 attempts, please try again or input them manually");
        throw error;
      }
    }
  }
}