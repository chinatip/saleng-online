var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var connection = mysql.createConnection({
  host     : '192.168.100.92',
  user     : 'root',
  password : 'my-new-password',
  database : 'saleng',
  port     : 3306,
  multipleStatements: true
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/node_modules/bootstrap'))
app.use(express.static(__dirname + '/views/images'))

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  var query = 'SELECT item.i_id, item.i_name, item.i_price, images.img_link from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'LIMIT 20';
  connection.query(query, function (error, results, fields) {
    // item_table =
    // [ RowDataPacket {
    //  i_id: 1,
    //  i_name: 'Test_item',
    //  i_price: 9,
    //  img_link: './test.png' } ]
    res.render('pages/index', {
      pagename: 'index',
      item_table: results
    });
  });
});

app.get('/search', function(req, res) {
  var query = '';
  query += 'SELECT cat_desc FROM catagories';
  connection.query(query, function (error, results, fields) {
    // catagories =
    // [ RowDataPacket { cat_desc: 'Catagory 1' },
    // RowDataPacket { cat_desc: 'Catagory 2' } ]
    res.render('pages/search', {
      pagename: 'search',
      search_text: '',
      catagories: results
    });
  });
});

// app.get('/item/:i_id', function(req, res) {
//   var i_id = req.params["i_id"];
//   var query = '';
//   query += 'SELECT ';
//   connection.query(query, function (error, results, fields) {
//     res.render('pages/search', {
//       pagename: 'search'

//     });
//   });
// });

var port = 8081
app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);