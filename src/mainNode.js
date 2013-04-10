 var appPortNumber = 12345;
 var mainDirectoryPath = __dirname;

 var dbServer = require('nano')('http://localhost:5984');
 var db =  dbServer.use('dotnetblogs');

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
          db.insert({ name: 'feed', url : req.body.url }, function(err, body, header) {
            if (err) {
              console.log('error inserting feeds', err.message);
              return;
            }
          });
    });

    /* return l1ist of feeds */
    app.get("/feed/all/", function(req, res) {

        var feeds = {};

        db.view('list','feeds', function(err, body) {
          if (!err) {
              feeds = body.rows;
              res.send(feeds);
          } else {
              console.log('requesting actualfeeds : ' + err);
          }
        });
    });

    /* serves all the static files */
    app.get(/^(.+)$/, function(req, res) 
   	{ 
   		console.log('static file request : ' + req.params);
   		res.sendfile( mainDirectoryPath  + req.params[0]); 
   	});
  
 console.log("Web application started on port : " + appPortNumber );

 app.listen(appPortNumber);