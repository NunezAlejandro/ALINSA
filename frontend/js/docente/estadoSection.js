document.addEventListener("DOMContentLoaded", () => {
    const estadoNutricionalTableBody = document.querySelector("#estadoNutricionalTable tbody");

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

    async function cargarEstadoNutricional() {
        try {
            const res = await fetch("http://localhost:3000/api/chequeos");
            if (!res.ok) throw new Error("Error al obtener los datos");

            const chequeos = await res.json();
            estadoNutricionalTableBody.innerHTML = "";

            chequeos.forEach(ch => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${ch.id_chequeo}</td>
                    <td>${ch.nombre_estudiante} ${ch.apellido_estudiante}</td>
                    <td>${ch.fecha}</td>
                    <td>${ch.peso}</td>
                    <td>${ch.talla}</td>
                    <td>${ch.imc}</td>
                    <td>${ch.observaciones || ''}</td>
                `;
                estadoNutricionalTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar estado nutricional:", error);
            mostrarNotificacion("Error al cargar el estado nutricional.", "error");
        }
    }

    cargarEstadoNutricional();
});