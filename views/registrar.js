export function init() {
  const form = document.getElementById("form-registro");

  ["cedula", "telefono", "kilometraje"].forEach(id => {
    const input = form.querySelector(`#${id}`);
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const campos = [
      "nombre", "cedula", "telefono", "correo",
      "placa", "chasis", "kilometraje", "tipo", "trabajo"
    ];

    for (const id of campos) {
      const campo = form[id];
      if (!campo.value.trim()) {
        alert(`El campo "${campo.placeholder}" es obligatorio`);
        campo.focus();
        return;
      }
    }

    const ahora = new Date().toISOString();

    const ingreso = {
      nombre: form.nombre.value.trim(),
      cedula: form.cedula.value.trim(),
      telefono: form.telefono.value.trim(),
      correo: form.correo.value.trim(),
      placa: form.placa.value.trim(),
      chasis: form.chasis.value.trim(),
      kilometraje: Number(form.kilometraje.value.trim()),
      tipo: form.tipo.value.trim(),
      trabajo: form.trabajo.value.trim(),
      observaciones: form.observaciones.value.trim(),
      estado: "En reparación",
      ingreso: ahora,
      estadoHistorial: [
        { estado: "En reparación", fecha: ahora }
      ],
      fotos: []
    };

    const archivos = form.fotos.files;
    if (archivos.length > 0) {
      let cargadas = 0;
      for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
          ingreso.fotos.push(e.target.result);
          cargadas++;
          if (cargadas === archivos.length) enviarAlServidor(ingreso);
        };
        reader.readAsDataURL(archivos[i]);
      }
    } else {
      enviarAlServidor(ingreso);
    }
  });

  async function enviarAlServidor(data) {
    try {
      const res = await fetch('https://taller-backend-production.up.railway.app', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Moto registrada exitosamente.");
        document.getElementById("form-registro").reset();
      }
    } catch (err) {
      console.error("Error al guardar moto:", err);
      alert("No se pudo guardar la moto.");
    }
  }
}
