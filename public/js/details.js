document.addEventListener('DOMContentLoaded', () => {
    // Botão Voltar
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Favoritos nos cards
    const favButtons = document.querySelectorAll('.favorite-btn');
    favButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const img = this.querySelector('img');
            if (img.src.includes('empty')) {
                img.src = '/public/images/icon-fav-full.svg';
            } else {
                img.src = '/public/images/icon-fav-empty.svg';
            }
        });
    });

    // Sistema de Like nas Reviews
    const reviewBtns = document.querySelectorAll('.review-btn');
    reviewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const counter = btn.nextElementSibling;
            let count = parseInt(counter.textContent);
            
            // Toggle simples para demonstração
            if (btn.classList.toggle('active')) {
                counter.textContent = count + 1;
                btn.style.filter = "invert(48%) sepia(70%) saturate(2476%) hue-rotate(331%) brightness(102%) contrast(105%)"; // Cor de destaque
            } else {
                counter.textContent = count - 1;
                btn.style.filter = "none";
            }
        });
    });
});