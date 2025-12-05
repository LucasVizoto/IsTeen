import { app } from "@/app.js"
import { afterAll, beforeAll, describe, it } from "vitest"

describe('Delete Game (e2e)', () =>{

    beforeAll( async ()=>{
        await app.ready()
    })

    afterAll( async ()=>{
        await app.close()
    })

    it('should be able to delete games searching by his id', async ()=>{
 
    })
})