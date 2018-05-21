var port = 8080;
var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var xml2js = require('xml2js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var Link = require('./link.js');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set('view engine', 'ejs'); //set up ejs for templating

const options = {
    url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

app.get('/', function(req, res, next){
  var completed = 0;
  var numLinks;
  Link.find().count(function(err, count){
    numLinks = count;
  });
  var l = new Array();
  var cursor = Link.find().cursor();
  cursor.on('data', function(doc){
    const options = {
        url: doc.url,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
        }
    };
    request(options, function(err, res1, body){
      completed++;
      if(err){
      }else{
        xml2js.parseString(body, function(err, res2){
          //console.log(res2.rss.channel[0].item[0].title[0] + "\n" + res2.rss.channel[0].item[0].description[0] + "\n" + res2.rss.channel[0].item[0].link[0]);
          //console.log(res2.rss.channel[0].item[0]);
          l.push(res2.rss.channel[0].item[0]);

          console.log(l[0].title[0]);
          console.log(completed, '<', numLinks);

          if(completed == numLinks){
            res.render('index.ejs', { links: l});
          }
          //res.status(200).send(res2.rss.channel[0].item[0].title[0] + "\n" + res2.rss.channel[0].item[0].description[0] + "\n" +  res2.rss.channel[0].item[0].link[0]);
        });
      }
    });
    //console.log(doc.url);
  });
});

app.post('/', function(req, res){
  var newLink = new Link();
  newLink.url = req.body.url;
  newLink.save(function(err) {
    if(err)
      throw err;
  });
  res.redirect('/');
});

app.get('*', function(req, res, next){
  res.status(404).send("Page not found.");
});

app.listen(port, function(err){
  console.log('server listening on port', port);
});

mongoose.connect('mongodb://localhost/rss_test', function(err, db){
  if(err){
    console.log("ERROR: Could not connect to database");
  }else{
    console.log("Successfully connected to database");
  }
});
