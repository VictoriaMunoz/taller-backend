export async function init() {
  const cont = document.getElementById("lista-taller");

  const res = await fetch('http://localhost:3000/motos');
  const motos = await res.json();

  if (motos.length === 0) {
    cont.innerHTML = "<p>No hay motos registradas.</p>";
    return;
  }

  cont.innerHTML = "";
  motos.forEach((moto) => {
    const ingresoDate = new Date(moto.ingreso);
    const ahora = new Date();
    const horas = Math.floor((ahora - ingresoDate) / (1000 * 60 * 60));

    if (moto.estado === "En reparación" && horas >= 2) {
      moto.estado = "Lista para entrega";
      moto.estadoHistorial.push({ estado: "Lista para entrega", fecha: ahora.toISOString() });
      actualizarEstado(moto._id, moto);
      notificar(moto, moto.estado, false);
    }

    const historialHTML = moto.estadoHistorial?.map(h =>
      `<li>${h.estado} → ${new Date(h.fecha).toLocaleString()}</li>`
    ).join("");

    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${moto.placa}</strong> - ${moto.nombre}<br/>
      <b>Tel:</b> ${moto.telefono}<br/>
      <b>Correo:</b> ${moto.correo}<br/>
      <b>Chasis:</b> ${moto.chasis}<br/>
      <b>Kilometraje:</b> ${moto.kilometraje} km<br/>
      <b>Tipo:</b> ${moto.tipo}<br/>
      <b>Trabajo:</b> <em>${moto.trabajo}</em><br/>
      ${moto.observaciones ? `<b>Observaciones:</b> ${moto.observaciones}<br/>` : ""}
      <b>Estado actual:</b>
      <select data-id="${moto._id}" class="cambio-estado">
        <option value="En reparación" ${moto.estado === "En reparación" ? "selected" : ""}>En reparación</option>
        <option value="Lista para entrega" ${moto.estado === "Lista para entrega" ? "selected" : ""}>Lista para entrega</option>
        <option value="Entregada" ${moto.estado === "Entregada" ? "selected" : ""}>Entregada</option>
      </select><br/>
      <details>
        <summary>📋 Historial de estados</summary>
        <ul>${historialHTML}</ul>
      </details>
      ${moto.fotos?.map(f => `<img src="${f}" />`).join("") ?? ""}
      <hr/>
    `;
    cont.appendChild(div);
  });

  document.querySelectorAll(".cambio-estado").forEach(select => {
    select.addEventListener("change", async () => {
      const id = select.dataset.id;
      const nuevoEstado = select.value;
      const moto = motos.find(m => m._id === id);
      moto.estado = nuevoEstado;
      moto.estadoHistorial.push({ estado: nuevoEstado, fecha: new Date().toISOString() });
      await actualizarEstado(id, moto);
      notificar(moto, nuevoEstado, true);
      init(); // recargar
    });
  });

  async function actualizarEstado(id, motoActualizada) {
    await fetch(`http://localhost:3000/motos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(motoActualizada)
    });
  }

  function notificar(moto, estado, manual) {
    const mensaje = manual
      ? `🔔 Cliente ${moto.nombre} ha sido notificado: la moto está "${estado}".`
      : `⏱ La moto de ${moto.nombre} ha cambiado automáticamente a "${estado}".`;
    alert(mensaje);
  }
}
