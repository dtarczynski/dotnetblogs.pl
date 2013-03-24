 var appPortNumber = 12345;
 var mainDirectoryPath = __dirname;

 var dbServer = require('nano')('http://localhost:8000');
 var db =  dbServer.use('dotnetblogs');

 var express = require("express");
    var app = express();
     
    /* serves main page */
    app.get("/", function(req, res) {
        res.sendfile('index.htm');
    });

    /* return list of feeds */
    app.get("/actualfeeds", function(req, res) {

        var feeds = {};

        db.view('list','feeds', function(err, body) {
          if (!err) {
              feeds = body.rows[0];
              res.send(feeds);
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