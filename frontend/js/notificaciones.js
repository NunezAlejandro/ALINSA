function mostrarNotificacion(mensaje, tipo = "exito") {
    const container = document.getElementById("notificacionesContainer");
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