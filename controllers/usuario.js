var Usuario = require('../models/usuarios');


exports.registro = function(req, res, next){
	var user = new Usuario({
		nombre : req.body.nombre,
		usuario : req.body.usuario,
		password : req.body.pass
	});

	user.save(function (err, usuario){
		if (!err) {
			res.status(201);
			next();
		}else{
			res.status(500);
			res.send('Ha ocurrido un problema!');
		}
	});
};


