var DB_config = require('../../config/database.js');

//This shows the cheapest electrictiy avaliable in the market
exports.home = function(req, res) {

	console.log(req.session.username);

	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username
	};

  /* Checks if session.username exsists. If not then redirects to the login page */
	if(req.session.username != null){

  //Query 1 to display top 10 cheapest per KwH
	DB_config.connection.query("SELECT users.name as name,Total_KwH,Cost_per_KwH FROM users,sellers" +
	" where users.user_id = sellers.seller_id order by Cost_per_KwH limit 10;",
	function (err, result, fields) {
    if (err) throw err;

     //displays the battery information of the user logged in
		 DB_config.connection.query("select * from battery_info where user_id = ?",[session.user_id],
		 function (err_battery, result_battery, fields_battery) {

			 if (err_battery) throw err_battery;
			 //renders index page with certain data passed
			 res.render('index.ejs',{sellers:result,session:session,battery:result_battery});
		 });
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
	 var User_id = req.session.user_id;

	 DB_config.connection.query("insert into sellers(seller_id,Total_KwH,Cost_per_KwH) values(?,?,?)",[User_id,Amt_KwH,Cost_per_KwH],
 	 function (err, result, fields) {

 		if (err) throw err;
 		//renders index page with certain data passed
 		res.redirect('/home');
 	 });


}
