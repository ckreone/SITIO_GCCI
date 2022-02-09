const LocalStrategy = require( 'passport-local' ).Strategy;
const User = require( '../models/user' );
const config = require( '../config/database' );
const bcrypt = require( 'bcryptjs' );


module.exports = function( passport ) {

    passport.use( new LocalStrategy( function( nickname, password, done ) {

        let query = { nickname: nickname };

        User.findOne( query, function( err, user ) {

            if( err ) throw err;

            if( ! user ) {
                return done( null, false, { message: 'Usuario no encontrado.' } );
            }

            /*if( password == user.password ) {
                if( err ) throw err;
                return done( null, user );
            }
            else {
                return done( null, false, { message: 'Contraseña incorrecta.' } );
            }*/

            bcrypt.compare( password, user.password, function( err, isMatch ) {

                if( err ) throw err;

                if( isMatch ) {
                    return done( null, user );
                }
                else {
                    return done( null, false, { message: 'Contraseña incorrecta.' } );
                }
            });
        });
    }));
    
    passport.serializeUser( function( user, done ) {
        done( null, user.id );
    });
    
    passport.deserializeUser( function( id, done ) {
        User.findById( id, function( err, user ) {
            done( err, user );
        });
    });

}