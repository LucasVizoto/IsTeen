import type { UserRepository } from "@/repositories/users-repository.js";
import { NotFoundError } from "../_errors/not-found-error.js";

interface BecomeAdminUseCaseRequest{
    userId: string
}

interface BecomeAdminUseCaseResponse {
}

export class BecomeAdminUseCase{
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute({userId}: BecomeAdminUseCaseRequest): Promise<BecomeAdminUseCaseResponse>{
        //buscar o usuário no banco pelo e-mail
        //compaarar se a senha salva no banco bate com a senha do param
        const user = await this.userRepository.findById(userId)
        
        if (!user){
            throw new NotFoundError()
        }
        
        await this.userRepository.changeRoleToAdmin(user)

        return{}
    }
}