import {expect, it, describe, beforeEach} from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import { FindGameByIdUseCase } from './find-game-by-id-use-case.js'

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
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6),
        })

        const {user} = await sut.execute({
            userId: createdGame.id,
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
        //aqui eu digo basicamente que eu espero que o user id seja igual a qualquer string
    })

    it('should not be able to get user profile with wrong id', async () =>{


       await expect(() =>
            sut.execute({
                'userId': 'non-existing-id'
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)

    })
})