import type {FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply }from "fastify";
import { getCryptoTop10Value, getMarketInfo, getPricesCoins } from "./services/crypto_get.js";
import { getAcao } from "./services/acao_get.js";
import { getFii } from "./services/fiis_get.js";



export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    

    fastify.get("/cryptos/top", async (request: FastifyRequest, reply: FastifyReply)=>{
        const data = getCryptoTop10Value()
        return data;
    })

     fastify.get("/cryptos/chart", async (request: FastifyRequest, reply: FastifyReply)=>{
        const data = getPricesCoins()
        return data;
    })
     fastify.get("/cryptos/global", async (request: FastifyRequest, reply: FastifyReply)=>{
        const data = getMarketInfo()
        return data;
    })

    // Rota para obter dados da ação via scraping
    fastify.get('/acoes/:ticker', async (request: FastifyRequest, reply: FastifyReply) => {
        const params = request.params as any;
        const ticker = params?.ticker;
        if (!ticker) {
            reply.status(400);
            return { error: 'ticker é obrigatório. Ex: /acoes/petr4' };
        }
        try {
            const data = await getAcao(String(ticker));
            return data;
        } catch (err: any) {
            request.log?.error(err);
            reply.status(500);
            return { error: 'Erro ao buscar dados da ação', details: err?.message ?? String(err) };
        }
    })

    // Rota para obter dados do FII via scraping
    fastify.get('/fiis/:ticker', async (request: FastifyRequest, reply: FastifyReply) => {
        const params = request.params as any;
        const ticker = params?.ticker;
        if (!ticker) {
            reply.status(400);
            return { error: 'ticker é obrigatório. Ex: /fiis/ggrc11' };
        }
        try {
            const data = await getFii(String(ticker));
            return data;
        } catch (err: any) {
            request.log?.error(err);
            reply.status(500);
            return { error: 'Erro ao buscar dados do FII', details: err?.message ?? String(err) };
        }
    })
}