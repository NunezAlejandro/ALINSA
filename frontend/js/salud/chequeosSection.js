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

    const crearChequeoForm = document.getElementById("crearChequeoForm");
    const estudianteSelect = document.getElementById("estudianteSelect");
    const pesoInput = document.getElementById("peso");
    const tallaInput = document.getElementById("talla");
    const imcInput = document.getElementById("imc");
    const historialTableBody = document.querySelector("#historialTable tbody");

    async function cargarEstudiantes() {
        try {
            const res = await fetch("http://localhost:3000/api/estudiantes");
            const estudiantes = await res.json();
            estudianteSelect.innerHTML = `<option value="">-- Selecciona un estudiante --</option>`;
            estudiantes.forEach(est => {
                const option = document.createElement("option");
                option.value = est.id_estudiante;
                option.textContent = `${est.nombre} ${est.apellido}`;
                estudianteSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar estudiantes:", error);
            mostrarNotificacion("Error al cargar estudiantes", "error");
        }
    }

    function calcularIMC() {
        const peso = parseFloat(pesoInput.value);
        const tallaCm = parseFloat(tallaInput.value);
        if (peso && tallaCm) {
            const tallaM = tallaCm / 100;
            const imc = peso / (tallaM * tallaM);
            imcInput.value = imc.toFixed(2);
        } else {
            imcInput.value = "";
        }
    }

    pesoInput.addEventListener("input", calcularIMC);
    tallaInput.addEventListener("input", calcularIMC);

    async function cargarChequeos() {
        try {
            const res = await fetch("http://localhost:3000/api/chequeos");
            const chequeos = await res.json();
            historialTableBody.innerHTML = "";

            chequeos.forEach(ch => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${ch.id_chequeo}</td>
                    <td>${ch.nombre_estudiante || "—"}</td>
                    <td>${ch.fecha}</td>
                    <td>${ch.peso}</td>
                    <td>${ch.talla}</td>
                    <td>${ch.imc}</td>
                    <td>${ch.observaciones || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-btn">Editar</button>
                        <button class="btn btn-sm btn-danger borrar-btn">Borrar</button>
                    </td>
                `;
                historialTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar chequeos:", error);
            mostrarNotificacion("Error al cargar chequeos", "error");
        }
    }

    async function actualizarDashboard() {
        try {
            const res = await fetch("http://localhost:3000/api/chequeos");
            const chequeos = await res.json();

            const hoy = new Date().toISOString().split("T")[0];
            const chequeosHoy = chequeos.filter(ch => ch.fecha === hoy);
            const alertas = chequeos.filter(ch => ch.imc < 18.5 || ch.imc > 25);

            document.getElementById("totalChequeosHoy").textContent = chequeosHoy.length;
            document.getElementById("totalAlertas").textContent = alertas.length;
        } catch (error) {
            console.error("Error al actualizar dashboard:", error);
        }
    }

    crearChequeoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const chequeoData = {
            estudiante_id: estudianteSelect.value,
            fecha: document.getElementById("fechaChequeo").value,
            peso: parseFloat(pesoInput.value),
            talla: parseFloat(tallaInput.value),
            imc: parseFloat(imcInput.value),
            observaciones: document.getElementById("observaciones").value,
        };

        if (!chequeoData.estudiante_id || !chequeoData.fecha || !chequeoData.peso || !chequeoData.talla) {
            mostrarNotificacion("Completa todos los campos obligatorios", "advertencia");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/api/chequeos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chequeoData)
            });

            const data = await res.json();
            if (res.ok) {
                mostrarNotificacion("Chequeo registrado correctamente", "exito");
                crearChequeoForm.reset();
                imcInput.value = "";
                await cargarChequeos();
                await actualizarDashboard();
            } else {
                mostrarNotificacion(data.error || "Error al registrar chequeo", "error");
            }
        } catch (error) {
            console.error("Error al registrar chequeo:", error);
            mostrarNotificacion("Error de conexión al servidor", "error");
        }
    });

    cargarEstudiantes();
    cargarChequeos();
    actualizarDashboard();
});