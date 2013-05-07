module.exports = function(databaseAddress) {

	var databaseName = 'dotnetblogs';
	 
	var dbServer = require('nano')(databaseAddress);
	var db =  dbServer.use(databaseName);

	function list (callback) {
	    db.view('list','feeds', function(err, body) {
	        if (!err) {
	            return callback(body.rows);
	        } else {
	            console.log('requesting actualfeeds : ' + err);
	        }
	    });  
	 }

	 function insert (url, callback) {

		var newFeed = {
		    type : 'feed',
		    url : url,
		    isActiveurl : false,
		    isApproved : false
		};

	  	db.insert(newFeed , function(err, body, header) {

	  		var message = {};

		    if (err) {
		      console.log('error inserting feeds', err.message);
		      message = {
		        isSuccess : false,
		        message : 'Oops coś poszło nie tak.'
		      };

		    } else {
		      message = {
		        isSuccess : true,
		        message : 'Udało się.'
		      };
		    }

		    return callback(message);
	  	});
	}

    return {
        insert: insert,
        list: list
    };
};