document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('name-search');
    const genreSelect = document.getElementById('genero-search');

    // Pesquisa simples (Front-end filter ou redirecionamento)
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        console.log("A pesquisar por:", query);
        // adicionar lógica para filtrar os cards visíveis
    });

    // Favoritos nos cards
    const favButtons = document.querySelectorAll('.fav-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede de abrir os detalhes ao clicar em fav
            const img = this.querySelector('img');
            if (img.src.includes('empty')) {
                img.src = '/public/images/icon-fav-full.svg';
            } else {
                img.src = '/public/images/icon-fav-empty.svg';
            }
        });
    });
});