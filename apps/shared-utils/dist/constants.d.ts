export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export declare const BUSINESS_SUCCESS_CODE: 200;
export declare const SHARED_CONFIG: {
    readonly API_BASE_URL: "http://localhost:9000";
    readonly TIMEOUT: 10000;
    readonly WITH_CREDENTIALS: true;
};
