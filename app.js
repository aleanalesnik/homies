var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');

var sequelize = new Sequelize('practice', 'aleanalesnik', null, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

var User = sequelize.define('user', {
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING
});

var app = express();

app.set('views', './src/views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('views'));


app.get('/', function (request, response) {
	response.render('index');
});

// request to show all users in our database
app.get('/users', function (request, response) {
	User.findAll().then(function (users) {
		users = users.map(function (userRow) {
			var columns = userRow.dataValues;
			return {
				id: columns.id,
				name: columns.name,
				email: columns.email
			}
		});

		response.render('users/index', {
			users: users
		});
	});
});

// display a form to create a new user
app.get('/users/new', function (request, response) {
	response.render('users/new');
});


// show a specific user
// note: this function was placed after the '/users/new' route, otherwise it reads in "new" for the ":id" parameter
app.get('/users/:id', function (request, response) {
	// http://localhost:3000/users/#{user.name}
	var requestParameters = request.params.id;
	// storing dynamic parameter. whatever value of this is will point to primary key of the user
	// value stored in request.params
	// users table: find user by userID and render page when we show specific user
	User.findById(requestParameters).then(function (user) {
		response.render('users/show', {
			user: user
		});
		// sending along users information
	});
});

// create the new user
// User.create seqeulize
// user submitted form on client side, can access the data in request.body
app.post('/users', bodyParser.urlencoded({extended: true}), function (request, response) {
	User.create({
		name: request.body.name,
		email: request.body.email,
		password: request.body.password
	}).then(function (user) {
		response.redirect('/users/' + user.id);
	});
});

//.then redirects users to the route with his/her 
// matching ID (their page).


sequelize.sync().then(function () {
	var server = app.listen(3000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});