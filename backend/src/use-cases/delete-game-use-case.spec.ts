import { expect, describe, beforeEach, it} from 'vitest'
import { DeleteGameUseCase } from './delete-game-use-case.js'
import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import { CreateGameUseCase } from './create-game-use-case.js'
import { faker } from '@faker-js/faker'
import { NotFoundError } from './errors/not-found-error.js'

let inMemoryGamesRepository: InMemoryGameRepository
let sut: DeleteGameUseCase

describe('Delete a Game',() =>{
  beforeEach(() =>{
    inMemoryGamesRepository = new InMemoryGameRepository()
    sut = new DeleteGameUseCase(inMemoryGamesRepository)
  })

  it('should be able to delete a game', async () => {

    const createdGame = await inMemoryGamesRepository.create({
        game_name: 'jogo-1',
        game_description: faker.lorem.text(),
        release_date: new Date(),
        url_game: faker.internet.url(),
        url_image_game: faker.internet.url(),
        developer: faker.person.fullName()
    })   

    await sut.execute({
        gameId: createdGame.id,
    })

    expect(inMemoryGamesRepository.items).toHaveLength(0)
  })

  it('should be rised a error if the id doesnt exist', async () => {

    const createdGame = await inMemoryGamesRepository.create({
        game_name: 'jogo-1',
        game_description: faker.lorem.text(),
        release_date: new Date(),
        url_game: faker.internet.url(),
        url_image_game: faker.internet.url(),
        developer: faker.person.fullName()
    })   

    expect( async () =>{
        await sut.execute({
            gameId: 'fake-game-id',
        })
    }).rejects.toBeInstanceOf(NotFoundError)
    expect(inMemoryGamesRepository.items).toHaveLength(1)
  })



})

