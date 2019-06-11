var DB_config = require('../../config/database.js');

//This is used for external API's.
var request = require('request');
//This is used for Date and time.
var moment = require('moment');



/*------------ Renders the power_transfer page --------------------- */
exports.current_transfer = function(req, res) {

	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username
	};

  if(req.session.username != null){
	res.render('power_transfer.ejs',{session:session});
  }
  else{
   res.redirect('/login');
  }

}


/*----------- This is an API that informs the browser about the informations of the current electricity transfer taking place--------------------- */

exports.current_transfer_JSON = function(req, res) {

 //Gets the current session.
	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username
	};


   //Query to find nessary information about the current transactions (This query will have to be changed later).
	 DB_config.connection.query("select * from current_transactions,bills,users where current_transactions.bill_no = bills.bill_no AND bills.buyer_id = users.user_id AND users.user_id = ?",
	 [session.user_id],function (err, battery_info, fields) {

	 if(battery_info.length == 0){
		  var result = [];
      res.json(result);
	 }

   else{

	 for(var i = 0; i < battery_info.length; i++){

	 //Gets the current time.
   var current_time = moment().format("HH:mm");
	 //Gets the time finished.
	 var time_finished = getTimeInterval_seconds(battery_info[i].start_time,current_time);
  //Finds how much of KwH is transferred.
	 var Cur_KwH_transfer = time_finished * 5/1000;

   //Deletes record if the Current KwH > KwH required for transfer.
	 if(Cur_KwH_transfer >= battery_info[i].No_of_KwH){

		 DB_config.connection.query("delete from current_transactions where c_t_id = ?",
		 [battery_info[i].c_t_id],function (err, battery_info, fields) {
		 });

		 battery_info[i] = null;

	 }

	 //Or else appends some data.
	  else{
		 var percentage = Math.round((Cur_KwH_transfer/battery_info[i].No_of_KwH)*100);
		battery_info[i].percentage = percentage;
		battery_info[i].current_transfer = Cur_KwH_transfer;
		battery_info[i].time_left = getTimeInterval(current_time,battery_info[i].end_time);
  }
}
    // Returns battery information
    res.json(battery_info);
}
});


}

/*------------ Gets the battery information --------------------- */

exports.battery_info = function(req, res) {

	var session = {
		'user_id':req.session.user_id,
		'username':req.session.username
	};

	DB_config.connection.query("select * from battery_info where user_id = ?;select battery_id,sum(Total_KwH) as Total_KwH  from (select * from sellers where seller_id = ?) as sellers group by battery_id;",[session.user_id,session.user_id],
	function (err_battery, result_battery, fields_battery) {
    console.log(result_battery);
		if (err_battery) throw err_battery;
		//renders index page with certain data passed
		res.json(result_battery);
	});

}




//Local Functions.

//To get time difference.
function getTimeInterval(startTime, endTime, lunchTime){
    var start = moment(startTime, "HH:mm");
    var end = moment(endTime, "HH:mm");
    var minutes = end.diff(start, 'minutes');
    var interval = moment().hour(0).minute(minutes);
    interval.subtract(lunchTime, 'minutes');
    return interval.format("hh:mm");
}
//To get time difference in seconds
function getTimeInterval_seconds(startTime, endTime, lunchTime){
    var start = moment(startTime, "HH:mm");
    var end = moment(endTime, "HH:mm");
    var minutes = end.diff(start, 'minutes');
    var interval = moment().minute(minutes);
    interval.subtract(lunchTime, 'minutes');
    return minutes*60;
}


/*Takes parameters from GET request
 var Energy_req = req.query.energy_req;
 var Tk_batt = req.query.tk_batt;
 var Sn_batt = req.query.sn_batt;*/
