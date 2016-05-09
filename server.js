// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mysql          = require("mysql");

// configuration ===========================================
// create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pw",
  database: "sakila"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    throw err;
  }
  console.log('Mysql Connection established');
});

var port = process.env.PORT || 8080; // set our port

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// get selector options
app.get('/load_country',function(req,res){
	// find customer counts for each country having at least one customer
	con.query("SELECT t1.country, count(*) AS cnt" +
			" FROM (SELECT cl.ID, cl.name, cl.country, c.email" + 
			" FROM customer c, customer_list cl" + 
			" WHERE c.customer_id = cl.ID) AS t1" +
			" GROUP BY t1.country",function(err,rows){
	if(err){
		console.log("Problem with MySQL"+err);
	}
	else{
		res.end(JSON.stringify(rows));
	}
	});
});

// fetch customer
app.post('/find_cud',function(req,res){
	var country = req.body.country; // user request
	// find all customers in user-requested country
	con.query("SELECT cl.ID, cl.name, c.email" +
			" FROM customer c, customer_list cl" +
			" WHERE c.customer_id = cl.ID AND cl.country = ?", country, function(err,rows){
	if(err){
		console.log("Problem with MySQL"+err);
	}
	else{
		res.end(JSON.stringify(rows));
	}
	});
});
// routes ==================================================
require('./app/routes')(app, con); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Checkout port ' + port); 
exports = module.exports = app; 		// expose app