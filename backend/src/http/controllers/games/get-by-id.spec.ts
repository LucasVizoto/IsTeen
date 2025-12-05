import request from 'supertest'
import { app } from "@/app.js"
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { faker } from '@faker-js/faker'

describe('Search Game By his id (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to search a game by his id', async ()=>{
       
        const {token} = await createAndAuthenticateUser(app, true)

        const createGameResponse = await request(app.server)
        .post('/games')
        .set('Authorization', `Bearer ${token}`)
        .send({
            game_name: faker.person.fullName(),
            game_description: faker.lorem.text(),
            release_date: faker.date.past().toISOString(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.company.name(),
        })

        const gameId = createGameResponse.body.game.id

        const response = await request(app.server)
        .get(`/games/${gameId}`)
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(response.statusCode).toEqual(200)
        expect.objectContaining({
            game: {
                id: gameId,
            }
        })

    })
})
