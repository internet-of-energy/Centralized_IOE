var DB_config = require('../../config/database.js');

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
