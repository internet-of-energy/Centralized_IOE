var DB_config = require('../../config/database.js');

//renders the login page
exports.login = function(req, res) {
	res.render('login.ejs');
}

//Login validation : Check and if true redirects to the home page else shows the error
exports.check = function(req, res) {
	var Username = req.body.Username;
	var Password = req.body.Password;

	if (Username && Password) {
		DB_config.connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [Username, Password], function(error, result, fields) {
			if (result.length > 0) {

				req.session.user_id = result[0].user_id;
				req.session.username = result[0].username;

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

//destroys session for logout
exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/login');
}
