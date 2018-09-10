const express = require( 'express' );
const router = express.Router();
const Posts = require( '../models/posts' );
const Docs = require( '../models/docs' );
const Users = require( '../models/user' );
const bcrypt = require( 'bcryptjs' );
const mkdirp = require( 'mkdirp' );

const busboy = require('connect-busboy');

//const fs = require( 'fs' );
const fs = require( 'fs-extra' );

const fileUpload = require( 'express-fileupload' );

const formidable = require('formidable');

const multer = require( 'multer' );

const moment = require( 'moment' );
moment.locale( 'es' );
const nowDate = moment.utc().toDate();





router.post( '/upload_fotos', function( req, res, next ) {
    
    var valor = req.body.know_type;    
    
    switch( valor ) {
            
        case 'NUEVA':
            req.checkBody( 'title', 'Se requiere titulo' ).notEmpty();
            req.getValidationResult().then( function( result ) {
                let errors = result.array();
                if( errors != '' ) {
                    res.render( 'admin', {
                        title: 'ADMINISTRADOR',
                        errors: errors } );
                }
                else {
                    let item = new Posts();
                    item.title = req.body.title;
                    item.author = 'GCCI';
                    item.body = '...';
                    item.fecha = nowDate;
                    item.type = 'FOTOS';
                    
                    var ruta = './public/files/' + item._id + '/album/';
                    var files = [].concat( req.files.fotos );
                    
                    create_folders( item._id, item.body );                                        
                    
                    item.save( function( err ) {
                        if( err ) console.log( err );                                                
                        save_fotos( ruta, files );                        
                        //req.flash( 'successMessage', 'añadido' );
                        //res.redirect( '/admin' );
                    });
                }
            });
            break;
            
        case 'EXISTENTE':
            var id = req.body.title;
            var files = [].concat( req.files.fotos );
            var ruta = './public/files/' + id + '/album/';
            //var dest = './public/files/' + id + '/thumb/';
            save_fotos( ruta, files );
            req.flash( 'successMessage', 'añadido' );
            res.redirect( '/admin' );
            break;            
            
    }
});







function create_folders( id, body ) {
    mkdirp( __dirname + '/../public/files/' + id + '/album', function( err ) {
        if( err ) console.log( err );
    });
    mkdirp( __dirname + '/../public/files/' + id + '/thumb', function( err ) {
        if( err ) console.log( err );
    });
    mkdirp( __dirname + '/../public/files/' + id + '/content', function( err ) {
        if( err ) console.log( err );
        var ruta = './public/files/' + id + '/content/txt.txt';
        fs.writeFile( ruta, body, function( err ) {
            if( err ) console.log( err );
        });
    });
}



function save_fotos( ruta, fotos ) {
    fotos.forEach( function ( element, index, array ) {
        element.mv( ruta+element.name, function( err ) {
            if( err ) {
                console.log( err );
                //req.flash( 'danger', 'Error al subir archivos' );
                //res.redirect( '/admin' );
            }
        });
    });
}





router.post( '/getid', function( req, res, next ) {
    Posts.find( {}, function( err, data ) {
        if( err )  throw err;
        res.send( { data: data } );
    }).sort( { fecha : -1 } );
});




router.post( '/getusers', function( req, res ) {
    Users.find( {}, function( err, data ) {
        if( err )  throw err;
        res.send( { data: data } );
    });
});




router.post( '/getuser', function( req, res ) {
    Users.findById( req.body.id, function( err, user ) {
        if( err )  throw err;
        var salt = bcrypt.genSaltSync(10);
        console.log( 'salt -----> ' + salt );
        var hash = bcrypt.hashSync( "B4c0/\/", salt );
        console.log( 'hash -----> ' + hash );
        res.send( { user: user } );
    });
});




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
            res.render( 'info-event', {
                title: post.title,
                post: post,
                list: list,
                array: array,
                moment: moment
            });
        }
    });
});




