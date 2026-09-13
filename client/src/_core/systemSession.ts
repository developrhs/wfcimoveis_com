export type SystemUser = {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  status?: string;
};

export type SystemSummary = { properties: number; clients: number; users: number };

export class SystemApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "SystemApiError";
  }
}

export async function systemApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/sistema/api/v1/${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new SystemApiError(body.error ?? "Não foi possível concluir a operação.", response.status);
  }
  return body as T;
}
