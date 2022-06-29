const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const taxSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },

    totalSales: {
        type: Number,
        required: true,
    },

    City: {
        type: String,
        required: true
    },

    date: {
        type: Date
    },

    SGST: {
        type: Number,
        required: true
    },

    CGST: {
        type: Number,
        required: true
    },

    taxSlab: {
        type: Number,
        enum: [5, 12, 18, 28]

    },
    taxStatus: {
        type: String,
        enum: ['New', 'Paid', 'Delayed', 'inProcess'],
        default: 'inProcess'
    },

    taxDue: {
        type: String,
        enum: ["delayed", "new"],

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
}, { timestamps: true })

module.exports=mongoose.model("tax",taxSchema)