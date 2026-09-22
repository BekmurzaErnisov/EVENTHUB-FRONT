import { API_URL } from "../config/api";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchWithAuth = async (
  endpoint: string,
  options: FetchOptions = {},
  redirectOnFail = true,
): Promise<Response> => {
  const accessToken = localStorage.getItem("userToken");

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      handleLogout(redirectOnFail);
      return response;
    }

    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();

        localStorage.setItem("userToken", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }

        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${data.access_token}`,
        };

        return await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        handleLogout(redirectOnFail);
      }
    } catch {
      handleLogout(redirectOnFail);
    }
  }

  return response;
};

const handleLogout = (redirect = true) => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  window.dispatchEvent(new Event("auth:logout"));
  if (redirect) {
    window.location.href = "/login";
  }
};
