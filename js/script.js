document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const elementoNomeModulo = document.getElementById('nome-modulo-ativo');
    const menuNavegacao = document.getElementById('menu-navegacao-dinamico');

    // Configuração dos nomes e dos menus específicos de cada módulo
    const configuracaoModulos = {
        'ficr': {
            nome: 'Portal do Estudante',
            links: [
                { texto: 'Resumo', url: 'index.html' },
                { texto: 'Disciplinas', url: 'disciplinas.html' },
                { texto: 'Tarefas', url: 'tarefas.html' }
            ]
        },
        'porto-digital': {
            nome: 'Embarque Digital',
            links: [
                { texto: 'Resumo', url: 'index.html' },
                { texto: 'Projetos', url: '#' },
                { texto: 'Residência', url: '#' }
            ]
        },
        'cursos': {
            nome: 'Cursos & Certificados',
            links: [
                { texto: 'Meus Cursos', url: 'cursos.html' },
                { texto: 'Certificados', url: 'cursos.html' }
            ]
        },
        'oportunidades': {
            nome: 'Oportunidades',
            links: [
                { texto: 'Mapeamento de Vagas', url: 'oportunidades.html' }
            ]
        }
    };

    function atualizarInterfaceModulo(chaveModulo) {
        const modulo = configuracaoModulos[chaveModulo] || configuracaoModulos['ficr'];

        // 1. Atualiza o tema no elemento HTML
        if (chaveModulo === 'ficr') {
            htmlElement.removeAttribute('data-theme');
        } else {
            htmlElement.setAttribute('data-theme', chaveModulo);
        }

        // 2. Atualiza o título do cabeçalho
        if (elementoNomeModulo) {
            elementoNomeModulo.textContent = modulo.nome;
        }

        // 3. Atualiza os links do menu do canto superior direito
        if (menuNavegacao) {
            menuNavegacao.innerHTML = '';
            modulo.links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.texto;
                li.appendChild(a);
                menuNavegacao.appendChild(li);
            });
        }
    }

    // Carrega o módulo salvo no localStorage ou inicia no padrão
    const temaSalvo = localStorage.getItem('tema-portal') || 'ficr';
    atualizarInterfaceModulo(temaSalvo);

    // Evento de clique nas opções do menu dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item[data-set-theme]');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const novoTema = item.getAttribute('data-set-theme');
            localStorage.setItem('tema-portal', novoTema);
            atualizarInterfaceModulo(novoTema);
        });
    });
});
// ==========================================================================
// GESTÃO DE TAREFAS (PERSISTÊNCIA VIA LOCALSTORAGE)
// ==========================================================================
const formTarefa = document.getElementById('form-tarefa');
const tabelaTarefasBody = document.getElementById('tabela-tarefas-body');

let tarefas = JSON.parse(localStorage.getItem('tarefas-portal')) || [
    { id: 1, nome: 'Projeto Web Front-End', disciplina: 'Desenvolvimento Front-End', data: '2026-10-15', status: 'Pendente' }
];

function renderizarTarefas() {
    if (!tabelaTarefasBody) return;

    tabelaTarefasBody.innerHTML = '';
    tarefas.forEach(tarefa => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${tarefa.nome}</td>
            <td>${tarefa.disciplina}</td>
            <td>${tarefa.data}</td>
            <td><span class="badge badge-${tarefa.status.toLowerCase().replace(' ', '-')}">${tarefa.status}</span></td>
            <td><button onclick="removerTarefa(${tarefa.id})" style="background:none; border:none; color:red; cursor:pointer;">Excluir</button></td>
        `;
        tabelaTarefasBody.appendChild(tr);
    });
}

function removerTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    localStorage.setItem('tarefas-portal', JSON.stringify(tarefas));
    renderizarTarefas();
}

if (formTarefa) {
    formTarefa.addEventListener('submit', (e) => {
        e.preventDefault();

        const novaTarefa = {
            id: Date.now(),
            nome: document.getElementById('nome-tarefa').value,
            disciplina: document.getElementById('disciplina-tarefa').value,
            data: document.getElementById('data-tarefa').value,
            status: document.getElementById('status-tarefa').value
        };

        tarefas.push(novaTarefa);
        localStorage.setItem('tarefas-portal', JSON.stringify(tarefas));
        renderizarTarefas();
        formTarefa.reset();
    });
}

renderizarTarefas();
function renderizarResumoTarefas() {
    const conteinerResumo = document.getElementById('lista-proximas-tarefas');
    if (!conteinerResumo) return;

    const tarefas = JSON.parse(localStorage.getItem('tarefas-portal')) || [];
    conteinerResumo.innerHTML = '';

    if (tarefas.length === 0) {
        conteinerResumo.innerHTML = '<li>Nenhuma tarefa pendente cadastrada.</li>';
        return;
    }

    // Exibe até as 5 tarefas mais recentes no resumo
    tarefas.slice(-5).forEach(tarefa => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${tarefa.nome}</strong> (${tarefa.disciplina}) — <small>Data: ${tarefa.data}</small>`;
        conteinerResumo.appendChild(item);
    });
}

