import { fetchWithAuth } from "./apiClient"

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  access_token?: string
  accessToken?: string
  message?: string | string[]
  refresh_token?: string
  refreshToken?: string
  user?: {
    id: string
    email: string
    name: string
  }
}

const TOKEN_KEY = 'userToken'
const API_URL = 'http://localhost:3000'

export const authService = {
  async updateProfile(data: {name: string, email: string, avatarUrl?:string }) {
    const token = localStorage.getItem('userToken')
    const response = await fetchWithAuth(`/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Ошибка обновления профиля');
    }
    return response.json()
  },

  async changePassword(dto: { oldPassword?: string; newPassword?: string }) {
    const token = localStorage.getItem('userToken')

    const response = await fetchWithAuth(`/users/me/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        oldPassword: dto.oldPassword,
        newPassword: dto.newPassword,
      }),
    })

    if(!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка смены пароля');
    }
    return await response.json();
  },

  async register(credentials: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || 'Не удалось зарегистрироваться'
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    }

    return data
  },

  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.message || 'Неверный email или пароль'
      throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
    }

    const token = data.access_token || data.accessToken
    const refreshToken = data.refresh_token || data.refreshToken
    if (token) {
      this.setToken(token, refreshToken)
    } else {
      throw new Error('Токен не был получен от сервера')
    }
    
    return data
  },
  setToken(token: string, refreshToken?: string):void {
    localStorage.setItem(TOKEN_KEY, token)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
  },
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('refreshToken')
  },
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
  getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  },

  async deleteAccount(): Promise<void> {
    const token = localStorage.getItem('userToken')

    const response = await fetch('http://localhost:3000/users/me', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Не удалось удалить аккаунт')
    }
  }
}