import { API_URL } from '../config.js';

export async function init() {
  const cont = document.getElementById("lista-taller");
  const res = await fetch(API_URL);
  const motos = await res.json();

  cont.innerHTML = "";

  motos.forEach(moto => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${moto.placa} - ${moto.nombre}</h3>
      <p><strong>Estado:</strong> ${moto.estado}</p>
      <p><strong>Trabajo:</strong> ${moto.trabajo}</p>
      <p><strong>Ingresó:</strong> ${new Date(moto.ingreso).toLocaleString()}</p>
      <hr/>
    `;
    cont.appendChild(div);
  });
}