// Executa na inicialização
renderizarResumoTarefas();

// ==========================================================================
// GESTÃO DE CURSOS E CERTIFICADOS
// ==========================================================================
const formCurso = document.getElementById('form-curso');
const containerCursos = document.getElementById('container-cursos');

let cursos = JSON.parse(localStorage.getItem('cursos-portal')) || [];

function renderizarCursos() {
    if (!containerCursos) return;

    containerCursos.innerHTML = '';

    if (cursos.length === 0) {
        containerCursos.innerHTML = '<p class="text-muted">Nenhum curso cadastrado até o momento.</p>';
        return;
    }

    cursos.forEach(curso => {
        const card = document.createElement('article');
        card.className = 'card';

        let previewHTML = '';
        if (curso.arquivoData) {
            if (curso.arquivoTipo.startsWith('image/')) {
                previewHTML = `<div class="miniantiura-certificado"><img src="${curso.arquivoData}" alt="Certificado" style="max-width: 100%; border-radius: 4px;"></div>`;
            } else {
                previewHTML = `<div class="miniantiura-certificado"><small>📄 Comprovante anexado (${curso.arquivoNome})</small></div>`;
            }
        }

        card.innerHTML = `
            <h3>${curso.nome}</h3>
            <p><strong>Plataforma:</strong> ${curso.plataforma} (${curso.cargaHoraria}h)</p>
            <p><strong>Status:</strong> <span class="badge badge-${curso.status.toLowerCase().replace(' ', '-')}">${curso.status}</span></p>
            ${previewHTML}
            <button onclick="removerCurso(${curso.id})" style="margin-top: 1rem; background: none; border: none; color: #e11d48; cursor: pointer; font-size: 0.85rem;">Excluir Curso</button>
        `;

        containerCursos.appendChild(card);
    });
}

function removerCurso(id) {
    cursos = cursos.filter(c => c.id !== id);
    localStorage.setItem('cursos-portal', JSON.stringify(cursos));
    renderizarCursos();
}

if (formCurso) {
    formCurso.addEventListener('submit', (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('upload-certificado');
        const file = fileInput.files[0];

        const salvarObjetoCurso = (arquivoData = null, arquivoTipo = null, arquivoNome = null) => {
            const novoCurso = {
                id: Date.now(),
                nome: document.getElementById('nome-curso').value,
                plataforma: document.getElementById('plataforma-curso').value,
                cargaHoraria: document.getElementById('carga-horaria').value,
                status: document.getElementById('status-curso').value,
                arquivoData,
                arquivoTipo,
                arquivoNome
            };

            cursos.push(novoCurso);
            localStorage.setItem('cursos-portal', JSON.stringify(cursos));
            renderizarCursos();
            formCurso.reset();
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                salvarObjetoCurso(evt.target.result, file.type, file.name);
            };
            reader.readAsDataURL(file);
        } else {
            salvarObjetoCurso();
        }
    });
}

renderizarCursos();
// ==========================================================================
// GESTÃO DE OPORTUNIDADES E VAGAS
// ==========================================================================
const formVaga = document.getElementById('form-vaga');
const tabelaVagasBody = document.getElementById('tabela-vagas-body');

let vagas = JSON.parse(localStorage.getItem('vagas-portal')) || [];

