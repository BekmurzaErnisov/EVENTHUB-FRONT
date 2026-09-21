import { API_URL } from "../config/api";

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchWithAuth = async (
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> => {
  let accessToken = localStorage.getItem("userToken");

  const headers = {
    "Content-Type": "application/json",
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
      handleLogout();
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
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  }

  return response;
};

const handleLogout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
  window.dispatchEvent(new Event("auth:logout"))
  window.location.href = "/login";
};
