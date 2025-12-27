document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.querySelector('.profile-btn:last-child');

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            if (confirm("Deseja mesmo sair?")) {
                window.location.href = '/logout';
            }
        });
    }
});