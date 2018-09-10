const express = require( 'express' );
const router = express.Router();
const Posts = require( '../models/posts' );
const fs = require( 'fs' );
const fileUpload = require( 'express-fileupload' );

const moment = require( 'moment' );
moment.locale( 'es' );


router.get( '/:id', function( req, res, next ) {
    Posts.findById( req.params.id, function( err, post ) {
        if( !post || err ) {
            horror( next, 'Publicacion no existe' );
        }
        else {
            try {
                var list = fs.readdirSync( './public/files/' +  post._id + '/thumb' ).sort();
                
            } catch ( err ) {
                console.log( err );
            }
            try {
                var array = fs.readFileSync( './public/files/' +  post._id + '/content/txt.txt' ).toString().split( "\n" );
            } catch ( err ) {
                console.log( err );
            }
            res.render( 'info-media', {
                title: post.title,
                post: post,
                list: list,
                array: array,
                moment: moment
            });
        }
    });
});



function horror( next, text ) {
    var err = new Error( text );
    err.status = 404;
    next( err );
}



module.exports = router;