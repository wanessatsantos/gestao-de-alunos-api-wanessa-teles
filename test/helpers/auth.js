import request from 'supertest';
import 'dotenv/config';
import {api} from './api.js';


//Logim como aluno e retornando o token de autenticação
export async function comTokenDeAluno(emailUser, senhaUser) {

    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(
                { email: emailUser, 
                  senha: senhaUser }
        );

    const token = loginResposta.body.token;
    if (loginResposta.status !== 200 || !token) {
        throw new Error(`Falha no login do aluno: ${loginResposta.body.error || `status ${loginResposta.status}`}`);
    }

    return `Bearer ${token}`;
}

//Login como admin e retornando o token de autenticação
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