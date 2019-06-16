var DB_config = require('../../config/database.js');
//This is used for external API's
var request = require('request');
//This is used for Date and time.
var moment = require('moment');

//This shows the cheapest electrictiy avaliable in the market
exports.home = function(req, res) {


	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username,
		'notification':req.session.notification
	};

  /* Checks if session.username exsists. If not then redirects to the login page */
	if(req.session.username != null){

  //Query 1 to display top 10 cheapest per KwH
	DB_config.connection.query("SELECT sell_id,seller_id,users.name as name,Total_KwH,Cost_per_KwH FROM users,sellers" +
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
	 var Battery_id = req.body.select_battery;
	 var User_id = req.session.user_id;

	 DB_config.connection.query("insert into sellers(seller_id,Total_KwH,Cost_per_KwH,battery_id) values(?,?,?,?)",[User_id,Amt_KwH,Cost_per_KwH,Battery_id],
 	 function (err, result, fields) {
		 DB_config.connection.query("update battery_info set current_power = current_power - ? where battery_id = ?",[Amt_KwH,Battery_id],
	 	 function (err, result, fields) {

	 		if (err) throw err;

	 	 });
 		if (err) throw err;
 		//renders index page with certain data passed
 		res.redirect('/home');
 	 });


}

//This allows customers to buy from our grid
exports.buy = function(req, res) {

	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username,
		'notification':req.session.notification
	};

	//post request for buying
	var Amt_KwH = req.body.Amt_KwH;
	var Cost_per_KwH = req.body.Cost_per_KwH;
	var Seller_id = req.body.Seller_id;
	var Sell_id = req.body.Sell_id;
	var Battery_id = req.body.select_battery;

	var total = Math.round((Amt_KwH * Cost_per_KwH)*100)/100; //Rounds the total to 2 decimal places
	var date = new Date().toISOString().slice(0, 19).replace('T', ' '); //Converts date to sql date format

	//Inserts the information to the bill
	DB_config.connection.query("insert into bills(buyer_id,seller_id,No_of_KwH,Cost_per_KwH,b_date) values(?,?,?,?,?)",[session.user_id,Seller_id,Amt_KwH,Cost_per_KwH,date],
	function (err, result, fields) {

	 if (err) throw err;
	 //updates seller information
	 DB_config.connection.query("update sellers set Total_KwH = Total_KwH - ? where sell_id = ?",[Amt_KwH,Sell_id],
 	 function (err_update, result_update, fields_update) {

 	  if (err_update) throw err_update;
	 //Gets informations about Total_KwH seller
	 DB_config.connection.query("select * from sellers where sell_id = ?",[Sell_id],
	 function (err_query, result_query, fields_query) {

		if (err_query) throw err_query;

         //Finds the MAX bill_no as the primary key is set on auto_increment
				 DB_config.connection.query("select max(bill_no) as bill_no from bills",
	 	 	  function (err_max_bill_no, result_max_bill_no, fields_query_max_bill_no) {
	 	 		  if (err_query) throw err_query;

					var bill_no = result_max_bill_no[0].bill_no;

				  //Checks if the bill_no buyer is your user_no
					while(bill_no > 0){
						console.log(bill_no);
						DB_config.connection.query("select buyer_id from bills where bill_no = ?",[bill_no],
	 	 	 	    function (err_max_bill_no, result_max_bill_no, fields_query_max_bill_no) {
	 	 	 		  if (err_query) throw err_query;

						if(result_max_bill_no.length == 1){

						if(result_max_bill_no[0].buyer_id == session.user_id){

							//Current time
							var current_time = moment().format("HH:mm:ss");

							//We are assuming the transfer of electricity is 5v a second
							var time_finished =  (Amt_KwH * 1000)/0.5;

							//Gets the end time
							var end_time =  moment().add(time_finished, 'seconds').format("HH:mm:ss");

							//current_time = current_time.toString();
						 //end_time = end_time.toString();
             console.log(end_time);
							DB_config.connection.query("insert into current_transactions(bill_no,start_time,end_time,KwH_transfer) values(?,?,?,?)",[bill_no,current_time,end_time,Amt_KwH],
		 	 	 	    function (err_max_bill_no, result_max_bill_no, fields_query_max_bill_no) {
		 	 	 		  if (err_query) throw err_query;
						   });
							 DB_config.connection.query("update battery_info set current_power = current_power + ? where battery_id = ?",[Amt_KwH,Battery_id],
 		 	 	 	     function (err_max_bill_no, result_max_bill_no, fields_query_max_bill_no) {
 		 	 	 		   if (err_query) throw err_query;
 						   });
					    }
						}

	 	 	 	   });
					 bill_no--;

					 break; //Bug to be fixed later won't be issue for less users doing less transactions
					}
	 	 	   });

        req.session.notification = req.session.notification + 1;
				//console.log(req.session.notification);

	  if (result_query[0].Total_KwH === 0){
			DB_config.connection.query("delete from sellers where sell_id = ?",[Sell_id],
	 	  function (err_query, result_query, fields_query) {
	 		  if (err_query) throw err_query;

				  //This method calls the API to control relays
          res.redirect('/home');
	 	});
		}
		else{
	 res.redirect('/home');
    }
	});
 	});
	});


}

//To view bills
exports.bills = function(req, res) {

	var session = {
	 'user_id':req.session.user_id,
	 'username':req.session.username
  };

	if(req.session.username != null){

		DB_config.connection.query("select bill_no,name, No_of_KwH,Cost_per_KwH,b_date from bills,users where seller_id = user_id AND buyer_id = ? order by b_date desc",[session.user_id],
		function (err, result, fields) {

			if (err) throw err;
			//renders index page with certain data passed
		  res.render('bills.ejs',{session:session,bills:result});
		});

	}
	else{
		 res.redirect('/login');
	}

}

//Local functions that cannot be exported
