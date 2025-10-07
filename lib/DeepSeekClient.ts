// lib/DeepSeekClient.ts
import axios, { AxiosError } from "axios";

// Types
interface DeepSeekMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface DeepSeekErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

// Constants
const CONFIG = {
  BASE_URL: "https://api.deepseek.com/v1",
  TIMEOUT: 60000, // ✅ افزایش به 60 ثانیه
  MAX_TOKENS: 4000, // ✅ افزایش برای پاسخ‌های بزرگتر
  TEMPERATURE: 0.3, // ✅ کاهش برای پاسخ‌های consistent تر
  TOP_P: 1,
  MODEL: "deepseek-chat",
  MAX_RETRIES: 3, // ✅ تعداد تلاش مجدد
  RETRY_DELAY: 2000, // ✅ تاخیر بین تلاش‌ها (2 ثانیه)
} as const;

const ERROR_MESSAGES = {
  NO_API_KEY: "کلید API تنظیم نشده است",
  INVALID_RESPONSE: "فرمت پاسخ دریافتی نامعتبر است",
  NO_CONTENT: "محتوای پاسخ خالی است",
  NETWORK_ERROR: "خطا در برقراری ارتباط با سرور",
  TIMEOUT_ERROR: "زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید",
  RATE_LIMIT: "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند لحظه صبر کنید",
  INVALID_API_KEY: "کلید API نامعتبر است",
  SERVER_ERROR: "خطای سرور رخ داد. لطفاً دوباره تلاش کنید",
  UNKNOWN_ERROR: "خطای ناشناخته رخ داد",
  MAX_RETRIES_EXCEEDED: "پس از چندین تلاش، درخواست ناموفق بود",
} as const;

// Helper Functions
const getApiKey = (): string => {
  const apiKey =
    process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY ||
    process.env.AI_DEEPSEEK_KEY ||
    "sk-087c65add4844cabbf5fa98e2ef02519";

  if (!apiKey) {
    throw new Error(ERROR_MESSAGES.NO_API_KEY);
  }

  return apiKey;
};

// ✅ تابع تاخیر برای retry
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// ✅ تشخیص خطاهای قابل retry
const isRetryableError = (error: AxiosError): boolean => {
  if (!error.response) {
    // خطاهای شبکه قابل retry هستند
    return true;
  }

  const status = error.response.status;
  // 408, 429, 500, 502, 503, 504 قابل retry هستند
  return [408, 429, 500, 502, 503, 504].includes(status);
};

const parseAxiosError = (error: AxiosError<DeepSeekErrorResponse>): string => {
  if (error.response) {
    const status = error.response.status;
    const errorData = error.response.data?.error;

    switch (status) {
      case 401:
      case 403:
        return ERROR_MESSAGES.INVALID_API_KEY;
      case 429:
        return ERROR_MESSAGES.RATE_LIMIT;
      case 408:
        return ERROR_MESSAGES.TIMEOUT_ERROR;
      case 500:
      case 502:
      case 503:
      case 504:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return errorData?.message || `خطای ${status}`;
    }
  }

  if (error.request) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return ERROR_MESSAGES.TIMEOUT_ERROR;
    }
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
};

const validateResponse = (response: DeepSeekResponse): void => {
  if (!response) {
    throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
  }

  if (!response.choices || !Array.isArray(response.choices)) {
    throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
  }

  if (response.choices.length === 0) {
    throw new Error(ERROR_MESSAGES.NO_CONTENT);
  }

  const content = response.choices[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error(ERROR_MESSAGES.NO_CONTENT);
  }
};

const buildRequestPayload = (prompt: string): DeepSeekRequest => ({
  model: CONFIG.MODEL,
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: CONFIG.TEMPERATURE,
  max_tokens: CONFIG.MAX_TOKENS,
  top_p: CONFIG.TOP_P,
});

 

// Main Client Class
export class DeepSeekClient {
  private static readonly BASE_URL = CONFIG.BASE_URL;
  private static requestCount = 0;
  private static lastRequestTime = 0;

