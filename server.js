const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

// 🌐 Conexión MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB", err));

// 🧩 Middleware para verificar el token
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Token requerido");
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Token inválido");
  }
}

// ✅ Rutas protegidas: obtener info del usuario autenticado
app.post("/api/me", verifyToken, async (req, res) => {
  const { uid, email } = req.user;
  let user = await User.findOne({ uid });

  if (!user) {
    user = new User({
      uid,
      email,
      nombre: req.user.name || "Sin nombre",
      rol: "cliente",
    });
    await user.save();
  }

  res.json(user);
});

// ================================
// 🛠️ Rutas existentes del taller
// ================================
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
  fotos: Array,
});

const Moto = mongoose.model("Moto", motoSchema);

app.get("/motos", async (req, res) => {
  const motos = await Moto.find();
  res.json(motos);
});

app.post("/motos", async (req, res) => {
  try {
    const nuevaMoto = new Moto(req.body);
    await nuevaMoto.save();
    res.status(201).json(nuevaMoto);
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    res.status(400).send("Error al guardar moto. Verifica los datos enviados.");
  }
});

app.delete("/motos/:id", async (req, res) => {
  try {
    await Moto.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: "Moto eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar moto" });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 API del Taller de Motos funcionando");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
