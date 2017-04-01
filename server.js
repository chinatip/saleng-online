var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 's%W!B#AN',
  database : 'theater_database',
  port     : 3306,
  multipleStatements: true
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/node_modules/bootstrap'))

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  res.render('pages/index', {
    pagename: 'index'
  });
});

var port = 8081
app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);