import { authService } from "./auth.service";
import { fetchWithAuth } from "./apiClient";

const API_URL = "http://localhost:3000";

export const eventService = {
  async createEvent(data: FormData | Record<string, any>) {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    const isFormData = data instanceof FormData;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (response.status === 401) {
      authService.removeToken();
      throw new Error("Неавторизован. Пожалуйста, войдите в аккаунт повторно.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Ошибка при создании мероприятия");
    }

    return response.json();
  },

  async uploadImage(file: File): Promise<string> {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/events/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      authService.removeToken();
      throw new Error("Неавторизован. Пожалуйста, войдите в аккаунт повторно.");
    }

    if (!response.ok) {
      throw new Error("Ошибка при загрузке изображения");
    }

    const data = await response.json();
    return data.url || data.path || data.imageUrl || data;
  },

  async getMyEvents() {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    const response = await fetchWithAuth(`/events/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      authService.removeToken();
      throw new Error("Пожалуйста, войдите в аккаунт заново");
    }

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    return response.json();
  },

  async deleteEvent(id: string) {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      authService.removeToken();
      throw new Error("Пожалуйста, войдите в аккаунт заново");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Ошибка при удалении");
    }

    if (response.status === 204) {
      return true;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : true;
  },

  async cancelRegistration(id: string) {
    const token = authService.getToken();

    if (!token) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    const response = await fetch(`${API_URL}/events/${id}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      authService.removeToken();
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Ошибка при отмене записи");
    }

    return response.json();
  },

  async getMyRegistrations() {
  const token = authService.getToken();

  if (!token) {
    throw new Error("Пожалуйста, войдите в аккаунт");
  }

  const response = await fetch(`${API_URL}/events/my/registrations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    authService.removeToken();
    throw new Error("Пожалуйста, войдите в аккаунт");
  }

  if (!response.ok) {
    throw new Error("Ошибка загрузки ваших регистраций");
  }

  return response.json();
},
};
