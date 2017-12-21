var models = require('./models');
var Schema = models.Schema;

var imagenSchema = new Schema({
    nombre: String
});

var Imagen = models.model('Imagen', imagenSchema, 'imagenes');

module.exports = Imagen;
