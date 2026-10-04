import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';


describe('Login', () => {

    let token;

    before(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('Deve cadastrar um aluno quando ele informa dados válidos', async () => {
        
        //Cadastrar um aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(
                    { 'nome': 'Park Jimin', 
                      'email': 'jimin@escola.com', 
                      'matricula': '2026-007', 
                      'senha': 'aluno238' 
            });

        

        //Validar que o aluno foi cadastrado
            expect(cadastroAlunoResposta.status).to.equal(201);
            expect(cadastroAlunoResposta.body.nome).to.equal('Park Jimin');
            expect(cadastroAlunoResposta.body.email).to.equal('jimin@escola.com');
            expect(cadastroAlunoResposta.body.matricula).to.equal('2026-007');

    });

    it('deve negar o cadastro de uma aluno que já existe', async () => {
       
        //Cadastrar um aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(
                    { nome: 'Ana Souza',
                         email: 'ana.souza@example.com', 
                         matricula: '2024001', 
                         senha: '123456'
            });
            

        //Validar que o aluno foi cadastrado
            expect(cadastroAlunoResposta.status).to.equal(409);
            expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');
          

    });

   
});
