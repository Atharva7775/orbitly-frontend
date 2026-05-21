export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

interface ErrorBody {
  detail?: string | { msg: string }[];
  code?: string;
}

export function toApiError(status: number, body: unknown): ApiError {
  const b = (body ?? {}) as ErrorBody;
  let message = `Request failed with status ${status}`;
  if (typeof b.detail === "string") message = b.detail;
  else if (Array.isArray(b.detail) && b.detail.length > 0) message = b.detail.map((d) => d.msg).join("; ");
  return new ApiError(status, b.code ?? "http_error", message);
}
