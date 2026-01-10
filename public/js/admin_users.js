async function deleteUser(id) {
    if (!confirm('Atenção: Esta ação é irreversível. Deseja mesmo apagar este utilizador?')) {
        return;
    }

    try {
        const response = await fetch(`/backoffice/utilizadores/${id}`, { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const row = document.getElementById(`user-row-${id}`);
            if (row) {
                // Efeito visual de saída
                row.style.opacity = "0";
                row.style.transform = "translateX(20px)";
                row.style.transition = "all 0.3s ease";
                setTimeout(() => row.remove(), 300);
            }
        } else {
            const result = await response.json();
            alert("Erro: " + (result.error || "Não foi possível eliminar."));
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão ao servidor.");
    }
}