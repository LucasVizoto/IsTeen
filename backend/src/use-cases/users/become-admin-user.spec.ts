import { expect, describe, beforeEach, it} from 'vitest'
import { DeleteGameUseCase } from '../games/delete-game-use-case.js'
import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import { CreateGameUseCase } from '../games/create-game-use-case.js'
import { faker } from '@faker-js/faker'
import { NotFoundError } from '../_errors/not-found-error.js'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { BecomeAdminUseCase } from './become-admin-user.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: BecomeAdminUseCase

describe('Become Admin User',() =>{
  beforeEach(() =>{
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new BecomeAdminUseCase(inMemoryUsersRepository)
  })

  it('should be able to change the user role to ADMIN', async () => {

    const createdUser = await inMemoryUsersRepository.create({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    })   

    await sut.execute({
        email: createdUser.email
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(
        expect.objectContaining({
            role: 'ADMIN',
        })
    )
  })

  it('should be rised a error if the email doesnt exist', async () => {

    const createdUser = await inMemoryUsersRepository.create({
        username: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    })   


    expect( async () =>{
        await sut.execute({
            email: "email.teste@testando.com.br"
        })
    }).rejects.toBeInstanceOf(NotFoundError)
    expect(inMemoryUsersRepository.items).toHaveLength(1)
  })



})

