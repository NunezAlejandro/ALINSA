document.addEventListener("DOMContentLoaded", () => {
    function mostrarNotificacion(mensaje, tipo = "exito") {
        let container = document.getElementById("notificacionesContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "notificacionesContainer";
            container.classList.add("notificaciones-container");
            document.body.appendChild(container);
        }

        const noti = document.createElement("div");
        noti.className = `notificacion ${tipo}`;
        noti.textContent = mensaje;
        container.appendChild(noti);

        setTimeout(() => noti.classList.add("mostrar"), 50);
        setTimeout(() => {
            noti.classList.remove("mostrar");
            setTimeout(() => noti.remove(), 400);
        }, 3000);
    }

    const reportesTableBody = document.querySelector("#reportesTable tbody");
    const busquedaInput = document.getElementById("busquedaReporte");
    let reportesData = [];

    async function cargarReportes() {
        try {
            const res = await fetch("http://localhost:3000/api/reportes");
            reportesData = await res.json();
            mostrarReportes(reportesData);
            mostrarNotificacion("Reportes cargados correctamente.", "exito");
        } catch (error) {
            console.error("Error al cargar reportes:", error);
            mostrarNotificacion("No se pudieron cargar los reportes. Revisa el servidor.", "error");
        }
    }

    function mostrarReportes(reportes) {
        reportesTableBody.innerHTML = "";
        reportes.forEach(reporte => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reporte.id_reporte}</td>
                <td>${reporte.titulo || "Sin título"}</td>
                <td>${reporte.fecha_generacion || "Sin fecha"}</td>
                <td>${reporte.descripcion ? reporte.descripcion.substring(0, 60) + "..." : "Sin descripción"}</td>
                <td>${reporte.generado_por || "Desconocido"}</td>
                <td>
                    <button class="btn btn-sm btn-primary ver-btn">Ver</button>
                    <button class="btn btn-sm btn-success descargar-btn">Descargar</button>
                </td>
            `;
            reportesTableBody.appendChild(row);

            row.querySelector(".ver-btn").addEventListener("click", () => {
                mostrarNotificacion(`Visualizando: ${reporte.titulo}`, "advertencia");
            });

            row.querySelector(".descargar-btn").addEventListener("click", () => {
                mostrarNotificacion(`Descargando reporte "${reporte.titulo}"...`, "exito");
            });
        });
    }

    busquedaInput.addEventListener("input", () => {
        const filtro = busquedaInput.value.toLowerCase();
        const filtrados = reportesData.filter(r =>
            (r.titulo && r.titulo.toLowerCase().includes(filtro)) ||
            (r.fecha_generacion && r.fecha_generacion.toLowerCase().includes(filtro))
        );
        mostrarReportes(filtrados);

        if (filtrados.length === 0) {
            mostrarNotificacion("No se encontraron reportes que coincidan.", "advertencia");
        }
    });

    cargarReportes();
});