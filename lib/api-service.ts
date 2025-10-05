import useSWR from "swr";

export interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  cache?: number;
}

interface RequestOptions extends ApiConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

export default function createApiService(config: ApiConfig = {}) {
  const baseUrl = config.baseUrl || "";
  const defaultHeaders = config.headers || {};

  const request = async (endpoint: string, options: RequestOptions = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const headers = { ...defaultHeaders, ...options.headers };

    const config: RequestInit = {
      method: options.method || "GET",
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
      headers["Content-Type"] =
        "Content-Type" in headers
          ? headers["Content-Type"]
          : "application/json";
    }

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  const get = (endpoint: string, options: ApiConfig = {}) => {
    return request(endpoint, { ...options, method: "GET" });
  };

  const post = (endpoint: string, body?: unknown, options: ApiConfig = {}) => {
    return request(endpoint, { ...options, method: "POST", body });
  };

  const patch = (endpoint: string, body?: unknown, options: ApiConfig = {}) => {
    return request(endpoint, { ...options, method: "PATCH", body });
  };

  const delete_ = (endpoint: string, options: ApiConfig = {}) => {
    // renamed to avoid keyword conflict
    return request(endpoint, { ...options, method: "DELETE" });
  };

  const useGet = (
    endpoint: string,
    options: ApiConfig & { revalidateOnFocus?: boolean } = {}
  ) => {
    const {
      cache = 60000,
      revalidateOnFocus = false,
      ...fetchOptions
    } = options;

    return useSWR(endpoint, () => get(endpoint, fetchOptions), {
      refreshInterval: cache,
      revalidateOnFocus,
    });
  };

  return {
    get,
    post,
    patch,
    delete: delete_,
    useGet,
  };
}
