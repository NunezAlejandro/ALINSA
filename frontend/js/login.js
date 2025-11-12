document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("errorMsg");

    try {
        const res = await fetch("http://localhost:3000/api/login/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password }),
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (res.ok) {
            errorMsg.textContent = "";

            switch (data.rol) {
                case "administrador":
                    window.location.href = "dashboard/admin.html";
                    break;
                case "salud":
                    window.location.href = "dashboard/salud.html";
                    break;
                case "docente":
                    window.location.href = "dashboard/docente.html";
                    break;
                default:
                    errorMsg.textContent = "Rol desconocido";
            }
        } else {
            errorMsg.textContent = data.message || "Correo o contraseña incorrectos";
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        errorMsg.textContent = "Error de conexión al servidor";
    }
});