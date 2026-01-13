import type { UserRepository } from "@/repositories/users-repository.js"
import type { Game, User } from "generated/prisma/index.js"

interface SearchManyUsersUseCaseRequest{
    q: string
    page: number
}

interface SearchManyUsersUseCaseResponse{
    users: User []
}


export class SearchManyUsersUseCase{
    constructor(private usersRepository:UserRepository){}

    async execute({q, page }:SearchManyUsersUseCaseRequest): Promise<SearchManyUsersUseCaseResponse> {


        const users = await this.usersRepository.searchMany(
           q, 
           page
        )

        return {
            users,
        }
    }
}