router.post( '/new_user', function( req, res ) {
    req.checkBody( 'usuario', 'Se requiere un nombre de usuario' ).notEmpty();
    req.checkBody( 'contrasenia_1', 'Se requiere una contraseña' ).notEmpty();
    req.checkBody( 'contrasenia_2', 'Las contraseñas son diferentes' ).equals( req.body.contrasenia_1 );
    req.getValidationResult().then( function( result ) {
        let errors = result.array();
        if( errors != '' ) {
            res.render( 'admin', {
                title: 'ADMINISTRADOR',
                errors: errors } );
        }
        else {
            let usuario = new Users ({
                nickname : req.body.usuario,
                password : req.body.contrasenia_1,
                type : 'admin'
            });            
            bcrypt.genSalt( 10, function( err, salt ) {
                bcrypt.hash( usuario.password, salt, function( err, hash ) {
                    if( err ) console.log( err );
                    usuario.password = hash;
                    usuario.save( function( err ) {
                        if( err ) console.log( err );
                        req.flash( 'successMessage', 'Usuario añadido' );
                        res.redirect( '/admin' );
                    });
                });
            });
        }
    });
});




router.post( '/edituser', function( req, res ) {    
    req.checkBody( 'nickname', 'Se requiere un nombre de usuario' ).notEmpty();
    req.checkBody( 'pass', 'Se requiere una contraseña' ).notEmpty();
    req.checkBody( 'type', 'Se requiere una tipo de usuario' ).notEmpty();    
    req.getValidationResult().then( function( result ) {
        let errors = result.array();
        if( errors != '' ) {
            res.render( 'admin', {
                title: 'ADMINISTRADOR',
                errors: errors } );
        }
        else {            
            req.flash( 'successMessage', 'Usuario añadido' );
            res.redirect( '/admin' );
            /*let usuario = new Users ({
                nickname : req.body.usuario,
                password : req.body.contrasenia_1,
                type : 'admin'
            });
            
            bcrypt.genSalt( 10, function( err, salt ) {
                bcrypt.hash( usuario.password, salt, function( err, hash ) {
                    if( err ) console.log( err );
                    usuario.password = hash;
                    usuario.save( function( err ) {
                        if( err ) console.log( err );
                        req.flash( 'successMessage', 'Usuario añadido' );
                        res.redirect( '/admin' );
                    });
                });
            });*/
        }
    });
});




router.post( '/new_doc', function( req, res ) {
    req.checkBody( 'title', 'Se requiere titulo' ).notEmpty();
    req.checkBody( 'description', 'Se requiere descripcion' ).notEmpty();
    req.getValidationResult().then( function( result ) {
        let errors = result.array();
        if( errors != '' ) {
            res.render( 'admin', {
                title: 'ADMINISTRADOR',
                errors: errors } );
        }
        else {
            let archivo = req.files.archivo;
            let nowDate = moment.utc().toDate();
            let doc = new Docs();
            doc.title = req.body.title;
            doc.description = req.body.description;
            doc.name = archivo.name;
            doc.fecha = nowDate;
            doc.type = 'public';
            doc.save( function( err ) {
                if( err ) {
                    req.flash( 'danger', 'Error con la información del archivos' );
                    res.redirect( '/admin' );
                }
                let ruta = './public/docs/' + archivo.name;
                archivo.mv( ruta, function( err ) {
                    if( err ) {
                        req.flash( 'danger', 'Error al subir archivos' );
                        res.redirect( '/admin' );
                    }
                    req.flash( 'successMessage', 'Documento subido' );
                    res.redirect( '/admin' );
                });
            });
        }
    });
});




router.post( '/new_post', function( req, res ) {
    req.checkBody( 'title', 'Se requiere titulo' ).notEmpty();
    req.checkBody( 'author', 'Se requiere autor' ).notEmpty();
    req.checkBody( 'body', 'Se requiere cuerpo' ).notEmpty();
    req.checkBody( 'type', 'Se requiere tipo de publicacion' ).notEmpty();    
    req.getValidationResult().then( function( result ) {
        let errors = result.array();
        if( errors != '' ) {
            res.render( 'admin', {
                title: 'ADMINISTRADOR',
                errors: errors } );
        }
        else {
            let articulo = new Posts();
            articulo.title = req.body.title;
            articulo.author = req.body.author;
            articulo.body = req.body.body.split("\n")[0];
            articulo.fecha = nowDate;
            articulo.type = req.body.type;
            articulo.save( function( err ) {
                if( err ) console.log( err );
                create_folders( articulo._id, req.body.body );
                req.flash( 'successMessage', 'Evento añadido' );
                res.redirect( '/admin' );
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