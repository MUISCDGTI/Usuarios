const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    phone: {
        type: Number,
        required: true
    }
});

contactSchema.methods.cleanup = function() {
    return {name: this.name, phone: this.phone};
}

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;