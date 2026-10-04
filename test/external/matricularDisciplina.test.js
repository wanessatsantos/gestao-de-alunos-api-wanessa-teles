import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinaFactory.js';
import 'dotenv/config';

describe('Matricular aluno na disciplina', () => {

    it.only('Deve cadastrar em uma nova disciplina o aluno que acaba de ser cadastrado', async () => {

        //Arrange (Preparar) 
        //Cadastrar um aluno e cadastrar a disciplina

        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novoAluno());

        const alunoId = cadastroAlunoResposta.body.id

        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Contet-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id

        //Act (Agir/Executar) 
        //Matricular o aluno na disciplina
        const matricularAlunoResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId
            });
          

        //Assert (Validar)
        //Validar que o aluno foi matriculado na disciplina
        expect(matricularAlunoResposta.status).to.equal(201);
        expect(matricularAlunoResposta.body.alunoId).to.equal(alunoId);
        expect(matricularAlunoResposta.body.disciplinaId).to.equal(disciplinaId);

    }); 

});

