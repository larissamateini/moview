document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('admin-search');
    const roleFilter = document.getElementById('role-filter');
    const rows = document.querySelectorAll('.user-row');

    function filterUsers() {
        const searchVal = searchInput.value.toLowerCase();
        const roleVal = roleFilter.value;

        rows.forEach(row => {
            const userId = row.getAttribute('data-id').toLowerCase();
            const userRole = row.getAttribute('data-role').toLowerCase();

            const matchesId = userId.includes(searchVal);
            const matchesRole = roleVal === "all" || userRole === roleVal;

            row.style.display = (matchesId && matchesRole) ? "" : "none";
        });
    }

    searchInput.addEventListener('input', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
});

function editarUser(id) {
    console.log("A editar utilizador:", id);
    // Lógica
}