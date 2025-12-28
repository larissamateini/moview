document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('filter-role');
    const rows = document.querySelectorAll('.staff-row');

    if (roleSelect) {
        roleSelect.addEventListener('change', () => {
            const roleVal = roleSelect.value;
            rows.forEach(row => {
                const rowRole = row.getAttribute('data-role');
                if (roleVal === "" || rowRole === roleVal) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
});

function editarStaff(id) {
    console.log("Editar staff ID:", id);
    // Lógica edição
}