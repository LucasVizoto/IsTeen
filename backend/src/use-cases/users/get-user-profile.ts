import type { UserRepository } from "@/repositories/users-repository.js";
import type { User } from "generated/prisma/index.js";
import { NotFoundError } from "../_errors/not-found-error.js";

interface GetProfileUseCaseRequest{
    userId: string
}

interface GetProfileUseCaseResponse {
    user: User
}

export class GetProfileUseCase{
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute({userId}: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse>{
        //buscar o usuário no banco pelo e-mail
        //compaarar se a senha salva no banco bate com a senha do param
        const user = await this.userRepository.findById(userId)

        if (!user){
            throw new NotFoundError()
        }

        return{
            user,
        }
    }
}