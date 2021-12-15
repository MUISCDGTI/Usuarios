const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    name: String,
    phone: Number
});

usuarioSchema.methods.cleanup = function() {
    return {name: this.name, phone: this.phone};
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;