const API_URL = "http://localhost:3000";

export const eventService = {
  async getMyEvents() {
    const token = localStorage.getItem("userToken");

    if (!token) {
      throw new Error("Пожадуйста, войдите в аккаунт");
    }

    const response = await fetch(`${API_URL}/events/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      throw new Error("Пожалуйста, войдите в аккаунт");
    }

    if (!response.ok) {
      throw new Error("Ошибка загрузки данных");
    }
    return response.json();
  },

  async deleteEvent(id: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Ошибка при удалении");
    return response.json();
  },

  async cancelRegistration(id: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/events/${id}/leave`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Ошибка при отмене записи");
    return response.json();
  },
};
