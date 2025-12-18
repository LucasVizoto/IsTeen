import axios from "axios"

export interface User {
  id: string
  username: string
  email: string
  password: string
}


// Tipos para os dados de criação (sem o 'id')
export type CreateUserData = Omit<User, 'id'>

const api = axios.create({
    baseURL: 'http://localhost:3333'
})

//------------------- USER ROUTES -------------------
export const registerUser = (data: CreateUserData) => api.post<User>('/users', data)

//------------------- GAMES ROUTES -------------------