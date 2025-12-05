import { prisma } from '@/lib/prisma.js'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false){
    const user = await prisma.user.create({
        data:{
            username:'John Doe',
            email: 'johndoe@example.com',
            password: await hash('123456', 6),
            role: isAdmin ? 'ADMIN' : 'USER',
        }
    })

    const authResponse = await request(app.server)
    .post('/auth')
    .send({
        email: 'johndoe@example.com',
        password:'123456',
    })

    const {token} = authResponse.body
    return {
        token,
    }
}