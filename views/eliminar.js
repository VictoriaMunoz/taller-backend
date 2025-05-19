export async function init() {
  const cont = document.getElementById("lista-eliminar");

  const res = await fetch('http://localhost:3000/motos');
  const motos = await res.json();

  if (motos.length === 0) {
    cont.innerHTML = "<p>No hay motos para eliminar.</p>";
    return;
  }

  cont.innerHTML = "";
  motos.forEach(moto => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${moto.placa}</strong> - ${moto.nombre}<br/>
      Trabajo: ${moto.trabajo}<br/>
      <button onclick="eliminar('${moto._id}')">Eliminar</button>
      <hr/>
    `;
    cont.appendChild(div);
  });

  window.eliminar = async function (id) {
    if (confirm("¿Eliminar esta moto?")) {
      await fetch(`http://localhost:3000/motos/${id}`, {
        method: "DELETE"
      });
      init(); // recargar
    }
  };
}
