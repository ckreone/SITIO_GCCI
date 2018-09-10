const express = require( 'express' );
const router = express.Router();

const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt = require( 'bcryptjs' );
const passport = require( 'passport' );

const Posts = require( '../models/posts' );
const Docs = require( '../models/docs' );

const moment = require( 'moment' );
moment.locale( 'es' );

//const underscore = require( 'underscore' );
//const nodemailer = require( 'nodemailer' );

//const nodemailer = require( 'nodemailer' );
//const xoauth2 = require( 'xoauth2' );
//const smtpTransport = require( 'nodemailer-smtp-transport' );




router.get( '/', function( req, res ) {
    Posts.find( { type : { $ne : 'FOTOS' } }, function( err, posts ) {
        if( err ) console.log( err );
        var valores = posts.map( function( post ) {
            var tmpPost = post.toObject();
            var list = fs.readdirSync( './public/files/' +  tmpPost._id + '/thumb' );
            tmpPost.first_foto = list[0];
            return tmpPost;
        });
        Posts.find( {}, function( err, items ) {
            if( err ) console.log( err );
            var dir = './public/files';
            var pictures = [];
            getFiles( dir, pictures, items );
            Docs
                .find( { type : 'public' } )
                .sort( { fecha : -1 } )
                .limit( 4 )
                .exec( function( err, docs ) {
                res.render( 'index', {
                    title: 'GRUPO CAMBIO CLIMATICO IMTA',
                    posts: valores,
                    pictures: pictures,
                    moment: moment,
                    docs: docs
                });
            });
        }).
        limit( 10 ).
        sort( { fecha : -1 } );
    }).
    limit( 5 ).
    sort( { fecha : -1 } );
});




router.get( '/quienes-somos', function( req, res ) {
    res.render( 'quienes-somos', {
        title: '¿QUIENES SOMOS?'
    });
});




router.get( '/que-hacemos', function( req, res ) {
    res.render( 'que-hacemos', {
        title: '¿QUE HACEMOS?'
    });
});




router.get( '/jefes', function( req, res ) {
    res.render( 'jefes', {
        title: 'JEFES DE PROYECTO'
    });
});




router.get( '/noticias', function( req, res ) {
    redirije( req, res, 'NOTICIAS' );
});




router.get( '/notas_de_interes', function( req, res ) {
    redirije( req, res, 'NOTAS DE INTERES' );
});




router.get( '/reuniones_eventos', function( req, res ) {
    redirije( req, res, 'REUNIONES Y EVENTOS' );
});




router.get( '/convocatorias', function( req, res ) {
    redirije( req, res, 'CONVOCATORIAS' );
});




router.get( '/all_posts', function( req, res ) {
    redirije( req, res, 'CONVOCATORIAS' );
});




router.get( '/galeria', function( req, res ) {
    var perPage = 10;
    var page = Number( req.query.page ) || 1;
    with_fotos( function( lista ) {
        Posts.
        find( { '_id' : lista } ).
        sort( [ [ 'fecha', -1 ] ] ).
        skip( ( perPage * page ) - perPage ).
        limit( perPage ).
        exec( function( err, items ) {
            if( err ) console.log( err );
            items.forEach( function( instance, index, array ) {
                array[ index ] = instance.toObject();
                var list = fs.readdirSync( './public/files/' + array[ index ]._id + '/thumb' );
                array[ index ].fotos = existe( list, array[ index ]._id );
            });
            items.slice().reverse().forEach( function( item, index, object ) {
                if( Number( item.fotos.length ) < 1 ) {
                    items.splice( object.length - 1 - index, 1 );
                }
            });
            res.render( 'galeria', {
                title: 'GALERIA',
                items: items,
                pageSize: perPage,
                currentPage: page,
                pageCount: Math.ceil( lista.length / perPage )
            });
        });
    });
});



router.post( '/contact', function( req, res ) {
    console.log( req.get( 'Referrer' ) );
    res.redirect( req.get( 'Referrer' ) );
});



