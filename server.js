var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var client = redis.createClient();

//Aquí almacenamos las variables de sesión
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

//Passport
var passport = require('passport');

//Flash para enviar mensajes temporales como respuesta
var flash = require('connect-flash');

//Logger de peticiones http
var logger = require('morgan');
//Parsea las cookies y pobla el objeto req.cookies con un objeto de llaves, que tiene el nombre de la cookie
var cookieParser = require('cookie-parser');
//Parsea el cuerpo de las peticiones y respuestas http
var bodyParser = require('body-parser');

var path = require('path');
var _ = require('lodash');


//Requerimos Swig
var swig = require('swig');

var usuarios = [];
var clientes = {};
//var mensajes = [];

var Usuario = require('./models/usuarios');
var Mensaje = require('./models/mensajes');
/**************Configuración**************/

//Con esto le decimos a express, que motor de template utilizar, a lo que asignamos Swig.
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//En desarrollo deshabilitamos el cacheo de templates, pero en un entorno de desarrollo es esencial, para el optimo rendimiento.
//Leccion 4
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Necesario para la gestión de las variables de sesión
app.use(session({
  store : new RedisStore({}),
  secret : 'nextapp'
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

/**************Configuración**************/

passport.serializeUser(function(user, done) {
  console.log("Serialize: "+user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("Deserialize: "+obj);

  done(null, obj);
});

//Routes
var routes = require('./routes/routes');
routes(app);

//Connections 
var local = require('./connections/local');
local(app);
var twitter = require('./connections/twitter');
twitter(app);

//Socket.io

function storeMessages(usuario, mensaje){

  var objeto = new Mensaje({usuario : usuario, mensaje : mensaje});
  objeto.save(function (err, mensaje){
    if (err) {console.log(err);}
    console.log(mensaje);
  });
  
}

io.on('connection', function(socket){
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    client.hdel("usuarios", socket.id);
  });

    socket.on('mousedown', function (datos) {
        io.emit('mousedown', datos);
    });

    socket.on('mousemove', function (datos) {
        io.emit('mousemove', datos);
    });

    socket.on('mouseup', function (datos) {
        io.emit('mouseup', datos);
    });

    socket.on('mouseleave', function (datos) {
        io.emit('mouseleave', datos);
    });

});	

server.listen(3000, function(){
	console.log('Servidor corriendo en el puerto 3000');
});


