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
  var query = 'SELECT item.i_id, item.i_name, item.i_price, item.i_unit, images.img_link from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'GROUP BY item.i_id LIMIT 20';
  console.log(query);
  connection.query(query, function (error, results, fields) {
    // item_table =
    // [ RowDataPacket {
    //  i_id: 1,
    //  i_name: 'Test_item',
    //  i_price: 9,
    //  img_link: './test.png' } ]
    console.log(results);
    res.render('pages/index', {
      pagename: 'index',
      pageheader: 'Popular items',
      item_table: results
    });
  });
});

app.get('/search', function(req, res) {
  var query = 'SELECT cat_name FROM catagories';
  connection.query(query, function (error, results, fields) {
    // catagories =
    // [ RowDataPacket { cat_name: 'Catagory 1' },
    // RowDataPacket { cat_name: 'Catagory 2' } ]
    res.render('pages/search', {
      pagename: 'search',
      pageheader: 'Search',
      catagories: results
    });
  });
});

app.post('/search', function(req, res) {
  var cat_name = req.body.cat_name;
  console.log(req.body.cat_name);
  var query = 'SELECT item.i_id, item.i_name, item.i_price, item.i_unit, images.img_link, catagories.cat_name from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'INNER JOIN item_cat ON item.i_id = item_cat.i_id ';
  query += 'INNER JOIN catagories ON item_cat.cat_id = catagories.cat_id ';
  query += 'WHERE catagories.cat_name = "' + cat_name + '" ';
  query += 'GROUP BY item.i_id LIMIT 20';
  console.log(query);
  connection.query(query, function (error, results, fields) {
    res.render('pages/index', {
      pagename: 'Catagory: ' + cat_name,
      pageheader: 'Catagory: ' + cat_name,
      item_table: results
    });
  });
});

app.get('/item/:i_id', function(req, res) {
  var i_id = req.params["i_id"];
  var query = '';
  query += 'SELECT ';
  connection.query(query, function (error, results, fields) {
    res.render('pages/search', {
      pagename: 'search'

    });

  });
});

var port = 8081
app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);