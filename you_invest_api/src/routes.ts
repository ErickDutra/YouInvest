import type {FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply }from "fastify";
import { getCryptoTop10Value, getPricesCoins } from "./services/crypto_get.js";



export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    

    fastify.get("/cryptos/top", async (request: FastifyRequest, reply: FastifyReply)=>{
        const data = getCryptoTop10Value()
        return data;
    })

     fastify.get("/cryptos/chart", async (request: FastifyRequest, reply: FastifyReply)=>{
        const data = getPricesCoins()
        return data;
    })
}