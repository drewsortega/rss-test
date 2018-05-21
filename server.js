var port = 8080;
var express = require('express');
var app = express();
var http = require('http');
var request = require('request');
var xml2js = require('xml2js');


app.use(express.static(__dirname + '/public'));
const options = {
    url: 'http://rss.cnn.com/rss/cnn_topstories.rss',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

app.get('/', function(req, res, next){
  request(options, function(err, res1, body){
    if(err){
      res.status(404).send("Bad URL");
    }else{
      xml2js.parseString(body, function(err, res2){
        //onsole.log(res2.rss.channel[0].item[0].title[0] + "\n" + res2.rss.channel[0].item[0].description[0] + "\n" + res2.rss.channel[0].item[0].link[0]);
        //res.status(200).send(res2.rss.channel[0].item[0].title[0] + "\n" + res2.rss.channel[0].item[0].description[0] + "\n" + res2.rss.channel[0].item[0].link[0]);
        res.render('index.ejs');
      });
    }
  });
});

app.get('*', function(req, res, next){
  res.status(404).send("Page not found.");
})

app.listen(port, function(err){
  console.log('server listening on port', port);
})
