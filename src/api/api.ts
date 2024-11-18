import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3001'
})

export const getGames = () => api.get('/games');

export const getGameById = (id: number) => api.get(`/games/${id}`);

export const createGame = (data: any) => api.post('/games', data);

export const updateGame = (id: number, data: any) => api.put(`/games/${id}`, data);

export const deleteGame = (id: number) => api.delete(`/games/${id}`);