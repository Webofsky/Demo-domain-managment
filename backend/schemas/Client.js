const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    domains: [
        {
            name: String,
            subdomains: [],
            lastPaid: {
                type:Date
            },
            expiredAt: {
                type: Date
            },
            services: [
                {
                    title: {
                        type:String
                    },
                    toPay: {
                        type:Number
                    },
                    paid: [
                        {
                            installment: Number,
                            title: String
                        }
                    ],
                    status: {
                        type: Boolean
                    }
                }
            ]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})


clientSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Client", clientSchema)