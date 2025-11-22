import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryGameRepository } from "@/repositories/in-memory/in-memory-games-repository.js"
import { CreateGameUseCase } from "./create-game-use-case.js"



let gameRepository: InMemoryGameRepository
let sut: CreateGameUseCase

describe('Create Gym Use-Case', () =>{
    
    beforeEach(()=>{
        gameRepository = new InMemoryGameRepository()
        sut = new CreateGameUseCase(gameRepository)
    })

    it('should be able to create Game', async () =>{

        const {game} = await sut.execute({
            game_name: 'Test',
            game_description: 'Description Test',
            release_date: new Date(),
            url_game: 'someurl.com',
            url_image_game: 'someimageurl.com.br',
            developer: 'Jhon Doe from Silva'
        })

        expect(game.id).toEqual(expect.any(String))
        console.log(game.id)
        //aqui eu digo basicamente que eu espero que o user id seja igual a qualquer string
    })
})