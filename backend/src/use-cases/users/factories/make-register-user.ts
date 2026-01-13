import { RegisterUseCase } from "../users/register-user-use-case.js"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"

export function makeRegisterUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new RegisterUseCase(usersRepository)

        return useCase
}