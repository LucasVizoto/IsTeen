import type { UserRepository } from "@/repositories/users-repository.js";
import { compare } from "bcryptjs";
import type { User } from "generated/prisma/index.js";
import { InvalidCredentialsError } from "../_errors/invalid-credentials-error.js";
import { NotFoundError } from "../_errors/not-found-error.js";

interface BecomeAdminUseCaseRequest{
    email: string
}

interface BecomeAdminUseCaseResponse {
    user: User
}

export class BecomeAdminUseCase{
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute({email}: BecomeAdminUseCaseRequest): Promise<BecomeAdminUseCaseResponse>{
        //buscar o usuário no banco pelo e-mail
        //compaarar se a senha salva no banco bate com a senha do param
        const user = await this.userRepository.findByEmail(email)
        
        if (!user){
            throw new NotFoundError()
        }
        
        await this.userRepository.changeRoleToAdmin(user)

        return{
            user,
        }
    }
}