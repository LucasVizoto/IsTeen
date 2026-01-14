import { makeBecomeAdminUserUseCase } from '@/use-cases/users/factories/make-become-admin.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function becomeUserAnAdmin (request: FastifyRequest, reply: FastifyReply) {

    const becomeAdminParamSchema = z.object({
        userId: z.string().uuid(),
    })

    const {userId} = becomeAdminParamSchema.parse(request.params)

    const becomeAdminUseCase = makeBecomeAdminUserUseCase()

    await becomeAdminUseCase.execute({
        userId
    })

    return reply.status(200).send({
        success: true,
        message: "The user has been changed to an Admin"
    })
}