document.addEventListener('DOMContentLoaded', () => {
    // --- 1. PESQUISA GLOBAL (Header/Pesquisa) ---
    const searchBtn = document.getElementById('search-btn');
    const nameInput = document.getElementById('name-search');
    const genreSelect = document.getElementById('genero-search');

    function performSearch() {
        if (!nameInput && !genreSelect) return;
        const query = nameInput ? nameInput.value.trim() : '';
        const genre = genreSelect ? genreSelect.value : '';
        
        let url = '/search?';
        if (query) url += `q=${encodeURIComponent(query)}&`;
        if (genre) url += `genre=${encodeURIComponent(genre)}`;
        
        window.location.href = url;
    }

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
        nameInput.addEventListener('change', performSearch);
    }
    if (genreSelect) {
        genreSelect.addEventListener('change', performSearch);
    }

    // --- 2. LÓGICA DE FAVORITOS (Coração) ---
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-fav');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const isActive = btn.classList.contains('active');
        const tmdbId = btn.dataset.id;
        
        const url = isActive ? `/favoritos/delete/${tmdbId}` : '/favoritos/add';
        const method = isActive ? 'DELETE' : 'POST';

        const data = {
            tmdb_id: tmdbId,
            nome: btn.dataset.title,
            poster_path: btn.dataset.poster,
            tipo: btn.dataset.type,
            sinopse: btn.dataset.overview
        };
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: method === 'POST' ? JSON.stringify(data) : null
            });

            const result = await response.json();
            if (result.success) {
                btn.classList.toggle('active');
                const img = btn.querySelector('img');
                if (img) {
                    img.src = btn.classList.contains('active') 
                        ? "/public/images/icon-fav-full.svg" 
                        : "/public/images/icon-fav-empty.svg";
                }
            } else {
                alert("Erro ao atualizar favorito.");
            }
        } catch (err) {
            console.error("Erro na comunicação com o servidor:", err);
        }
    });

    // --- 3. LÓGICA DE RATING (Estrelas) ---
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('rating_input');
    if (stars.length > 0 && ratingInput) {
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                ratingInput.value = value;
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                    if (s.dataset.value <= value) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    }
                });
            });
        });
    }

    // --- 4. ADICIONAR À LISTA (Dropdown nos cards) ---
    const listForms = document.querySelectorAll('.add-to-list-form');
    listForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/listas/add-item', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (result.success) alert("Adicionado à lista com sucesso!");
            } catch (err) {
                console.error("Erro ao adicionar à lista:", err);
            }
        });
    });

    // --- 5. LÓGICA DE CRIAÇÃO DINÂMICA DE TAGS (Página Criar Lista) ---
    const favSelect = document.getElementById('favoritos-select');
    const addTagBtn = document.getElementById('add-fav-tag-btn');
    const tagsContainer = document.getElementById('selected-items-list');
    const hiddenInput = document.getElementById('itens_ids_input');
    let selectedIds = [];

    // PARA EDIÇÃO
    if (tagsContainer) {
        // Procura por botões de remover dentro das tags que já vieram do servidor
        const tagsExistentes = tagsContainer.querySelectorAll('.remove-tag');
        tagsExistentes.forEach(btn => {
            const id = btn.getAttribute('data-id');
            if (id) {
                selectedIds.push(id);
                
                // Adiciona o evento de remover também para estas tags iniciais
                btn.addEventListener('click', () => {
                    selectedIds = selectedIds.filter(itemId => itemId !== id);
                    hiddenInput.value = selectedIds.join(',');
                    btn.parentElement.remove();
                });
            }
        });
        // Atualiza o input hidden com os IDs que já existiam
        if (hiddenInput) hiddenInput.value = selectedIds.join(',');
    }

    if (addTagBtn && favSelect) {
        addTagBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede submissão do form

            const selectedOption = favSelect.options[favSelect.selectedIndex];
            const id = selectedOption.value;
            const nome = selectedOption.getAttribute('data-nome');

            console.log("Tentando adicionar - ID:", id, "Nome:", nome); // VERIFICAR NO CONSOLE (F12)

            if (!id || id === "") {
                alert("Selecione um item primeiro!");
                return;
            }

            if (selectedIds.includes(id)) {
                alert("Este item já foi adicionado.");
                return;
            }

            // 1. Atualizar lógica de dados
            selectedIds.push(id);
            hiddenInput.value = selectedIds.join(',');
            console.log("Array atual de IDs:", hiddenInput.value);

            // 2. Criar a Tag Visual
            const tag = document.createElement('div');
            tag.className = 'item-tag';
            tag.innerHTML = `
                <span>${nome}</span>
                <button type="button" class="remove-tag" style="background:none; border:none; color:var(--color-primary); cursor:pointer;">✕</button>
            `;

            // 3. Lógica para remover a tag
            tag.querySelector('.remove-tag').addEventListener('click', () => {
                selectedIds = selectedIds.filter(itemId => itemId !== id);
                hiddenInput.value = selectedIds.join(',');
                tag.remove();
            });

            tagsContainer.appendChild(tag);
            favSelect.value = ""; // Reset do select
        });
    }

    // --- 6. LÓGICA DE UTILIDADE (Thumbs Up) ---
    document.querySelectorAll('.btn-util').forEach(btn => {
        btn.addEventListener('click', async () => {
            const reviewId = btn.dataset.id;
            const counterSpan = document.getElementById(`count-${reviewId}`);

            try {
                const response = await fetch(`/review/vote/${reviewId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();

                if (result.success) {
                    // Atualiza o número na page sem recarregar a página
                    counterSpan.innerText = result.newCount;
                    // Animação simples de feedback
                    btn.style.transform = "scale(1.2)";
                    setTimeout(() => btn.style.transform = "scale(1)", 200);
                }
            } catch (err) {
                console.error("Erro ao votar:", err);
            }
        });
    });
});