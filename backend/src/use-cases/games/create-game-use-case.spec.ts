import {faker} from '@faker-js/faker'
import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryGameRepository } from "@/repositories/in-memory/in-memory-games-repository.js"
import { CreateGameUseCase } from "./create-game-use-case.js"

let gameRepository: InMemoryGameRepository
let sut: CreateGameUseCase

describe('Create Game Use-Case', () =>{
    
    beforeEach(()=>{
        gameRepository = new InMemoryGameRepository()
        sut = new CreateGameUseCase(gameRepository)
    })

    it('should be able to create Game', async () =>{

    const {game} = await sut.execute({
        game_name: 'jogo-1',
        game_description: faker.lorem.text(),
        release_date: new Date(),
        url_game: faker.internet.url(),
        url_image_game: faker.internet.url(),
        developer: faker.person.fullName()
    })


        expect(game.id).toEqual(expect.any(String))
        //aqui eu digo basicamente que eu espero que o user id seja igual a qualquer string
    })
})