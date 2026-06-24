const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("prepwise_token") || "";
}

export function setToken(token: string) {
  localStorage.setItem("prepwise_token", token);
}

export function clearToken() {
  localStorage.removeItem("prepwise_token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}/api/v1${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(error.detail || "Request failed");
  }
  return response.json();
}

export const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

