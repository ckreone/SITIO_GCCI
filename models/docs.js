const mongoose = require( 'mongoose' );

const docsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String
        //required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    }
});

let Docs = module.exports = mongoose.model( 'Docs', docsSchema );