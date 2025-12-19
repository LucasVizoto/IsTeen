import axios, { AxiosError } from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";

// --- CONSTANTES ---
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
export const COOKIE_NAME = 'refreshToken';

// --- INTERFACES (Mantidas) ---
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Game {
  id: string;
  game_name: string;
  game_description: string;
  release_date: string;
  url_game: string;
  url_image_game: string;
  developer: string;
  created_at: string;
  updated_at: string;
}

export interface GamesResponse {
  games: Game[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export type CreateUserData = Omit<User, 'id'> & { password: string };
export type LoginUserData = Pick<User, 'email'> & { password: string };

// --- INSTÂNCIA AXIOS ---
export const api = axios.create({
  baseURL: BASE_URL,
});

// --- VARIÁVEIS DE CONTROLE DO REFRESH ---
let isRefreshing = false;
let failedRequestsQueue: any[] = [];

// --- INTERCEPTORS ---

// 1. Requisição: Anexa o Token
api.interceptors.request.use((config) => {
  const cookies = parseCookies();
  const token = cookies[COOKIE_NAME];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Resposta: Tratamento de Erro e Refresh Token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Se o erro for 401 e a requisição não for a própria tentativa de refresh
    if (error.response?.status === 401 && originalRequest) {
      
      // Evita loop infinito: marca que essa requisição já tentou ser refeita
      // @ts-ignore (propriedade customizada)
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Se já estivermos atualizando o token, coloca essa requisição na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            }
          });
        });
      }

      // @ts-ignore
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // === AQUI É A SUA ROTA DE REFRESH ===
        // Ajuste o método (PATCH/POST) e a URL conforme seu backend
        const response = await api.patch<{ token: string }>('/token/refresh'); 
        
        const { token } = response.data;

        // 1. Atualiza o cookie
        setCookie(null, COOKIE_NAME, token, {
          maxAge: 30 * 24 * 60 * 60, // 30 dias
          path: '/',
        });

        // 2. Atualiza o header padrão do axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        // 3. Processa a fila de requisições que estavam esperando
        failedRequestsQueue.forEach(req => req.onSuccess(token));
        failedRequestsQueue = [];

        // 4. Retorna a requisição original com o novo token
        return api(originalRequest);

      } catch (err) {
        // Se o refresh falhar (ex: refresh token expirado também), desloga tudo
        failedRequestsQueue.forEach(req => req.onFailure(err as AxiosError));
        failedRequestsQueue = [];

        destroyCookie(null, COOKIE_NAME);
        
        // Redireciona para login apenas se estivermos no browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- ROTAS ---
export const registerUser = (data: CreateUserData) => api.post<User>('/users', data);
export const loginUser = (data: LoginUserData) => api.post<LoginResponse>('/auth', data);
export const listGames = (query?: string, page: number = 1) => {
  return api.get<GamesResponse>('/games/search', {
    params: { 
      q: query,
      page: page 
    }
  })
}