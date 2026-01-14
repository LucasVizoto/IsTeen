import request from 'supertest'
import { app } from "@/app.js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user.js'
import { faker } from '@faker-js/faker'
import { NotFoundError } from '@/use-cases/_errors/not-found-error.js'

describe('Delete Game (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to delete games searching by his id', async ()=>{
        
        const {token} = await createAndAuthenticateUser(app, true)
        
        const createGameResponse =  await request(app.server)
        .post('/games')
        .set('Authorization', `Bearer ${token}`)
        .send({
            game_name: faker.company.name(),
            game_description: faker.lorem.text(),
            release_date: faker.date.past().toISOString(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.company.name(),
        })

        await request(app.server)
        .delete(`/games/${createGameResponse.body.game.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        const findAgainResponse = await request(app.server)
        .get(`/games/${createGameResponse.body.game.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(findAgainResponse.statusCode).toEqual(400)
         expect(findAgainResponse.body).toEqual(
            expect.objectContaining({message: 'Resource Not Found'}),
        )
    })
})
