const modal = document.getElementById('modalConteudo');
const form = document.getElementById('formConteudo');

// Elementos da Pesquisa TMDB
const searchInput = document.getElementById('tmdbSearchInput');
const resultsContainer = document.getElementById('tmdbSearchResults');
const searchSection = document.getElementById('tmdbSearchSection');

// --- GARANTIA DE ESTADO INICIAL ---
// Força o modal a ficar escondido assim que o script carrega
if (modal) {
    modal.style.display = 'none';
}

// --- EVENTOS DO MODAL ---

function openAddModal() {
    form.reset();
    document.getElementById('contentId').value = '';
    document.getElementById('modalTitle').innerText = 'Adicionar Conteúdo';
    
    // MOSTRAR a pesquisa
    searchSection.style.display = 'block';
    searchInput.value = '';
    resultsContainer.style.display = 'none';
    
    // Limpar bloqueios visuais
    document.getElementById('tmdb_id').value = '';
    
    modal.style.display = 'flex';
    searchInput.focus(); 
}

function closeModal() {
    modal.style.display = 'none';
}

async function editItem(endpoint, id) {
    searchSection.style.display = 'none';
    
    try {
        const response = await fetch(`/backoffice/conteudos/${id}`);
        const data = await response.json();

        document.getElementById('contentId').value = data.id;
        document.getElementById('tmdb_id').value = data.tmdb_id;
        document.getElementById('nome').value = data.nome;
        document.getElementById('tipo').value = data.tipo; 
        document.getElementById('tipoVisual').value = data.tipo;
        document.getElementById('sinopse').value = data.sinopse || '';
        document.getElementById('ano_lancamento').value = data.ano_lancamento || '';
        document.getElementById('duracao').value = data.duracao || '';
        document.getElementById('poster_path').value = data.poster_path || '';
        document.getElementById('backdrop_path').value = data.backdrop_path || '';

        document.getElementById('modalTitle').innerText = 'Editar Conteúdo';
        modal.style.display = 'flex';
    } catch (err) {
        console.error("Erro ao carregar:", err);
        alert("Erro ao carregar dados.");
    }
}

// --- LÓGICA DE PESQUISA AO VIVO (TMDB) ---
let debounceTimeout;

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        resultsContainer.innerHTML = '';
        
        clearTimeout(debounceTimeout);
        
        if (query.length < 3) {
            resultsContainer.style.display = 'none';
            return;
        }

        debounceTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`/backoffice/conteudos/search/tmdb?q=${encodeURIComponent(query)}`);
                const results = await res.json();
                
                if (results.length > 0) {
                    results.forEach(movie => {
                        const item = document.createElement('div');
                        item.style.padding = '10px';
                        item.style.borderBottom = '1px solid #333';
                        item.style.cursor = 'pointer';
                        item.style.display = 'flex';
                        item.style.alignItems = 'center';
                        item.style.gap = '10px';
                        item.style.background = '#1a1a1a';
                        
                        item.onmouseover = () => item.style.background = '#333';
                        item.onmouseout = () => item.style.background = '#1a1a1a';

                        const posterUrl = movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
                            : 'https://via.placeholder.com/45x68?text=No+Img';
                        
                        const year = movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : 'N/A');
                        const title = movie.title || movie.name;
                        const typeLabel = movie.media_type === 'movie' ? 'Filme' : 'Série';

                        item.innerHTML = `
                            <img src="${posterUrl}" style="width: 45px; height: 68px; object-fit: cover; border-radius: 4px;">
                            <div>
                                <div style="color: white; font-weight: bold;">${title}</div>
                                <div style="color: #aaa; font-size: 0.8em;">${typeLabel} • ${year}</div>
                            </div>
                        `;

                        item.addEventListener('click', () => selectTmdbItem(movie));
                        resultsContainer.appendChild(item);
                    });
                    resultsContainer.style.display = 'block';
                } else {
                    resultsContainer.style.display = 'none';
                }
            } catch (err) {
                console.error(err);
            }
        }, 500);
    });
}

