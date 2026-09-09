document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    // 1. Aplica o tema salvo no localStorage ao carregar a página
    const temaSalvo = localStorage.getItem('tema-portal') || 'ficr';
    if (temaSalvo !== 'ficr') {
        htmlElement.setAttribute('data-theme', temaSalvo);
    }

    // 2. Captura os cliques no dropdown para alterar temas entre módulos
    const dropdownItems = document.querySelectorAll('.dropdown-item[data-set-theme]');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const novoTema = item.getAttribute('data-set-theme');
            localStorage.setItem('tema-portal', novoTema);

            if (novoTema === 'ficr') {
                htmlElement.removeAttribute('data-theme');
            } else {
                htmlElement.setAttribute('data-theme', novoTema);
            }
        });
    });
});