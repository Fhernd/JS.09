var passport = require('passport'),
	passportTwitter = require('passport-twitter'),
	TwitterStrategy = passportTwitter.Strategy;

var Usuario = require('../models/usuarios');

var twitterConnection = function (app) {
	passport.use(
		new TwitterStrategy(
		{
			consumerKey: 'epWOSr1uQlzv2kvFepUDNkBuj',
			consumerSecret: '6z89D8YqoCdooJbmmtjNDwuFmqrh7jglasLKhfGDmVNbnYzzMQ',
			callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
		},
		function (token, tokenSecret, profile, done) {
			Usuario.findOne({
				'twitter.id' : profile.id
			},
			function (err, user){
				if(err){
					return done(err);
				}

				if(!user){

					var usuario = new Usuario({
						username : profile.username,
						twitter : profile
					});

					var datos = JSON.stringify(eval("("+profile._raw+")"));
					usuario.nombre = JSON.parse(datos).name;

					usuario.save(function(err, user){
						if(err){
							done(err, null);
							return;
						}

						done(null, user);
					});
				}else{
					
					return done(err, user);
				}
			});
		}
	));

	app.get('/auth/twitter',passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/chat', failureRedirect: '/error' }));
};

module.exports = twitterConnection;