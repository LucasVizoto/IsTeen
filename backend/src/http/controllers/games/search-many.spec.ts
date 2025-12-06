import request from 'supertest'
import { app } from "@/app.js"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user.js'
import { faker } from '@faker-js/faker'

describe('Search Game (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to search games by title', async ()=>{
        
        const {token} = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/games')
        .set('Authorization', `Bearer ${token}`)
        .send({
            game_name: 'Java Game',
            game_description: faker.lorem.text(),
            release_date: faker.date.past().toISOString(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.company.name(),
        })
        await request(app.server)
        .post('/games')
        .set('Authorization', `Bearer ${token}`)
        .send({
            game_name: 'Python Game',
            game_description: faker.lorem.text(),
            release_date: faker.date.past().toISOString(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.company.name(),
        })

        const response = await request(app.server)
        .get('/games/search')
        .set('Authorization', `Bearer ${token}`)
        .query({
            q: 'Java',
        })

        expect(response.statusCode).toEqual(200)
        expect(response.body.games).toHaveLength(1)
        expect(response.body.games).toEqual([
            expect.objectContaining({game_name: 'Java Game'}),
        ])

    })
})