import request from 'supertest'
import { app } from "@/app.js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user.js'
import { faker } from '@faker-js/faker'

describe('Search Many Users (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to search users by username', async ()=>{
        
        const {token} = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: `jhonDoeUsername`,
            email: faker.internet.email(),
            password: '123456'
        })
        await request(app.server)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: faker.internet.username(),
            email: faker.internet.email(),
            password: '123456'
        })

        const response = await request(app.server)
        .get('/users/search')
        .set('Authorization', `Bearer ${token}`)
        .query({
            q: 'jhon',
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.users).toHaveLength(1)
        expect(response.body.users).toEqual([
            expect.objectContaining({username: 'jhonDoeUsername'}),
        ])

    })
})