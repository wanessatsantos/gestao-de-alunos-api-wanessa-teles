import request from 'supertest';
import 'dotenv/config';
import {api} from './api.js';


export async function getToken(emailUser, senhaUser) {

    const loginResposta = await request('http://localhost:3000')
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(
                { email: emailUser, 
                  senha: senhaUser }
        );
    
    return loginResposta.body.token;
}

let tokenEmCache = null;

export async function comTokenDeAdmin(){
    if(!tokenEmCache){

        const loginResposta = await api()
                    .post('/api/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({ 
                        email: process.env.ADMIN_EMAIL, 
                        senha: process.env.ADMIN_SENHA 
                    });
        tokenEmCache = loginResposta.body.token;

    }
    return `Bearer ${tokenEmCache}`;
}