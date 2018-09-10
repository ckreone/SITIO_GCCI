const express = require( 'express' );

const busboy = require('connect-busboy');

const formidable = require( 'formidable' );

const fileUpload = require( 'express-fileupload' );
const path = require( 'path' );
const favicon = require( 'serve-favicon' );
const mongoose = require( 'mongoose' );
const logger = require('morgan');

const bodyParser = require( 'body-parser' );
const expressValidator = require( 'express-validator' );
const flash = require( 'connect-flash' );
const session = require( 'express-session' );
const passport = require( 'passport' );
const config = require( './config/database' );
const fs = require( 'fs' );

let roots = require( './routes/roots' );
let posts = require( './routes/posts' );
let media = require( './routes/media' );


mongoose.Promise = global.Promise;
mongoose.connect( config.database, {
    useMongoClient: true
 });
let db = mongoose.connection;
db.once( 'open', function() {
  console.log( 'conectado a MongoDB' );
});
db.on( 'error', function( err ) {
  console.log( err );
});


const app = express();


app.use(busboy());

app.use( fileUpload() );


app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );
app.use( favicon( path.join( __dirname, 'public', 'icon.png' ) ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
//app.use( bodyParser( { defer : true } ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use( require( 'connect-flash' )() );
app.use( require( 'cookie-parser' )() );
app.use( function ( req, res, next ) {
    res.locals.messages = require( 'express-messages' )( req, res );
    next();
});
app.use( expressValidator({
    errorFormatter: function( param, msg, value ) {
        var namespace = param.split( '.' ),
            root = namespace.shift(),
            formParam = root;
        while( namespace.length ) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

require( './config/passport' )( passport );

app.use( passport.initialize() );
app.use( passport.session() );
app.get( '*', function( req, res, next ) {
    res.locals.user = req.user || null;
    next();
});


app.use( '/', roots );
app.use( '/posts', posts );
app.use( '/media', media );

app.use( function( req, res, next ) {
    var err = new Error( 'Página no disponible' );
    err.status = 404;
    next( err );
});
app.use( function( err, req, res, next ) {
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};
    res.status( err.status || 500 );
    res.render( 'error' );  
});


module.exports = app;