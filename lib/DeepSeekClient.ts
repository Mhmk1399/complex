import axios from "axios";

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class DeepSeekClient {
  private static readonly BASE_URL = "https://api.deepseek.com/v1";
  static async sendPrompt(prompt: string): Promise<string> {
    const apiKey = "sk-c4f549a03c6f410fb06fda73d74e885b";

    try {
      const response = await axios.post<DeepSeekResponse>(
        `${this.BASE_URL}/chat/completions`,
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      let errorMessage = "Failed to call DeepSeek API";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage += `: ${error.response.status} - ${
            error.response.data?.error?.message || "Unknown error"
          }`;
        } else if (error.request) {
          errorMessage += ": No response received";
        } else {
          errorMessage += `: ${error.message}`;
        }
      } else {
        errorMessage += `: ${error.message}`;
      }

      throw new Error(errorMessage);
    }
  }
}
