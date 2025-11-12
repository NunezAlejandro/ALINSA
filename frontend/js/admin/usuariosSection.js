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

    const rolSelect = document.getElementById("rolSelect");
    const camposUsuario = document.getElementById("camposUsuario");
    const crearUsuarioForm = document.getElementById("crearUsuarioForm");
    const usuariosTableBody = document.querySelector("#usuariosTable tbody");
    const submitBtn = crearUsuarioForm.querySelector("button[type='submit']");

    rolSelect.addEventListener("change", () => {
        if (rolSelect.value) {
            camposUsuario.classList.remove("d-none");
        } else {
            camposUsuario.classList.add("d-none");
        }
    });

    async function cargarUsuarios() {
        try {
            const res = await fetch("http://localhost:3000/api/usuarios");
            const usuarios = await res.json();

            usuariosTableBody.innerHTML = "";
            usuarios.forEach(usuario => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${usuario.id_usuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-btn">Editar</button>
                        <button class="btn btn-sm btn-danger borrar-btn">Borrar</button>
                    </td>
                `;
                usuariosTableBody.appendChild(row);

                row.querySelector(".editar-btn").addEventListener("click", () => {
                    document.getElementById("nombreUsuario").value = usuario.nombre;
                    document.getElementById("apellidoUsuario").value = usuario.apellido;
                    document.getElementById("correoUsuario").value = usuario.correo;
                    document.getElementById("contrasenaUsuario").value = usuario.contrasena;
                    rolSelect.value = usuario.rol;
                    camposUsuario.classList.remove("d-none");
                    crearUsuarioForm.dataset.editId = usuario.id_usuario;
                    submitBtn.textContent = "Actualizar Usuario";
                    mostrarNotificacion(`Editando usuario: ${usuario.nombre} ${usuario.apellido}`, "advertencia");
                });

                row.querySelector(".borrar-btn").addEventListener("click", async () => {
                    const confirmar = confirm(`¿Seguro que deseas borrar al usuario ${usuario.nombre} ${usuario.apellido}?`);
                    if (!confirmar) return;

                    try {
                        const res = await fetch(`http://localhost:3000/api/usuarios/${usuario.id_usuario}`, {
                            method: "DELETE"
                        });
                        const data = await res.json();

                        if (res.ok) {
                            mostrarNotificacion(data.message, "exito");
                            cargarUsuarios();
                        } else {
                            mostrarNotificacion(data.error || "Error al borrar el usuario", "error");
                        }
                    } catch (error) {
                        console.error("Error al borrar usuario:", error);
                        mostrarNotificacion("Error al borrar el usuario", "error");
                    }
                });
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            mostrarNotificacion("Error al cargar los usuarios, revisa el servidor.", "error");
        }
    }

    crearUsuarioForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const idEdit = crearUsuarioForm.dataset.editId;

        const usuarioData = {
            nombre: document.getElementById("nombreUsuario").value.trim(),
            apellido: document.getElementById("apellidoUsuario").value.trim(),
            correo: document.getElementById("correoUsuario").value.trim(),
            contrasena: document.getElementById("contrasenaUsuario").value.trim(),
            rol: rolSelect.value
        };

        if (Object.values(usuarioData).some(v => !v)) {
            mostrarNotificacion("Todos los campos son obligatorios", "advertencia");
            return;
        }

        const rolesValidos = ["administrador", "salud", "docente"];
        if (!rolesValidos.includes(usuarioData.rol)) {
            mostrarNotificacion("Rol inválido", "error");
            return;
        }

        try {
            const url = idEdit
                ? `http://localhost:3000/api/usuarios/${idEdit}`
                : "http://localhost:3000/api/usuarios";
            const method = idEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuarioData)
            });

            const data = await res.json();

            if (res.ok) {
                mostrarNotificacion(data.message, "exito");
                crearUsuarioForm.reset();
                camposUsuario.classList.add("d-none");
                delete crearUsuarioForm.dataset.editId;
                submitBtn.textContent = "Crear Usuario";
                cargarUsuarios();
            } else {
                mostrarNotificacion(data.error || "Ocurrió un error al guardar el usuario", "error");
            }
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            mostrarNotificacion("Ocurrió un error al guardar el usuario", "error");
        }
    });

    cargarUsuarios();
});