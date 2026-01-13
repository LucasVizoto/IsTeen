import { InMemoryGameRepository } from '@/repositories/in-memory/in-memory-games-repository.js'
import {expect, it, describe, beforeEach} from 'vitest'
import { SearchManyGamesUseCase } from './search-many-games.js'
import { faker } from '@faker-js/faker'

let gamesRepository: InMemoryGameRepository
let sut: SearchManyGamesUseCase

describe('Search Games Use-Case', () =>{
    
    beforeEach(async ()=>{
        gamesRepository = new InMemoryGameRepository()
        sut = new SearchManyGamesUseCase(gamesRepository)
    })

    it('should be able to search for games', async () =>{
        await gamesRepository.create({
            game_name: 'jogo-1',
            game_description: faker.lorem.text(),
            release_date: new Date(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.person.fullName()
        })
        await gamesRepository.create({
            game_name: 'jogo-2',
            game_description: faker.lorem.text(),
            release_date: new Date(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.person.fullName()
        })


        const {games} = await sut.execute({
            q: 'jogo-1',
            page: 1
        })

        expect(games).toHaveLength(1)
        expect(games).toEqual([
            expect.objectContaining({game_name: 'jogo-1'}),
        ]) 
    })

    it('should be able to fetch paginated game search', async () =>{
        
        for (let i =1; i<=22; i++){
        await gamesRepository.create({
            game_name: `jogo-${i}`,
            game_description: faker.lorem.text(),
            release_date: new Date(),
            url_game: faker.internet.url(),
            url_image_game: faker.internet.url(),
            developer: faker.person.fullName()
        })
        }

        const {games} = await sut.execute({
            q: 'jogo',
            page: 2,
        })

        expect(games).toHaveLength(2) 
        expect(games).toEqual([
            expect.objectContaining({game_name: 'jogo-21'}),
            expect.objectContaining({game_name: 'jogo-22'}),
        ])
    })


})