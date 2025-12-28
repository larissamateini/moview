document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('name-search');
    const genreSelect = document.getElementById('genero-search');
    const titulos = document.querySelectorAll('main h2'); 

    const executarPesquisa = () => {
        const query = searchInput.value.toLowerCase();
        const selectedGenre = genreSelect.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        let found = false;

        titulos.forEach(titulo => {
            if (query.length > 0 || selectedGenre !== "") {
                if (titulo.textContent.toLowerCase().includes('filmes')) titulo.textContent = 'Filmes';
                if (titulo.textContent.toLowerCase().includes('series')) titulo.textContent = 'Séries';
            } else {
                if (titulo.textContent.toLowerCase() === 'filmes') titulo.textContent = 'Filmes Populares';
                if (titulo.textContent.toLowerCase() === 'séries') titulo.textContent = 'Séries Populares';
            }
        });

        cards.forEach(card => {
            const titleElement = card.querySelector('h3');
            const cardGenre = card.getAttribute('data-genre').toLowerCase();
            
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                const matchesText = title.includes(query);
                const matchesGenre = (selectedGenre === "" || cardGenre === selectedGenre);

                if (matchesText && matchesGenre) {
                    card.style.display = "flex";
                    found = true;
                } else {
                    card.style.display = "none";
                }
            }
        });

        let msgErro = document.getElementById('no-results-msg');
        if (!found) {
            if (!msgErro) {
                msgErro = document.createElement('p');
                msgErro.id = 'no-results-msg';
                msgErro.textContent = "Não foi possível achar o conteúdo pesquisado.";
                msgErro.style.color = "var(--color-grey-100)";
                msgErro.style.textAlign = "center";
                msgErro.style.width = "100%";
                document.querySelector('main').appendChild(msgErro);
            }
        } else if (msgErro) {
            msgErro.remove();
        }
    };

    searchInput.addEventListener('input', executarPesquisa);
    genreSelect.addEventListener('change', executarPesquisa);
    searchBtn.addEventListener('click', executarPesquisa);

    const favButtons = document.querySelectorAll('.fav-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const img = btn.querySelector('img');
            img.src = img.src.includes('empty') ? '/public/images/icon-fav-full.svg' : '/public/images/icon-fav-empty.svg';
        });
    });
});