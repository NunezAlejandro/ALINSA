document.addEventListener("DOMContentLoaded", async () => {
    try {
        const [chequeosRes, alertasRes] = await Promise.all([
            fetch("http://localhost:3000/api/chequeos"),
            fetch("http://localhost:3000/api/alertas")
        ]);
        const chequeos = await chequeosRes.json();
        const alertas = await alertasRes.json();

        document.getElementById("totalChequeosHoy").textContent = chequeos.length;
        document.getElementById("totalAlertas").textContent = alertas.length;

    } catch (error) {
        console.error("Error al cargar los datos del dashboard de salud:", error);
        alert("Error al cargar los datos del dashboard, revisa el servidor.");
    }
});