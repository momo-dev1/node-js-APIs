const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide a name'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username must be at most 20 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            , 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [32, 'Password must be at most 32 characters'],
    }
});


module.exports = model('User', UserSchema);