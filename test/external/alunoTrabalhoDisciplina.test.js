import { randomUUID } from 'node:crypto';
import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinaFactory.js';
import testeDeTrabalhos from '../fixtures/trabalhos.json' with { type: 'json' };  
import mongoose from 'mongoose';  
import 'dotenv/config';

describe('Matricular aluno na disciplina', () => {

    after(async () => {
        await mongoose.connection.close();
    });
        testeDeTrabalhos.forEach((testeDeTrabalho) => {
            it(testeDeTrabalho.titulo, async () => {

            
                //Arrange (Preparar) 
                const dadosAluno = novoAluno();
                //Cadastro do aluno 
                const cadastroAlunoResposta = await api()
                    .post('/api/admin/alunos')
                    .set('Content-Type', 'application/json')
                    .set('Authorization', await comTokenDeAdmin())
                    .send(dadosAluno);

                const alunoId = cadastroAlunoResposta.body.id
        

                //Cadastro da disciplina
                const cadastroDisciplinaResposta = await api()
                    .post('/api/admin/disciplinas')
                    .set('Content-Type', 'application/json')
                    .set('Authorization', await comTokenDeAdmin())
                    .send(novaDisciplina());

                const disciplinaId = cadastroDisciplinaResposta.body.id

                
                //Matricular o aluno na disciplina
                const matricularAlunoResposta = await api()
                    .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', await comTokenDeAdmin())
                    .send({
                        alunoId: alunoId
                    });
                
                //Act (Agir/Executar) 
                //Registrar trabalho do aluno na disciplina
                const tokenAluno = await comTokenDeAluno(dadosAluno.email, dadosAluno.senha);

                const registrarTrabalhoResposta = await api()
                    .post(`/api/alunos/${alunoId}/trabalhos`)
                    .set('Content-Type', 'application/json')
                    .set('Authorization', tokenAluno)
                    .send({
                        disciplinaId,
                        titulo: testeDeTrabalho.titulo,
                        descricao: testeDeTrabalho.descricao
                    });

                //Assert (Validar)
                //Validar que o aluno registrou o trabalho na disciplina
                expect(registrarTrabalhoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperado);
                expect(registrarTrabalhoResposta.body.alunoId).to.equal(alunoId);
                expect(registrarTrabalhoResposta.body.disciplinaId).to.equal(disciplinaId);
                expect(registrarTrabalhoResposta.body.titulo).to.equal(testeDeTrabalho.titulo);
                

            }); 
            
        });  

});
