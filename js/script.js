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