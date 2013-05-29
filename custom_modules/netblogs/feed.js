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

	 function adminlist (callback) {
	    db.view('list','adminlist', function(err, body) {
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
		    isApproved : false,
		    optionSelected : []
		};

		insertFeed(newFeed, callback);
	}

	function insertFeed(newFeed, callback) {
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

	function getById(documentId, callback) {
		db.view('list', 'feeds', { key : documentId }, function(err, body){
			if(!err){
				return callback(body.rows[0]);
			} else {
				console.log('requesting feed by Id :' + err)
			}
		});
	}

	function changeFeedOption(documentId, selectedOption, callback) {
		db.get(documentId, function (error, existingDoc){

			if(!existingDoc)
			{
				callback({
					isSuccess: false,
					message: localization.OperationFailed
				});
			}else{
				existingDoc.optionSelected.push(selectedOption);
				db.insert(existingDoc, documentId,function(err, body, header){
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

					 callback(message);   
				});
			}
		});
	}


    return {
        insert: insert,
        list: list,
        getByUrl: getByUrl,
        changeFeedOption: changeFeedOption,
        adminlist: adminlist
    };
};