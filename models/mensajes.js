var models = require('./models'),
	Schema = models.Schema;

var mensajeSchema = new Schema({
	usuario : String,
	mensaje : String
});

var Mensajes = models.model('Mensaje', mensajeSchema, 'mensajes');

module.exports = Mensajes;