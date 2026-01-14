import { makeSearchManyUsersUseCase } from '@/use-cases/users/factories/make-search-many-users.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'

export async function searchUsers (request: FastifyRequest, reply: FastifyReply) {
    const searchManyUsersQuerySchema = z.object({
        q: z.string(),
        page: z.coerce.number().min(1).default(1)
    })

    const {q, page} = searchManyUsersQuerySchema.parse(request.query)
    
        
    const searchManyUserUseCase  = makeSearchManyUsersUseCase()
    
    const {users} = await searchManyUserUseCase.execute({
        q,
        page
    })

    return reply.status(200).send({
        users,
    })
}