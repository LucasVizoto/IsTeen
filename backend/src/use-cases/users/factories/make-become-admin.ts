import { BecomeAdminUseCase } from "../users/become-admin-user.js"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository.js"

export function makeBecomeAdminUserUseCase() {
        const usersRepository = new PrismaUserRepository()
        const useCase = new BecomeAdminUseCase(usersRepository)

        return useCase
}