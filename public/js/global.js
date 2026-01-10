// Confirmar logout
function confirmLogout() {
    if (confirm("Deseja mesmo sair?")) {
        window.location.href = "/logout";
    }
}

// Botão Voltar
function goBack() {
    window.history.back();
}