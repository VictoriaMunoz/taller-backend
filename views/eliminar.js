import { API_URL } from '../config.js';

export async function init() {
  const cont = document.getElementById("lista-eliminar");
  const res = await fetch(API_URL);
  const motos = await res.json();

  cont.innerHTML = "";

  motos.forEach(moto => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${moto.placa}</strong> - ${moto.nombre}</p>
      <button onclick="eliminar('${moto._id}')">Eliminar</button>
      <hr/>
    `;
    cont.appendChild(div);
  });

  window.eliminar = async (id) => {
    if (confirm("¿Eliminar esta moto?")) {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      init(); // recargar
    }
  };
}
