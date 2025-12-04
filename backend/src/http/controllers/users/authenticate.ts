import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js'
import { makeAuthenticateUserUseCase } from '@/use-cases/factories/make-authenticate.js'

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })

    const {email, password} = authenticateBodySchema.parse(request.body)
    
    try{
        
        const authenticateUseCase  = makeAuthenticateUserUseCase()
        
        const {user} = await authenticateUseCase.execute({
            email,
            password
        })

        const token = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                },
            },
        )

        const refreshToken = await reply.jwtSign(
            {
                role: user.role,
            },
            {
                sign: {
                    sub: user.id,
                    expiresIn: '7d', //estou indicando que se meu usuário não logar em 7 dias será necessário renovar o token
                },
            },
        )

        return reply
        .setCookie('refreshToken', refreshToken, {
          path: '/', //estou definindo quais as rotas do backend terão acesso ao cookie
          secure: true, // estou dizes se o cookie só pode ser enviado em conexões https
          sameSite: true, // estou definindo que o cookie só pode ser enviado para o mesmo domínio
          httpOnly: true, // estou definindo que o cookie não pode ser acessado via javascript no frontend  
        })
        .status(200)
        .send({
            token,
        })

    } catch (err){
        if(err instanceof InvalidCredentialsError){
            return reply.status(400).send({message: err.message})
        }
        
        throw err
    }

}