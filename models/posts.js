const mongoose = require( 'mongoose' );

const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

let Posts = module.exports = mongoose.model( 'Posts', PostsSchema );