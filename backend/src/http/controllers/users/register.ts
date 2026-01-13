import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/_errors/user-already-exists-error.js'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-user.js'

export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(6),

    })

    const {username, email, password} = registerBodySchema.parse(request.body)
    
    try{
        
        const registerUseCase  = makeRegisterUserUseCase()
        
        await registerUseCase.execute({
            username,
            email,
            password
        })
    } catch (err){
        if(err instanceof UserAlreadyExistsError){
            return reply.status(409).send({message: err.message})
        }
        
        throw err
    }

    return reply.status(201).send()
}