router.get( '/documentos', function( req, res ) {
    var perPage = Number( req.query.lim ) || 9;
    var page = Number( req.query.page ) || 1;
    Docs
        //.find( { type : 'public' } )
        .find( )
        .sort( { fecha : -1 } )
        .skip( ( perPage * page ) - perPage )
        .limit( perPage )
        .exec( function( err, items ) {
        Docs.count().exec( function( err, count ) {
            if (err) return next(err);
            res.render( 'documentos', {
                title: 'DOCUMENTOS',
                items: items,
                pageSize: perPage,
                currentPage: page,
                pageCount: Math.ceil( count / perPage ),
                category: 'public'
            });
        });
    });
});



router.get( '/admin', ensureAuthenticated, function( req, res ) {
//router.get( '/admin', function( req, res ) {
    var username = req.user.nickname;
    res.render( 'admin', {
        title: 'ADMINISTRADOR',
        username: username
    });
});



router.post( '/login', function( req, res, next ) {
    passport.authenticate( 'local', {
        successRedirect: '/admin',
        failureRedirect: '/',
        failureFlash: true } )( req, res, next );
});



router.get( '/logout', function( req, res ) {
    req.logout();
    req.flash( 'success', 'Sesion finalizada' );
    res.redirect( '/' );
});















function ensureAuthenticated( req, res, next ) {
    if( req.isAuthenticated() ) {
        return next();
    }
    else {
        req.flash( 'danger', 'Inicia sesión prro :v' );
        res.redirect( '/' );
    }
}




function redirije( req, res, pos ) {
    var path = req.path, val;
    switch( pos ) {
        case 'NOTICIAS':
            val = 'NOTICIA';
            break;
        case 'NOTAS DE INTERES':
            val = 'NOTA';
            break;
        case 'REUNIONES Y EVENTOS':
            val = 'EVENTO';
            break;
        case 'CONVOCATORIAS':
            val = 'CONVOCATORIA';
            break;
    }
    var perPage = Number( req.query.lim ) || 10;
    var page = Number( req.query.page ) || 1;
    var order = req.query.order || 'fecha';
    var sort = Number( req.query.sort ) || -1;
    Posts
        .find( { type: val } )
        .sort( [ [ order, sort ] ] )
        .skip( ( perPage * page ) - perPage )
        .limit( perPage )
        .exec( function( err, result ) {
        Posts
            .find( { type: val } )
            .count()
            .exec( function( err, count ) {
            if (err) console.log( err );
            var valores = result.map( function( post ) {
                var tmpPost = post.toObject();
                var list = fs.readdirSync( './public/files/' +  tmpPost._id + '/thumb' );
                tmpPost.first_foto = list[0];
                return tmpPost;
            });
            res.render( 'blog', {
                title: pos,
                posts: valores,
                pageSize: perPage,
                currentPage: page,
                pageCount: Math.ceil( count / perPage ),
                moment: moment,
                orden: order,
                sort: sort,
                path: path
            });
        });
    });
}




function existe( list, id ) {
    var ruta = './public/files/' + id + '/album/';
    list.forEach( function( item, index, arr ) {
        if( !fs.existsSync( ruta + item ) ) { arr.splice( index, 1 ); }
    });
    return list;
}




function with_fotos( cb ) {
    var resss = [];
    Posts.
    find( {}, function( err, posts ) {
        if( err ) console.log( err );
        var resss = [];
        posts.forEach( function( instance, index, array ) {
            array[ index ] = instance.toObject();
            var list = fs.readdirSync( './public/files/' + array[ index ]._id + '/thumb' );
            array[ index ].fotos = existe( list, array[ index ]._id );
        });
        posts.forEach( function( instance, index, array ) {
            if( Number( instance.fotos.length ) > 0 ) {
                resss.push( instance._id );
            }
        });
        cb( resss );
    });
}




function getFiles( ruta, files, posts ) {
    posts.map( function( post ) {
        var folder = post._id;
        if( fs.lstatSync( ruta + '/' + folder ).isDirectory() ) {
            var subpath = ruta + '/' + folder + '/thumb';
            var exp = /^.*\.(jpg|jpeg|gif|JPG|png|PNG)$/;
            var ls = fs.readdirSync( subpath );
            var tot = ls.length;
            var i = 0;
            while( i < tot ) {
                if( exp.test( ls[i] ) ) {
                    files.push( { id:post._id, ruta:'/files/'+folder+'/thumb/'+ls[i] } );
                    i = tot+1;
                }
                else {
                    i = i+1;
                }
            }
        }
    });
}





module.exports = router;