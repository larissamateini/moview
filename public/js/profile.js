document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.querySelector('.profile-btn:last-child');
    const backBtn = document.querySelector('.back-btn');

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            if (confirm("Deseja mesmo sair?")) {
                window.location.href = '/logout';
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            console.log("Botão voltar clicado");
            window.history.back();
        });
    }
});