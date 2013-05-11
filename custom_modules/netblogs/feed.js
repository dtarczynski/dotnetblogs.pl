module.exports = function(databaseAddress) {

	var databaseName = 'dotnetblogs';
	 
	var dbServer = require('nano')(databaseAddress);
	var localization = require('./localization.js');
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
		        message :  localization.OperationFailed
		      };

		    } else {
		      message = {
		        isSuccess : true,
		        message : localization.OperationSuccessfull
		      };
		    }

		    return callback(message);
	  	});
	}

	function getByUrl(url, callback) {
		db.view('list', 'byurl', { key : url }, function(err, body){
			if(!err){
				return callback(body.rows[0]);
			} else {
				console.log('requesting feed by Url :' + err)
			}
		});
	}

    return {
        insert: insert,
        list: list,
        getByUrl: getByUrl
    };
};