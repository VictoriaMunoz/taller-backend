const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error conectando a MongoDB', err));

// Esquema y modelo de Mongoose
const motoSchema = new mongoose.Schema({
  nombre: String,
  cedula: Number,
  telefono: Number,
  correo: String,
  placa: String,
  chasis: String,
  kilometraje: Number,
  tipo: String,
  trabajo: String,
  observaciones: String,
  ingreso: String,
  estado: String,
  estadoHistorial: Array,
  fotos: Array
});

const Moto = mongoose.model('Moto', motoSchema);

// Rutas API

// Obtener todas las motos
app.get('/motos', async (req, res) => {
  const motos = await Moto.find();
  res.json(motos);
});

// Registrar nueva moto
app.post('/motos', async (req, res) => {
  try {
    const nuevaMoto = new Moto(req.body);
    await nuevaMoto.save();
    res.status(201).json(nuevaMoto);
  } catch (err) {
    console.error('Error al guardar moto:', err);
    res.status(500).json({ error: 'Error al guardar moto' });
  }
});

// Eliminar moto por ID
app.delete('/motos/:id', async (req, res) => {
  try {
    await Moto.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Moto eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar moto' });
  }
});

// Ruta raíz opcional
app.get('/', (req, res) => {
  res.send('🚀 API del Taller de Motos funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
