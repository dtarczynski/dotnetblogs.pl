

 var mainDirectoryPath = __dirname;
 var databaseAddress = 'http://localhost:5984';

 var feeds = require('./custom_modules/netblogs/feed.js')(databaseAddress);

 var express = require("express");
    var app = express();

    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('layout', true);
    app.use(express.bodyParser());
    app.use(app.router);
    app.engine('html', require('jqtpl').__express);

    /* serves main page */
    app.get("/", function(req, res) {
        res.render('feeds');
    });

    app.post("/feed/add/", function(req, res) { 

      /* validate input */
      if(req.body.url === undefined || req.body.url === null || req.body.url.trim() === ''){
        res.send({
          isSuccess: false,
          message: 'Pole adres url nie może być puste.'
        });

        return;
      }

      /* validate if already exists */ 
      feeds.getByUrl(req.body.url, function(data) {
          if(!data){
            feeds.insert(req.body.url, function(message) {
              res.send(message);
            });
          } else {
            res.send({
              isSuccess: false,
              message: 'Feed o podanym url juz&& istnieje.'
            });
          }
      });
    });

    /* return l1ist of feeds */
    app.get("/feed/all/", function(req, res) {
        feeds.list(function(data){
            res.send(data);
        });
    });

    /* serves all the static files */
    app.get(/^(.+)$/, function(req, res) 
   	{ 
   		console.log('static file request : ' + req.params);
   		res.sendfile( mainDirectoryPath  + req.params[0]); 
   	});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});