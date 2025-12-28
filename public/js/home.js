document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('name-search');
    const genreSelect = document.getElementById('genero-search');
    const favButtons = document.querySelectorAll('.fav-btn');

    const executarPesquisaGlobal = () => {
        const query = searchInput.value.trim();
        const genre = genreSelect.value;

        // URL com os dois parâmetros
        // Mesmo que um esteja vazio, passa-se o outro
        const url = new URL(window.location.origin + '/search');
        if (query) url.searchParams.append('q', query);
        if (genre) url.searchParams.append('genre', genre);

        // Se ambos estiverem vazios, volta para a home
        if (!query && !genre) {
            window.location.href = '/';
        } else {
            window.location.href = url.toString();
        }
    };

    // Pesquisa automática ao mudar o Género
    genreSelect.addEventListener('change', () => {
        executarPesquisaGlobal();
    });
    
    // Pesquisa automática ao mudar o nome
    searchInput.addEventListener('change',
        executarPesquisaGlobal);

    // Evento para o Enter no input
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executarPesquisaGlobal();
    });

     // Evento para o botão de lupa
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        executarPesquisaGlobal();
    });

    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const img = btn.querySelector('img');
            img.src = img.src.includes('empty') ? '/public/images/icon-fav-full.svg' : '/public/images/icon-fav-empty.svg';
        });
    });
});