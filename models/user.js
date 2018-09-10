const mongoose = require( 'mongoose' );

const UserSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model( 'User', UserSchema );