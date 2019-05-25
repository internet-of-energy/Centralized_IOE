var DB_config = require('../../config/database.js');

exports.login = function(req, res) {

	res.render('login.ejs');
}

exports.check = function(req, res) {
	var Username = req.body.Username;
	var Password = req.body.Password;

	if (Username && Password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [Username, Password], function(error, result, fields) {

			if (results.length > 0) {
				req.session.user_id = result.user_id;
				req.session.username = username;

				res.redirect('/home');
			} else {
				res.render('login.ejs',{error:"Wrong username and password"});
			}
			res.end();
		});
	} else {
		res.render('login.ejs',{error:"Pls enter username and password"});
		res.end();
	}
}
