function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(sec => sec.classList.add('d-none'));
    document.getElementById(seccionId).classList.remove('d-none');
}

const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const links = document.querySelectorAll('.sidebar-link');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const texto = link.textContent.trim().toLowerCase();

        switch (texto) {
            case 'inicio': mostrarSeccion('inicioSection'); break;
            case 'estado nutricional': mostrarSeccion('estadoNutricionalSection'); break;
            case 'configuración': mostrarSeccion('configuracionSection'); break;
        }

        sidebar.classList.remove('active');
        content.classList.remove('active');
    });
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "../index.html";
    });
}; 