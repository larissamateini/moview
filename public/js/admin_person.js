// Funções do Modal
function openAddModal() {
    document.getElementById('addPersonModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addPersonModal').style.display = 'none';
    document.getElementById('addPersonForm').reset();
}

// Criar Novo Profissional
document.getElementById('addPersonForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/backoffice/diretores-atores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.reload(); // Recarrega para mostrar na tabela
        } else {
            alert("Erro ao salvar profissional.");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

// Eliminar Staff
async function eliminarStaff(id) {
    if (!confirm('Deseja mesmo remover este ator/diretor?')) return;

    try {
        const response = await fetch(`/backoffice/diretores-atores/${id}`, { 
            method: 'DELETE' 
        });
        
        const result = await response.json(); // Lê a resposta do controller

        if (response.ok && result.success) {
            const row = document.getElementById(`person-row-${id}`);
            if (row) row.remove();
        } else {
            alert("Erro ao eliminar: " + (result.error || "Erro desconhecido"));
        }
    } catch (error) {
        alert("Erro de conexão ao servidor.");
    }
}