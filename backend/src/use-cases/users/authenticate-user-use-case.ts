import type { UserRepository } from "@/repositories/users-repository.js";
import { compare } from "bcryptjs";
import type { User } from "generated/prisma/index.js";
import { InvalidCredentialsError } from "../_errors/invalid-credentials-error.js";

interface AuthenticateUseCaseRequest{
    email: string,
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase{
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute({email, password}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse>{
        //buscar o usuário no banco pelo e-mail
        //compaarar se a senha salva no banco bate com a senha do param
        const user = await this.userRepository.findByEmail(email)

        if (!user){
            throw new InvalidCredentialsError()
        }

        const doesPasswordMatches = await compare(password, user.password)

        if(!doesPasswordMatches){
            throw new InvalidCredentialsError()
        }

        return{
            user,
        }
    }
}