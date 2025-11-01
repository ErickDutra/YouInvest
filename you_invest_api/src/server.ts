import Fastify from 'fastify';
import { routes } from './routes.js';
import cors from '@fastify/cors'



const app = Fastify({logger: true})


const start = async ()=>{
    try {
        await app.register(cors);
        await app.register(routes);
        await app.listen({port:3333});
    } catch (error) {
        console.log(error)
        process.exit();
    }
}


start();