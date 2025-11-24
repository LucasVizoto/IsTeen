import { env } from "@/env/index.js";
import { Logtail } from "@logtail/node";
import * as LogtailPino from "@logtail/pino";

// Isso verifica se a função está em .default (comportamento ESM) 
// ou se é o próprio módulo (comportamento CJS), e o 'any' silencia o erro ts(2349).
// causador de uma falha na importação da função
const build = (LogtailPino as any).default || (LogtailPino as any);

const logtail = new Logtail(env.LOGTAIL_SOURCE_TOKEN)

export const logtailStream = build(logtail)