function renderizarVagas() {
    if (!tabelaVagasBody) return;

    tabelaVagasBody.innerHTML = '';

    if (vagas.length === 0) {
        tabelaVagasBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Nenhuma vaga mapeada até o momento.</td></tr>';
        return;
    }

    vagas.forEach(vaga => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${vaga.cargo}</strong></td>
            <td>${vaga.empresa}</td>
            <td><span class="badge badge-${vaga.status.toLowerCase()}">${vaga.status}</span></td>
            <td><a href="${vaga.link}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); font-weight: 600;">Ver Vaga 🔗</a></td>
            <td><button onclick="removerVaga(${vaga.id})" style="background: none; border: none; color: #e11d48; cursor: pointer; font-size: 0.85rem;">Excluir</button></td>
        `;
        tabelaVagasBody.appendChild(tr);
    });
}

function removerVaga(id) {
    vagas = vagas.filter(v => v.id !== id);
    localStorage.setItem('vagas-portal', JSON.stringify(vagas));
    renderizarVagas();
}

if (formVaga) {
    formVaga.addEventListener('submit', (e) => {
        e.preventDefault();

        const novaVaga = {
            id: Date.now(),
            cargo: document.getElementById('cargo-vaga').value,
            empresa: document.getElementById('empresa-vaga').value,
            link: document.getElementById('link-vaga').value,
            status: document.getElementById('status-vaga').value
        };

        vagas.push(novaVaga);
        localStorage.setItem('vagas-portal', JSON.stringify(vagas));
        renderizarVagas();
        formVaga.reset();
    });
}

renderizarVagas();

// ==========================================================================
// GESTÃO DE DISCIPLINAS E FREQUÊNCIA (SOMA N1 + N2 + N3)
// ==========================================================================
const formDisciplina = document.getElementById('form-disciplina');
const containerDisciplinas = document.getElementById('container-disciplinas');

let disciplinas = JSON.parse(localStorage.getItem('disciplinas-portal')) || [];

function renderizarDisciplinas() {
    if (!containerDisciplinas) return;

    containerDisciplinas.innerHTML = '';

    if (disciplinas.length === 0) {
        containerDisciplinas.innerHTML = '<p class="text-muted">Nenhuma disciplina cadastrada para este semestre.</p>';
        return;
    }

    disciplinas.forEach(disc => {
        const card = document.createElement('article');
        card.className = 'card';

        const n1 = parseFloat(disc.nota1);
        const n2 = parseFloat(disc.nota2);
        const n3 = parseFloat(disc.nota3);

        // Calcula a soma apenas dos valores numéricos preenchidos
        const somaNotas = (isNaN(n1) ? 0 : n1) + (isNaN(n2) ? 0 : n2) + (isNaN(n3) ? 0 : n3);
        const notaFinalText = somaNotas.toFixed(1);

        let statusBadge = '<span class="badge badge-andamento">Em Andamento</span>';

        if (somaNotas >= 7.0 && disc.faltas <= 15) {
            statusBadge = '<span class="badge badge-concluido">Aprovado</span>';
        } else if (disc.faltas > 15 || (!isNaN(n1) && !isNaN(n2) && !isNaN(n3) && somaNotas < 7.0)) {
            statusBadge = '<span class="badge badge-pendente">Atenção / Risco</span>';
        }

        card.innerHTML = `
            <h3>${disc.nome}</h3>
            <p><strong>Professor:</strong> ${disc.professor}</p>
            <p><strong>Dia:</strong> ${disc.dia}</p>
            <hr style="margin: 0.75rem 0; border: 0; border-top: 1px solid var(--border-color);">
            <p><strong>Provas:</strong> N1 (máx 2): ${isNaN(n1) ? '-' : n1} | N2 (máx 3): ${isNaN(n2) ? '-' : n2} | N3 (máx 5): ${isNaN(n3) ? '-' : n3}</p>
            <p><strong>Pontuação Acumulada:</strong> <strong>${notaFinalText} / 10.0</strong></p>
            <p><strong>Faltas:</strong> ${disc.faltas}</p>
            <div style="margin-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                ${statusBadge}
                <button onclick="removerDisciplina(${disc.id})" style="background: none; border: none; color: #e11d48; cursor: pointer; font-size: 0.85rem;">Excluir</button>
            </div>
        `;

        containerDisciplinas.appendChild(card);
    });
}

function removerDisciplina(id) {
    disciplinas = disciplinas.filter(d => d.id !== id);
    localStorage.setItem('disciplinas-portal', JSON.stringify(disciplinas));
    renderizarDisciplinas();
}

if (formDisciplina) {
    formDisciplina.addEventListener('submit', (e) => {
        e.preventDefault();

        const novaDisciplina = {
            id: Date.now(),
            nome: document.getElementById('nome-disciplina').value,
            professor: document.getElementById('prof-disciplina').value,
            dia: document.getElementById('dia-disciplina').value,
            nota1: document.getElementById('nota1-disciplina').value,
            nota2: document.getElementById('nota2-disciplina').value,
            nota3: document.getElementById('nota3-disciplina').value,
            faltas: document.getElementById('faltas-disciplina').value || 0
        };

        disciplinas.push(novaDisciplina);
        localStorage.setItem('disciplinas-portal', JSON.stringify(disciplinas));
        renderizarDisciplinas();
        formDisciplina.reset();
    });
}

renderizarDisciplinas();