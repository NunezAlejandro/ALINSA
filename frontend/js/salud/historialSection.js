document.addEventListener("DOMContentLoaded", () => {
    const historialTableBody = document.querySelector("#historialTable tbody");

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

    function showConfirm(message) {
        return new Promise(resolve => {
            let overlay = document.getElementById("confirmOverlay");
            if (overlay) overlay.remove();

            overlay = document.createElement("div");
            overlay.id = "confirmOverlay";
            overlay.className = "confirm-overlay";
            overlay.innerHTML = `
                <div class="confirm-modal">
                    <p>${message}</p>
                    <div class="confirm-actions">
                        <button id="confirmYes" class="btn btn-sm btn-danger">Sí</button>
                        <button id="confirmNo" class="btn btn-sm btn-secondary">No</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector("#confirmYes").addEventListener("click", () => {
                overlay.remove();
                resolve(true);
            });
            overlay.querySelector("#confirmNo").addEventListener("click", () => {
                overlay.remove();
                resolve(false);
            });
        });
    }

    async function cargarHistorial() {
        try {
            const res = await fetch("http://localhost:3000/api/chequeos");
            const chequeos = await res.json();

            historialTableBody.innerHTML = "";

            chequeos.forEach(ch => {
                const row = document.createElement("tr");
                row.dataset.id = ch.id_chequeo;
                row.dataset.estudianteId = ch.estudiante_id;
                row.innerHTML = `
                    <td>${ch.id_chequeo}</td>
                    <td>${ch.nombre_estudiante} ${ch.apellido_estudiante}</td>
                    <td>${ch.fecha}</td>
                    <td>${ch.peso}</td>
                    <td>${ch.talla}</td>
                    <td>${ch.imc}</td>
                    <td>${ch.observaciones || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-btn">Editar</button>
                        <button class="btn btn-sm btn-danger borrar-btn">Borrar</button>
                    </td>
                `;
                historialTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar historial:", error);
            mostrarNotificacion("Error al cargar el historial, revisa el servidor.", "error");
        }
    }

    historialTableBody.addEventListener("click", async (e) => {
        const editarBtn = e.target.closest(".editar-btn");
        const borrarBtn = e.target.closest(".borrar-btn");
        const row = e.target.closest("tr");
        if (!row) return;

        const idChequeo = row.dataset.id;
        if (editarBtn) {
            mostrarNotificacion("Se abrirá la sección de Chequeos para editar este registro", "advertencia");

            const registrarSection = document.getElementById("registrarChequeoSection");
            const inicioSection = document.getElementById("historialSection");

            registrarSection.classList.remove("d-none");
            inicioSection.classList.add("d-none");

            document.getElementById("estudianteSelect").value = row.dataset.estudianteId || "";
            document.getElementById("peso").value = row.children[3].textContent || "";
            document.getElementById("talla").value = row.children[4].textContent || "";
            document.getElementById("imc").value = row.children[5].textContent || "";
            document.getElementById("observaciones").value = row.children[6].textContent || "";
            document.getElementById("fechaChequeo").value = row.children[2].textContent || "";

            document.getElementById("crearChequeoForm").dataset.editId = idChequeo;
            return;
        }

        if (borrarBtn) {
            const nombreEst = row.children[1].textContent;
            const confirmado = await showConfirm(`¿Deseas borrar el chequeo del estudiante ${nombreEst}?`);
            if (!confirmado) return;

            try {
                const res = await fetch(`http://localhost:3000/api/chequeos/${idChequeo}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();

                if (res.ok) {
                    mostrarNotificacion(data.message || "Chequeo borrado correctamente", "exito");
                    await cargarHistorial();
                } else {
                    mostrarNotificacion(data.error || "Error al borrar el chequeo", "error");
                }
            } catch (error) {
                console.error("Error al borrar chequeo:", error);
                mostrarNotificacion("Error al borrar el chequeo", "error");
            }
            return;
        }
    });

    cargarHistorial();
});