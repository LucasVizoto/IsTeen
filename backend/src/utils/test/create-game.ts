import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import { CreateGameUseCase } from '@/use-cases/create-game-use-case.js'
import {faker} from '@faker-js/faker'

let gameRepository: InMemoryGameRepository
let sut: CreateGameUseCase

gameRepository = new InMemoryGameRepository()
sut = new CreateGameUseCase(gameRepository)

export async function createGame(){
    const {game} = await sut.execute({
        game_name: faker.vehicle.model(),
        game_description: faker.lorem.text(),
        release_date: new Date(),
        url_game: faker.internet.url(),
        url_image_game: faker.internet.url(),
        developer: faker.person.fullName()
    })

    return game
}