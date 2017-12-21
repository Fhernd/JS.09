var models = require('./models'),
	Schema = models.Schema;

//var mongooseRedisCache = require('mongoose-redis-cache');

var usuariosSchema = new Schema({
	nombre : String,
	usuario : String,
	password : String,
	twitter : Object
});

//usuariosSchema.set('redisCache', true);

//mongooseRedisCache(models);
var Usuario = models.model('Usuario', usuariosSchema, 'usuario_sesion');

module.exports = Usuario;
