//Version 0.15

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
  query += 'GROUP BY item.i_id';
  connection.query(query, function (error, results, fields) {
    // item_table =
    // [ RowDataPacket {
    //  i_id: 1,
    //  i_name: 'Test_item',
    //  i_price: 9,
    //  img_link: './test.png' } ]
    res.render('pages/index', {
      pagename: 'index',
      pageheader: 'Popular items',
      item_table: results
    });
  });
});

app.get('/search', function(req, res) {
  var query = 'SELECT cat_name, cat_id FROM catagories';
  connection.query(query, function (error, results, fields) {
    res.render('pages/search', {
      pagename: 'search',
      pageheader: 'Search',
      catagories: results
    });
  });
});


app.get('/chat', function(req, res) {
    res.render('pages/chat', {
      pagename: 'chat',
      pageheader: 'Chat'
    });
    return;
    // Just for testing
  var query = 'SELECT cat_name, cat_id FROM catagories';
  connection.query(query, function (error, results, fields) {
    res.render('pages/search', {
      pagename: 'search',
      pageheader: 'Search',
      catagories: results
    });
  });
});

app.get('/catagories/:cat_id', function(req, res) {
  var cat_id = req.params["cat_id"];
  var query = 'SELECT item.i_id, item.i_name, item.i_price, item.i_unit, images.img_link, catagories.cat_name from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'INNER JOIN item_cat ON item.i_id = item_cat.i_id ';
  query += 'INNER JOIN catagories ON item_cat.cat_id = catagories.cat_id ';
  query += 'WHERE catagories.cat_id = "' + cat_id + '" ';
  query += 'GROUP BY item.i_id';
  connection.query(query, function (error, results, fields) {
    res.render('pages/index', {
      pagename: 'Catagory: ' + cat_id,
      pageheader: 'Catagory: ' + cat_id,
      item_table: results
    });
  });
});

app.get('/donate', function(req, res) {
  var query = 'SELECT item.i_id, item.i_name, item.i_price, item.i_unit, images.img_link, catagories.cat_name from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'INNER JOIN item_cat ON item.i_id = item_cat.i_id ';
  query += 'INNER JOIN catagories ON item_cat.cat_id = catagories.cat_id ';
  query += 'WHERE item.i_price = 0 ';
  query += 'GROUP BY item.i_id';
  connection.query(query, function (error, results, fields) {
    res.render('pages/index', {
      pagename: 'Donate',
      pageheader: 'Donate',
      item_table: results
    });
  });
});

app.get('/item/:i_id', function(req, res) {
  var i_id = req.params["i_id"];
  var query = 'SELECT item.i_id, item.i_name, item.i_price, item.i_desc, item.i_unit, images.img_link from item ';
  query += 'INNER JOIN images ON item.i_id = images.i_id ';
  query += 'WHERE item.i_id = "' + i_id + '" ';
  query += 'GROUP BY item.i_id';
  connection.query(query, function (error, results, fields) {
    var item = results[0];
    res.render('pages/item', {
      pagename: 'Item',
      item: item
    });
  });
});

app.post('/sell', function(req, res) {
  var i_id = req.body.i_id;
  var i_name = req.body.i_name;
  var i_unit = req.body.i_unit;
  var i_price = req.body.i_price;
  var amount = req.body.amount;
  var contact = req.body.contact;
  var text = 'ฉันต้องการขาย "' + i_name + '" เป็นจำนวน "' + amount + ' ' + i_unit + '" ในราคา "' + i_price + ' บาท/' + i_unit + '" กรุณาติดต่อกลับหากคุณสนใจ'
  var query = 'INSERT INTO trans (i_id, amount, contact) ';
  query += 'VALUES (' + i_id + ', ' + amount + ', "' + contact + '")';
  connection.query(query, function (error, results, fields) {
    res.render('pages/chat', {
      pagename: 'search',
      text: text
    });
  });
});

app.get('/history', function(req, res) {
  var query = 'SELECT item.i_name, companies.com_name, trans.amount, item.i_price, trans.contact, trans.timestamp FROM trans ';
  query += 'INNER JOIN item ON trans.i_id = item.i_id ';
  query += 'INNER JOIN companies ON item.com_id = companies.com_id ';
  connection.query(query, function (error, results, fields) {
    res.render('pages/table', {
      pagename: 'history',
      table_data: results
    });
  });
});

var port = 8081
app.listen(port);
console.log('Server running at http://127.0.0.1:' + port);
