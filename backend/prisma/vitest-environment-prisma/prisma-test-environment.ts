import { randomUUID } from 'node:crypto'
import 'dotenv/config'
import type { Environment } from 'vitest/environments'
import { execSync } from 'node:child_process'
import { prisma } from '@/lib/prisma.js'

function generateDatabaseUrl(schema: string){
    if(!process.env.DATABASE_URL){
        throw new Error('Plase provide a DATABASE_URL env variable')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    async setup() {
        // Criar o banco de testes
        // schemas são tipos branchs do banco
        const schema = randomUUID()
        const databaseUrl = generateDatabaseUrl(schema)
        
        //console.log(process.env.DATABASE_URL)

        process.env.DATABASE_URL = databaseUrl
        
        //console.log(process.env.DATABASE_URL)
        //console.log(databaseUrl)

        execSync('npx prisma db push') // basicamente escreve algum código no terminal

        return {
            async teardown(){
                // apagar o banco de testes

                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
                )

                await prisma.$disconnect()
            },
        }
    },
}