document.addEventListener("DOMContentLoaded", () => {
    const totalUsuariosElem = document.getElementById("totalUsuarios");
    const totalEstudiantesElem = document.getElementById("totalEstudiantes");
    const totalChequeosElem = document.getElementById("totalChequeos");
    const totalReportesElem = document.getElementById("totalReportes");

    async function actualizarTotales() {
        try {
            const resUsuarios = await fetch("http://localhost:3000/api/usuarios");
            const usuarios = await resUsuarios.json();
            totalUsuariosElem.textContent = usuarios.length;

            const resEstudiantes = await fetch("http://localhost:3000/api/estudiantes");
            const estudiantes = await resEstudiantes.json();
            totalEstudiantesElem.textContent = estudiantes.length;

            const resChequeos = await fetch("http://localhost:3000/api/chequeos");
            const chequeos = await resChequeos.json();
            totalChequeosElem.textContent = chequeos.length;

            const resReportes = await fetch("http://localhost:3000/api/reportes");
            const reportes = await resReportes.json();
            totalReportesElem.textContent = reportes.length;

        } catch (error) {
            console.error("Error al actualizar totales del dashboard:", error);
        }
    }

    actualizarTotales();

    setInterval(actualizarTotales, 60000);
});