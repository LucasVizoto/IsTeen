import request from 'supertest'
import {app} from '@/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user.js'
import { faker } from '@faker-js/faker'

describe('Create Game (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to create a Game', async ()=>{

        const {token} = await createAndAuthenticateUser(app, true)

        const response = await request(app.server)
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

        expect(response.statusCode).toEqual(201)
        expect.objectContaining({
            game: {
                id: expect.any(String),
                created_at: expect.any(String)
            }
        })
        })
    })
