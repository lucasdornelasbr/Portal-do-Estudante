document.addEventListener('DOMContentLoaded', () => {
    const btnPorto = document.getElementById('btn-tema-porto');
    const htmlElement = document.documentElement;

    // Aplica o tema salvo no navegador
    const temaSalvo = localStorage.getItem('tema-portal');
    if (temaSalvo === 'porto-digital') {
        htmlElement.setAttribute('data-theme', 'porto-digital');
    }

    // Alterna o tema ao clicar no item Porto Digital dentro do menu dropdown
    if (btnPorto) {
        btnPorto.addEventListener('click', (e) => {
            e.preventDefault(); // Evita o salto da página pelo link '#'

            const temaAtual = htmlElement.getAttribute('data-theme');
            if (temaAtual === 'porto-digital') {
                htmlElement.removeAttribute('data-theme');
                localStorage.setItem('tema-portal', 'ficr');
            } else {
                htmlElement.setAttribute('data-theme', 'porto-digital');
                localStorage.setItem('tema-portal', 'porto-digital');
            }
        });
    }
});