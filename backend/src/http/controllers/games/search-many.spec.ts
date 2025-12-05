import { app } from "@/app.js"
import { afterAll, beforeAll, describe, it } from "vitest"

describe('Search Game (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to search games by title', async ()=>{
 
    })
})