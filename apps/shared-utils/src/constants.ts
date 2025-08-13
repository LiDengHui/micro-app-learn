export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// Business-level success code from backend wrapper
export const BUSINESS_SUCCESS_CODE = 200 as const;

// 共享的配置常量
export const SHARED_CONFIG = {
  API_BASE_URL: "http://localhost:9000",
  TIMEOUT: 10000,
  WITH_CREDENTIALS: true,
} as const;
