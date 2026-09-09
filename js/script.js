document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema');
    const htmlElement = document.documentElement;

    // Recupera o tema salvo no localStorage
    const temaSalvo = localStorage.getItem('tema-portal');
    if (temaSalvo) {
        htmlElement.setAttribute('data-theme', temaSalvo);
    }

    // Alterna entre FICR (padrão) e Porto Digital
    if (btnTema) {
        btnTema.addEventListener('click', () => {
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