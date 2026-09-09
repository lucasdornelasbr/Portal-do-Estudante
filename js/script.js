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