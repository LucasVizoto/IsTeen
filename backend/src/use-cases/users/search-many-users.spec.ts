
import {expect, it, describe, beforeEach} from 'vitest'
import { SearchManyUsersUseCase } from './search-many-users.js'
import { faker } from '@faker-js/faker'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'

let usersRepository: InMemoryUsersRepository
let sut: SearchManyUsersUseCase

describe('Search Users Use-Case', () =>{
    
    beforeEach(async ()=>{
        usersRepository = new InMemoryUsersRepository()
        sut = new SearchManyUsersUseCase(usersRepository)
    })

    it('should be able to search for users', async () =>{
        await usersRepository.create({
            username: faker.person.firstName(),
            email: faker.internet.email(),
            password: '123456'
        })
        await usersRepository.create({
            username: 'JhonDoe',
            email: faker.internet.email(),
            password: '123456'
        })


        const {users} = await sut.execute({
            q: 'Jhon',
            page: 1
        })

        expect(users).toHaveLength(1)
        expect(users).toEqual([
            expect.objectContaining({username: 'JhonDoe'}),
        ]) 
    })

    it('should be able to fetch paginated users search', async () =>{
        
        for (let i =1; i<=22; i++){
        await usersRepository.create({
            username: `JhonDoe${i}`,
            email: faker.internet.email(),
            password: '123456'
        })
        }

        const {users} = await sut.execute({
            q: 'Jhon',
            page: 2,
        })

        expect(users).toHaveLength(2) 
        expect(users).toEqual([
            expect.objectContaining({username: 'JhonDoe21'}),
            expect.objectContaining({username: 'JhonDoe22'}),
        ])
    })


})