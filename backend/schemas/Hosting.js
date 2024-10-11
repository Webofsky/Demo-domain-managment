const mongoose = require('mongoose')

const hostingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

hostingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Hosting", hostingSchema)