var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

var configfile = require('../config.json');

var port = process.env.PORT || configfile.qralert_console_port || 8484; // set our port
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

//require('./app/routes')(app); // pass our application into our routes

var alert_log = []
app.set_aler_log = function(x){
	alert_log = x
}

app.get('/qralert/alerts', function(req, res) {
		res.json(alert_log);
});

app.get('*', function(req, res) {
		res.sendfile('./gui/index.html');
});

app.listen(port);	
console.log('console available on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app

