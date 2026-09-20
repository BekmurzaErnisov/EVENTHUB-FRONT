export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token?: string;
  accessToken?: string;
  message?: string | string[];
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

const TOKEN_KEY = "userToken";
const API_URL = "http://localhost:3000";

export const authService = {
  async updateProfile(data: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  }) {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка обновления профиля");
    }
    return response.json();
  },

  async changePassword(dto: { oldPassword?: string; newPassword?: string }) {
    const token = localStorage.getItem("userToken");

    const response = await fetch(`${API_URL}/users/me/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword: dto.oldPassword,
        newPassword: dto.newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка смены пароля");
    }
    return await response.json();
  },

  async register(credentials: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "Не удалось зарегистрироваться";
      throw new Error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
      );
    }

    return data;
  },

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "Неверный email или пароль";
      throw new Error(
        Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
      );
    }

    const token = data.access_token || data.accessToken;
    if (token) {
      this.setToken(token);
    } else {
      throw new Error("Токен не был получен от сервера");
    }

    return data;
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async deleteAvatar() {
    const response = await fetch(`${API_URL}/users/avatar`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Ошибка при удалении аватара");
    return response.json();
  },
};
