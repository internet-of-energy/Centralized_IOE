var DB_config = require('../../config/database.js');

//This shows the cheapest electrictiy avaliable in the market
exports.home = function(req, res) {

	console.log(req.session.username);

	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username
	};

	if(req.session.username != null){

  //runs the sql query
	DB_config.connection.query("SELECT users.name as name,Total_KwH,Cost_per_KwH FROM users,sellers" +
	" where users.user_id = sellers.seller_id order by Cost_per_KwH limit 10;",
	function (err, result, fields) {

    if (err) throw err;
		//renders index page with certain data passed
		res.render('index.ejs',{sellers:result,session:session});
  });

  }
  else{
	 res.redirect('/login');
  }
}

//This allows the customer to sell specific amount of electricity in the market
exports.sell = function(req, res) {

	//post request of sell
   var Amt_KwH = req.body.Amt_KwH;
	 var Cost_per_KwH = req.body.Cost_per_KwH;
	 var Battery = req.body.select_battery;
	 var User_id = req.body.user_id;


	 res.redirect('/home');
}
