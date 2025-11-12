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

    const crearAulaForm = document.getElementById("crearAulaForm");
    const aulasTableBody = document.querySelector("#aulasTable tbody");
    const docenteSelect = document.getElementById("docenteAula");
    const submitBtn = crearAulaForm.querySelector("button[type='submit']");

    async function cargarDocentes() {
        try {
            const res = await fetch("http://localhost:3000/api/usuarios");
            const usuarios = await res.json();
            docenteSelect.innerHTML = '<option value="">-- Selecciona un docente --</option>';
            usuarios.filter(u => u.rol === 'docente').forEach(docente => {
                const option = document.createElement('option');
                option.value = docente.id_usuario;
                option.textContent = `${docente.nombre} ${docente.apellido}`;
                docenteSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar docentes:", error);
            mostrarNotificacion("Error al cargar la lista de docentes.", "error");
        }
    }

    async function cargarAulas() {
        try {
            const res = await fetch("http://localhost:3000/api/aulas");
            const aulas = await res.json();

            aulasTableBody.innerHTML = "";
            aulas.forEach(aula => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${aula.id_aula}</td>
                    <td>${aula.grado}</td>
                    <td>${aula.seccion}</td>
                    <td>${aula.docente_id || "-"}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-btn">Editar</button>
                        <button class="btn btn-sm btn-danger borrar-btn">Borrar</button>
                    </td>
                `;
                aulasTableBody.appendChild(row);

                row.querySelector(".editar-btn").addEventListener("click", () => {
                    document.getElementById("gradoAula").value = aula.grado;
                    document.getElementById("seccionAula").value = aula.seccion;
                    docenteSelect.value = aula.docente_id || "";
                    crearAulaForm.dataset.editId = aula.id_aula;
                    submitBtn.textContent = "Actualizar Aula";
                    mostrarNotificacion(`Editando aula: ${aula.grado} - ${aula.seccion}`, "advertencia");
                });

                row.querySelector(".borrar-btn").addEventListener("click", async () => {
                    const confirmar = confirm(`¿Seguro que deseas borrar el aula ${aula.grado} - ${aula.seccion}?`);
                    if (!confirmar) return;

                    try {
                        const res = await fetch(`http://localhost:3000/api/aulas/${aula.id_aula}`, {
                            method: "DELETE"
                        });
                        const data = await res.json();

                        if (res.ok) {
                            mostrarNotificacion(data.message, "exito");
                            cargarAulas();
                        } else {
                            mostrarNotificacion(data.error || "Error al borrar el aula", "error");
                        }
                    } catch (error) {
                        console.error("Error al borrar aula:", error);
                        mostrarNotificacion("Error al borrar el aula", "error");
                    }
                });
            });
        } catch (error) {
            console.error("Error al cargar aulas:", error);
            mostrarNotificacion("Error al cargar las aulas, revisa el servidor.", "error");
        }
    }

    crearAulaForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idEdit = crearAulaForm.dataset.editId;

        const nuevaAula = {
            grado: document.getElementById("gradoAula").value.trim(),
            seccion: document.getElementById("seccionAula").value.trim(),
            docente_id: docenteSelect.value || null
        };

        if (!nuevaAula.grado || !nuevaAula.seccion) {
            mostrarNotificacion("Grado y sección son obligatorios", "advertencia");
            return;
        }

        try {
            const url = idEdit
                ? `http://localhost:3000/api/aulas/${idEdit}`
                : "http://localhost:3000/api/aulas";
            const method = idEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaAula)
            });

            const data = await res.json();

            if (res.ok) {
                mostrarNotificacion(data.message, "exito");
                crearAulaForm.reset();
                delete crearAulaForm.dataset.editId;
                submitBtn.textContent = "Crear Aula";
                cargarAulas();
            } else {
                mostrarNotificacion(data.error || "Ocurrió un error al guardar el aula", "error");
            }
        } catch (error) {
            console.error("Error al guardar aula:", error);
            mostrarNotificacion("Ocurrió un error al guardar el aula", "error");
        }
    });

    cargarDocentes();
    cargarAulas();
});