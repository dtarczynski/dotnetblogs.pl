 var mainDirectoryPath = __dirname;
 // var databaseAddress = 'http://localhost:5984';
 var databaseAddress = 'http://mfranc.iriscouch.com/';

 var feeds = require('./custom_modules/netblogs/feed.js')(databaseAddress);
 var localization = require('./custom_modules/netblogs/localization.js')

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

    /* serves admin page */
    app.get("/admin", function(req, res) {
      feeds.adminlist(function(data){
         res.render('admin', { feeds : data });
      });
    });

    app.post("/feed/add/", function(req, res) { 

      /* validate input */
      if(req.body.url === undefined || req.body.url === null || req.body.url.trim() === ''){
        
        console.log(localization.UrlNotEmpty);
        res.send({
          isSuccess: false,
          message: localization.UrlNotEmpty
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
              message: localization.UrlExists
            });
          }
      });
    });

    /* change feed option */
    app.post("/feed/changeoption/", function(req, res) {
      /* validate input */
        if(req.body.selectedOption === undefined || 
          req.body.selectedOption === null || 
          req.body.selectedOption.trim() === ''){
          
          
          res.send({
            isSuccess: false,
            message: localization.NoOptionSelected
          });

          return;
        }
        
        feeds.changeFeedOption(req.body.documentId, req.body.selectedOption,
         function(message) {
           res.send(message);
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

var port = process.env.PORT || 5001;
app.listen(port, function() {
  console.log("Listening on " + port);
});