

var port = process.env.PORT || 8003;

var bodyParser = require('body-parser');

//Express imports
var express = require('express');
var path = require('path');

//usage of express
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



require('./config/routes.js')(app);

app.listen(port);
console.log('The magic happens on port ' + port);

exports = module.exports = app;
