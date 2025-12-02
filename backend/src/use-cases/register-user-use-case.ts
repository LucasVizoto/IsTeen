import { hash } from "bcryptjs"
import type { User } from "generated/prisma/index.js"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js"
import type { UserRepository } from "@/repositories/users-repository.js"

interface RegisterUseCaseRequest{
    name: string,
    email: string,
    password: string,
}

interface RegisterUseCaseResponse{
    user: User
}

//solid

// d - Dependency Invertion  (caso de uso depemde do meu repo)
//neste caso queremos inverter, pois o caso de uso instancia a 
// dependencia diretamenteo ao inves do caso de uso instanciar a dependencia, eu recebo elas como param

export class RegisterUseCase{
    constructor(private userRepository:UserRepository){}

    async execute({name, email, password }:RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {

        const password_hash = await hash(password, 6) //numero de rounds, quantidade de vezes que vai ser um hash gerado
        //vai ser gerado um hsh do próprio hash 6 vezes

        const userWithSameEmail = await this.userRepository.findByEmail(email)

        if (userWithSameEmail){
            throw new UserAlreadyExistsError()
        }

        const user = await this.userRepository.create({
            username: name,
            email,
            password: password_hash,
        })
        return {
            user,
        }
    }
}


