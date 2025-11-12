document.addEventListener("DOMContentLoaded", async () => {
    try {
        const [usuariosRes, estudiantesRes, chequeosRes, reportesRes] = await Promise.all([
            fetch("http://localhost:3000/api/usuarios"),
            fetch("http://localhost:3000/api/estudiantes"),
            fetch("http://localhost:3000/api/chequeos"),
            fetch("http://localhost:3000/api/reportes")
        ]);

        const usuarios = await usuariosRes.json();
        const estudiantes = await estudiantesRes.json();
        const chequeos = await chequeosRes.json();
        const reportes = await reportesRes.json();

        document.getElementById("totalUsuarios").textContent = usuarios.length;
        document.getElementById("totalEstudiantes").textContent = estudiantes.length;
        document.getElementById("totalChequeos").textContent = chequeos.length;
        document.getElementById("totalReportes").textContent = reportes.length;

    } catch (error) {
        console.error("Error al cargar los datos del dashboard:", error);
        alert("Error al cargar los datos del dashboard, revisa el servidor.");
    }
});