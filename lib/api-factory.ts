import ApiService from "./api-service";

interface ServiceConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  endpoints?: Record<string, string>;
}

interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  cache?: number;
}

type BaseService = ReturnType<typeof ApiService>;

interface EndpointMethods {
  get: (options?: ApiConfig) => ReturnType<BaseService["get"]>;
  post: (
    body?: unknown,
    options?: ApiConfig
  ) => ReturnType<BaseService["post"]>;
  patch: (
    body?: unknown,
    options?: ApiConfig
  ) => ReturnType<BaseService["patch"]>;
  delete: (options?: ApiConfig) => ReturnType<BaseService["delete"]>;
  useGet: (
    options?: ApiConfig & { revalidateOnFocus?: boolean }
  ) => ReturnType<BaseService["useGet"]>;
}

export function createApiService(config: ServiceConfig = {}) {
  const service: BaseService = ApiService(config);

  const endpointBuilder = (path: string): EndpointMethods => ({
    get: (options?: ApiConfig) => service.get(path, options),
    post: (body?: unknown, options?: ApiConfig) =>
      service.post(path, body, options),
    patch: (body?: unknown, options?: ApiConfig) =>
      service.patch(path, body, options),
    delete: (options?: ApiConfig) => service.delete(path, options),
    useGet: (options: ApiConfig & { revalidateOnFocus?: boolean } = {}) =>
      service.useGet(path, options),
  });

  return {
    // Direct methods
    get: service.get,
    post: service.post,
    patch: service.patch,
    delete: service.delete,
    useGet: service.useGet,

    // Dynamic endpoint builder
    endpoint: endpointBuilder,

    // Predefined endpoints (if configured)
    ...(config.endpoints &&
      Object.keys(config.endpoints).reduce((acc, key) => {
        const path = config.endpoints![key];
        acc[key] = endpointBuilder(path);
        return acc;
      }, {} as Record<string, EndpointMethods>)),
  } as {
    get: BaseService["get"];
    post: BaseService["post"];
    patch: BaseService["patch"];
    delete: BaseService["delete"];
    useGet: BaseService["useGet"];
    endpoint: (path: string) => EndpointMethods;
  } & Record<string, EndpointMethods>;
}

export default createApiService;
