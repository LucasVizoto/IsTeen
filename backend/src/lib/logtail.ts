import { env } from "@/env/index.js";
import { Logtail } from "@logtail/node";
import * as LogtailPino from "@logtail/pino";

let logtailStream: any

// Se estivermos em teste, não inicialize o Logtail
if (env.NODE_ENV === 'test' || env.NODE_ENV === 'e2e') {
    // Retorne um stream vazio/mock ou exporte null/undefined
    logtailStream = null; 

} else {
    // Isso verifica se a função está em .default (comportamento ESM) 
    const build = (LogtailPino as any).default || (LogtailPino as any);

    const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN)

    logtailStream = build(logtail)
}

export default logtailStream