document.addEventListener("DOMContentLoaded", async () => {
    try {
        const [estudiantesRes, chequeosRes] = await Promise.all([
            fetch("http://localhost:3000/api/estudiantes"),
            fetch("http://localhost:3000/api/chequeos")
        ]);

        if (!estudiantesRes.ok || !chequeosRes.ok) {
            throw new Error("Error al obtener datos del servidor");
        }

        const estudiantes = await estudiantesRes.json();
        const chequeos = await chequeosRes.json();

        document.getElementById("totalEstudiantes").textContent = estudiantes.length;
        document.getElementById("totalChequeosRecientes").textContent = chequeos.length;

    } catch (error) {
        console.error("Error al cargar los datos del dashboard docente:", error);
        alert("Error al cargar los datos del dashboard, revisa el servidor.");
    }
});