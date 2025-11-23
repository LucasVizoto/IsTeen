import {expect, it, describe, beforeEach} from 'vitest'
import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import { FindGameByIdUseCase } from './find-game-by-id-use-case.js'
import { faker } from '@faker-js/faker'
import { NotFoundError } from './errors/not-found-error.js'

let gameRepository: InMemoryGameRepository
let sut: FindGameByIdUseCase
//sut = system under test

describe('Get Game by his id Use-Case', () =>{

    beforeEach(()=> {
        gameRepository = new InMemoryGameRepository()
        sut = new FindGameByIdUseCase(gameRepository) 
    })

    it('should be able to get a game using his id', async () =>{


        const createdGame = await gameRepository.create({
            game_name: 'jogo-1',
            game_description: faker.lorem.text(),
            release_date: new Date(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.person.fullName()
        })
        
        const {game} = await sut.execute({
            gameId: createdGame.id,
        })

        expect(game.id).toEqual(expect.any(String))
        expect(game.game_name).toEqual('jogo-1')
        //aqui eu digo basicamente que eu espero que o user id seja igual a qualquer string
    })
    
    it('should not be able to get user profile with wrong id', async () =>{

        const createdGame = await gameRepository.create({
            game_name: 'jogo-1',
            game_description: faker.lorem.text(),
            release_date: new Date(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.person.fullName()
        })
        
        await expect(() =>
            sut.execute({
                gameId: 'non-existing-id'
            }),
        ).rejects.toBeInstanceOf(NotFoundError)
        
    })
})