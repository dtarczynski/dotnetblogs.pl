 var appPortNumber = 12345;
 var mainDirectoryPath = __dirname;

 var express = require("express");
    var app = express();
     
    /* serves main page */
    app.get("/", function(req, res) {
        res.sendfile('index.htm');
    });

    /* serves all the static files */
    app.get(/^(.+)$/, function(req, res) 
   	{ 
   		console.log('static file request : ' + req.params);
   		res.sendfile( mainDirectoryPath  + req.params[0]); 
   	});
  
 console.log("Web application started on port : " + appPortNumber );

 app.listen(appPortNumber);