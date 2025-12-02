import {expect, it, describe, beforeEach} from 'vitest'
import {InMemoryUsersRepository} from 'src/repositories/in-memory/in-memory-users-repository.js'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { AuthenticateUseCase } from './authenticate-user-use-case.js'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase
//sut = system under test

describe('Authenticate Use-Case', () =>{

    beforeEach(()=> {
        userRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(userRepository) 
    })

    it('should be able to athenticate', async () =>{


        await userRepository.create({
            username: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('123456', 6),
        })

        const {user} = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
        //aqui eu digo basicamente que eu espero que o user id seja igual a qualquer string
    })

    it('should not be able to athenticate with wrong credentials', async () =>{


       await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123456'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

    it('should not be able to athenticate with wrong password', async () =>{


        await userRepository.create({
            username: 'John Doe',
            email: 'johndoe@example.com',
            password: await hash('123456', 6),
        })

       await expect(() =>
            sut.execute({
                email: 'johndoe@example.com',
                password: '123123'
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)

    })
})