const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  nombre: String,
  rol: {
    type: String,
    enum: ['admin', 'mecanico', 'cliente'],
    default: 'cliente'
  }
});

module.exports = mongoose.model('User', userSchema);
