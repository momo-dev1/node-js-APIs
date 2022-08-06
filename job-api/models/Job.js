const { Schema, model, Types } = require('mongoose')

const JobSchema = new Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        enum: ["intern", "junior", "senior", "lead", "manager"],
        maxlength: 100
    },
    status: {
        type: String,
        required: [true, 'Please provide a status'],
        enum: ["applied", "interview", "pending", "hired", "rejected"],
        default: "pending"
    }, 
    jobLocation: {
        type: String,
        default: 'my city',
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, { timestamps: true })

module.exports = model('Job', JobSchema)
