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

    const crearEstudianteForm = document.getElementById("crearEstudianteForm");
    const estudiantesTableBody = document.querySelector("#estudiantesTable tbody");
    const submitBtn = crearEstudianteForm.querySelector('button[type="submit"]');

    async function cargarEstudiantes() {
        try {
            const res = await fetch("http://localhost:3000/api/estudiantes");
            const estudiantes = await res.json();

            estudiantesTableBody.innerHTML = "";
            estudiantes.forEach(estudiante => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${estudiante.id_estudiante}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.apellido}</td>
                    <td>${estudiante.dni || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-btn">Editar</button>
                        <button class="btn btn-sm btn-danger borrar-btn">Borrar</button>
                    </td>
                `;
                estudiantesTableBody.appendChild(row);

                row.querySelector(".editar-btn").addEventListener("click", () => {
                    document.getElementById("nombreEstudiante").value = estudiante.nombre;
                    document.getElementById("apellidoEstudiante").value = estudiante.apellido;
                    document.getElementById("dniEstudiante").value = estudiante.dni || '';
                    crearEstudianteForm.dataset.editId = estudiante.id_estudiante;
                    submitBtn.textContent = "Actualizar Estudiante";
                    mostrarNotificacion(`Editando estudiante: ${estudiante.nombre} ${estudiante.apellido}`, "advertencia");
                });

                row.querySelector(".borrar-btn").addEventListener("click", async () => {
                    const confirmar = confirm(`¿Seguro que deseas borrar a ${estudiante.nombre} ${estudiante.apellido}?`);
                    if (!confirmar) return;

                    try {
                        const res = await fetch(`http://localhost:3000/api/estudiantes/${estudiante.id_estudiante}`, {
                            method: "DELETE"
                        });
                        const data = await res.json();
                        if (res.ok) {
                            mostrarNotificacion(data.message, "exito");
                            cargarEstudiantes();
                        } else {
                            mostrarNotificacion(data.message || "Error al borrar estudiante", "error");
                        }
                    } catch (error) {
                        console.error("Error al borrar estudiante:", error);
                        mostrarNotificacion("Error al borrar estudiante", "error");
                    }
                });
            });
        } catch (error) {
            console.error("Error al cargar estudiantes:", error);
            mostrarNotificacion("Error al cargar los estudiantes, revisa el servidor.", "error");
        }
    }

    crearEstudianteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idEdit = crearEstudianteForm.dataset.editId;

        const estudianteData = {
            nombre: document.getElementById("nombreEstudiante").value.trim(),
            apellido: document.getElementById("apellidoEstudiante").value.trim(),
            dni: document.getElementById("dniEstudiante").value.trim() || null
        };

        if (!estudianteData.nombre || !estudianteData.apellido) {
            mostrarNotificacion("Nombre y apellido son obligatorios", "advertencia");
            return;
        }

        try {
            const url = idEdit
                ? `http://localhost:3000/api/estudiantes/${idEdit}`
                : "http://localhost:3000/api/estudiantes";
            const method = idEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(estudianteData)
            });
            const data = await res.json();

            if (res.ok) {
                mostrarNotificacion(data.message, "exito");
                crearEstudianteForm.reset();
                delete crearEstudianteForm.dataset.editId;
                submitBtn.textContent = "Crear Estudiante";
                cargarEstudiantes();
            } else {
                mostrarNotificacion(data.message || "Ocurrió un error al guardar el estudiante", "error");
            }
        } catch (error) {
            console.error("Error al guardar estudiante:", error);
            mostrarNotificacion("Ocurrió un error al guardar el estudiante", "error");
        }
    });

    cargarEstudiantes();
});