  /**
   * ✅ Rate limiting helper
   */
  private static async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // حداقل 1 ثانیه بین درخواست‌ها
    if (timeSinceLastRequest < 1000) {
      await delay(1000 - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * Send a prompt to DeepSeek API with retry mechanism
   */
  static async sendPrompt(
    prompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      retries?: number;
    }
  ): Promise<string> {
    const maxRetries = options?.retries ?? CONFIG.MAX_RETRIES;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Validate input
        if (
          !prompt ||
          typeof prompt !== "string" ||
          prompt.trim().length === 0
        ) {
          throw new Error("درخواست نمی‌تواند خالی باشد");
        }

        // ✅ Rate limiting check
        await this.checkRateLimit();

        // Get API key
        const apiKey = getApiKey();

        // Build request payload
        const payload = buildRequestPayload(prompt);

        // Apply options if provided
        if (options?.temperature !== undefined) {
          payload.temperature = options.temperature;
        }
        if (options?.maxTokens !== undefined) {
          payload.max_tokens = options.maxTokens;
        }

        // Log attempt (در حالت development)
        if (process.env.NODE_ENV === "development") {
          console.log(
            `🔄 DeepSeek API attempt ${attempt + 1}/${maxRetries + 1}`
          );
        }

        // Make API call
        const response = await axios.post<DeepSeekResponse>(
          `${this.BASE_URL}/chat/completions`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: CONFIG.TIMEOUT,
          }
        );

        // Validate response
        validateResponse(response.data);

        // ✅ موفق - return content
        if (process.env.NODE_ENV === "development") {
          console.log(`✅ DeepSeek API success on attempt ${attempt + 1}`);
        }

        return response.data.choices[0].message.content;
      } catch (error) {
        lastError = error as Error;

        // Log error
        if (process.env.NODE_ENV === "development") {
          console.log(
            `❌ DeepSeek API error on attempt ${attempt + 1}:`,
            error
          );
        }

        // اگر axios error است
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<DeepSeekErrorResponse>;

          // اگر خطا قابل retry نیست، بلافاصله throw کن
          if (!isRetryableError(axiosError)) {
            const errorMessage = parseAxiosError(axiosError);
            throw new Error(errorMessage);
          }

          // اگر rate limit است، تاخیر بیشتری بده
          if (axiosError.response?.status === 429) {
            const retryAfter = axiosError.response.headers["retry-after"];
            const delayTime = retryAfter
              ? parseInt(retryAfter) * 1000
              : CONFIG.RETRY_DELAY * (attempt + 1);

            if (process.env.NODE_ENV === "development") {
              console.log(
                `⏳ Rate limited. Waiting ${delayTime}ms before retry...`
              );
            }

            await delay(delayTime);
            continue;
          }
        }

        // اگر آخرین تلاش بود
        if (attempt === maxRetries) {
          if (axios.isAxiosError(lastError)) {
            const errorMessage = parseAxiosError(
              lastError as AxiosError<DeepSeekErrorResponse>
            );
            throw new Error(errorMessage);
          }
          throw lastError;
        }

        // تاخیر قبل از تلاش بعدی (exponential backoff)
        const delayTime = CONFIG.RETRY_DELAY * Math.pow(2, attempt);
        if (process.env.NODE_ENV === "development") {
          console.log(`⏳ Waiting ${delayTime}ms before retry...`);
        }
        await delay(delayTime);
      }
    }

    // اگر به اینجا رسید، همه تلاش‌ها ناموفق بوده
    throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
  }

  /**
   * Send multiple messages (conversation) to DeepSeek API
   */
  static async sendMessages(
    messages: DeepSeekMessage[],
    options?: { retries?: number }
  ): Promise<string> {
    const maxRetries = options?.retries ?? CONFIG.MAX_RETRIES;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (!Array.isArray(messages) || messages.length === 0) {
          throw new Error("پیام‌ها نمی‌توانند خالی باشند");
        }

        await this.checkRateLimit();

        const apiKey = getApiKey();

        const response = await axios.post<DeepSeekResponse>(
          `${this.BASE_URL}/chat/completions`,
          {
            model: CONFIG.MODEL,
            messages,
            temperature: CONFIG.TEMPERATURE,
            max_tokens: CONFIG.MAX_TOKENS,
            top_p: CONFIG.TOP_P,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: CONFIG.TIMEOUT,
          }
        );

        validateResponse(response.data);
        return response.data.choices[0].message.content;
      } catch (error) {
        lastError = error as Error;

        if (axios.isAxiosError(error)) {
          if (!isRetryableError(error as AxiosError)) {
            const errorMessage = parseAxiosError(
              error as AxiosError<DeepSeekErrorResponse>
            );
            throw new Error(errorMessage);
          }
        }

        if (attempt === maxRetries) {
          if (axios.isAxiosError(lastError)) {
            const errorMessage = parseAxiosError(
              lastError as AxiosError<DeepSeekErrorResponse>
            );
            throw new Error(errorMessage);
          }
          throw lastError;
        }

        await delay(CONFIG.RETRY_DELAY * Math.pow(2, attempt));
      }
    }

    throw new Error(ERROR_MESSAGES.MAX_RETRIES_EXCEEDED);
  }

  /**
   * Check if the API is available
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const apiKey = getApiKey();

      await axios.post(
        `${this.BASE_URL}/chat/completions`,
        {
          model: CONFIG.MODEL,
          messages: [{ role: "user", content: "test" }],
          max_tokens: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      return true;
    } catch {
      return false;
    }
  }

  /**
   * ✅ Get current request statistics
   */
  static getStats() {
    return {
      totalRequests: this.requestCount,
      lastRequestTime: this.lastRequestTime,
    };
  }

  /**
   * ✅ Reset statistics
   */
  static resetStats() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }
}

export type { DeepSeekMessage, DeepSeekRequest, DeepSeekResponse };
