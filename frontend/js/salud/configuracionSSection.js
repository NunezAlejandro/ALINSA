document.addEventListener("DOMContentLoaded", async () => {
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

    const colorInput = document.getElementById("colorMenta");
    const temaSelect = document.getElementById("temaSelect");
    const configForm = document.getElementById("configForm");
    let usuarioActual = null;
    let userKey = "default";

    async function obtenerUsuarioActual() {
        try {
            const res = await fetch("http://localhost:3000/api/usuarios/sesion");
            if (res.ok) {
                usuarioActual = await res.json();
                if (usuarioActual && usuarioActual.id_usuario) {
                    userKey = usuarioActual.id_usuario;
                }
            }
        } catch (error) {
            console.warn("No se pudo obtener usuario actual:", error);
        }
    }

    async function cargarConfiguracion() {
        await obtenerUsuarioActual();

        const colorGuardado = localStorage.getItem(`colorMenta_${userKey}`);
        const temaGuardado = localStorage.getItem(`tema_${userKey}`);

        if (colorGuardado) {
            aplicarColor(colorGuardado);
            colorInput.value = colorGuardado;
        }

        if (temaGuardado) {
            aplicarTema(temaGuardado);
            temaSelect.value = temaGuardado;
        }
    }

    configForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevoColor = colorInput.value;
        const nuevoTema = temaSelect.value;

        aplicarColor(nuevoColor);
        aplicarTema(nuevoTema);

        localStorage.setItem(`colorMenta_${userKey}`, nuevoColor);
        localStorage.setItem(`tema_${userKey}`, nuevoTema);

        mostrarNotificacion("Configuración guardada localmente para tu cuenta.", "exito");
    });

    function aplicarColor(color) {
        document.documentElement.style.setProperty("--menta", color);
        document.documentElement.style.setProperty("--menta-dark", ajustarBrillo(color, -25));
        document.documentElement.style.setProperty("--menta-light", ajustarBrillo(color, 40));
        actualizarHover();
    }

    function aplicarTema(tema) {
        if (tema === "oscuro") {
            document.documentElement.style.setProperty("--bg-light", "#1e1e1e");
            document.documentElement.style.setProperty("--text-dark", "#fff");
            document.documentElement.style.setProperty("--text-light", "#fff");
            document.body.style.backgroundColor = "#1e1e1e";

            const sidebar = document.querySelector(".sidebar");
            if (sidebar) {
                sidebar.style.backgroundColor = "#333";
                sidebar.querySelectorAll("ul li a").forEach(a => a.style.color = "#fff");
            }

            actualizarHover("oscuro");
            mostrarNotificacion("Tema oscuro activado.", "advertencia");
        } else {
            document.documentElement.style.setProperty("--bg-light", "#f5f5f5");
            document.documentElement.style.setProperty("--text-dark", "#333");
            document.documentElement.style.setProperty("--text-light", "#fff");
            document.body.style.backgroundColor = "#f5f5f5";

            const sidebar = document.querySelector(".sidebar");
            if (sidebar) {
                sidebar.style.backgroundColor = "#fff";
                sidebar.querySelectorAll("ul li a").forEach(a => a.style.color = "var(--text-dark)");
            }

            actualizarHover("claro");
            mostrarNotificacion("Tema claro activado.", "advertencia");
        }
    }

    function actualizarHover(tema = temaSelect.value) {
        const baseColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--menta").trim();
        let hoverColor;

        if (tema === "oscuro") {
            hoverColor = ajustarBrillo(baseColor, 40);
        } else {
            hoverColor = ajustarBrillo(baseColor, -60);
        }

        document.documentElement.style.setProperty("--menta-hover", hoverColor);

        const styleTag = document.getElementById("hoverStyle") || document.createElement("style");
        styleTag.id = "hoverStyle";
        styleTag.textContent = `
            button:hover, .btn:hover {
                background-color: var(--menta-hover) !important;
            }
        `;
        document.head.appendChild(styleTag);
    }

    function ajustarBrillo(hexColor, amount) {
        let col = hexColor.replace("#", "");
        let r = parseInt(col.substring(0, 2), 16);
        let g = parseInt(col.substring(2, 4), 16);
        let b = parseInt(col.substring(4, 6), 16);

        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        return (
            "#" +
            r.toString(16).padStart(2, "0") +
            g.toString(16).padStart(2, "0") +
            b.toString(16).padStart(2, "0")
        );
    }

    await cargarConfiguracion();
});