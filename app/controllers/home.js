
var DB_config = require('../../config/database.js');


exports.home = function(req, res) {

	DB_config.connection.query("SELECT users.name as name,Total_KwH,Cost_per_KwH FROM users,sellers" +
	" where users.user_id = sellers.seller_id order by Cost_per_KwH limit 10;", function (err, result, fields) {
    if (err) throw err;
		res.render('index.ejs',{sellers:result});
  });
}