async function selectTmdbItem(item) {
    console.log("Dados brutos do TMDB:", item); 

    // 1. Identificar o Tipo (Importante: Peaky Blinders é 'tv')
    // Às vezes o TMDB não envia 'media_type' se a busca for específica de séries
    let type = item.media_type;
    if (!type) {
        // Se tem 'title' é filme, se tem 'name' é série (lógica padrão TMDB)
        type = item.name ? 'tv' : 'movie';
    }

    // 2. Preencher IDs e Textos
    document.getElementById('tmdb_id').value = item.id;
    document.getElementById('nome').value = item.title || item.name;
    document.getElementById('sinopse').value = item.overview || '';
    document.getElementById('poster_path').value = item.poster_path || '';
    document.getElementById('backdrop_path').value = item.backdrop_path || '';
    
    // 3. Resolver o TIPO (Força o preenchimento dos dois campos que criamos)
    const tipoHidden = document.getElementById('tipo');
    const tipoVisual = document.getElementById('tipoVisual');
    
    if (tipoHidden) tipoHidden.value = type;
    if (tipoVisual) tipoVisual.value = type;

    console.log("Tipo definido como:", type);

    // 4. Resolver o ANO
    const date = item.release_date || item.first_air_date;
    document.getElementById('ano_lancamento').value = date ? date.substring(0, 4) : '';

    // 5. Busca DURAÇÃO e Detalhes Extras
    try {
        const detailRes = await fetch(`/backoffice/conteudos/details/tmdb/${type}/${item.id}`);
        
        if (!detailRes.ok) throw new Error("Rota de detalhes falhou");

        const details = await detailRes.json();
        
        let runtime = 0;
        if (type === 'movie') {
            runtime = details.runtime || 0;
        } else {
            // Lógica para Séries
            if (details.episode_run_time && details.episode_run_time.length > 0) {
                const sum = details.episode_run_time.reduce((a, b) => a + b, 0);
                runtime = Math.round(sum / details.episode_run_time.length);
            } else if (details.last_episode_to_air && details.last_episode_to_air.runtime) {
                 runtime = details.last_episode_to_air.runtime;
            }
        }
        document.getElementById('duracao').value = runtime;
        
    } catch (e) {
        console.error("Erro ao buscar duração:", e);
        document.getElementById('duracao').value = 0;
    }

    // Limpeza final
    resultsContainer.style.display = 'none';
    if (searchInput) searchInput.value = ''; 
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('contentId').value;
        
        // Criamos o objeto de dados
        const data = Object.fromEntries(new FormData(form));
        
        // FORÇAMOS o valor do tipo e do tmdb_id (já que campos readonly/disabled às vezes falham no FormData)
        data.tipo = document.getElementById('tipo').value;
        data.tmdb_id = document.getElementById('tmdb_id').value;
        data.duracao = document.getElementById('duracao').value;

        console.log("Dados a enviar para o servidor:", data); // Verifica se aqui aparece 'tv'

        const url = id ? `/backoffice/conteudos/${id}` : '/backoffice/conteudos';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                location.reload(); 
            } else {
                const errorData = await response.json();
                alert("Erro: " + (errorData.error || "Falha ao guardar"));
            }
        } catch (err) {
            alert("Erro de rede ao comunicar com o servidor.");
        }
    });
}

// --- PESQUISA DE FILTROS ---
document.addEventListener('DOMContentLoaded', () => {
    const filterInput = document.querySelector('input[name="q"]');
    const filterForm = filterInput ? filterInput.closest('form') : null;

    // Garante que o modal começa fechado ao carregar a página
    if(modal) modal.style.display = 'none';

    if (filterInput && filterForm) {
        let timeout = null;

        filterInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                filterForm.submit();
            }, 500); 
        });

        const val = filterInput.value;
        filterInput.value = '';
        filterInput.focus();
        filterInput.value = val;
    }
});

async function deleteContent(id) {
    if (confirm("Tem a certeza que deseja eliminar este conteúdo?")) {
        try {
            const response = await fetch(`/backoffice/conteudos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                location.reload();
            } else {
                alert("Erro ao eliminar o conteúdo.");
            }
        } catch (err) {
            alert("Erro ao comunicar com o servidor.");
        }
    }
}