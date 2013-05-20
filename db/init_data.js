  var feeds = [
   "http://feeds.feedburner.com/jakubg",
   "http://feeds.feedburner.com/maciejaniserowicz",
   "http://maciej-progtech.blogspot.com/feeds/posts/default?alt=rss",
   "http://feeds2.feedburner.com/Piotrosz",
   "http://feeds.feedburner.com/devblogi",
   "http://feeds.feedburner.com/szymonpobiega",
   "http://geekswithblogs.net/kobush/Rss.aspx",
   "http://feeds.feedburner.com/xion",
   "http://marcinborecki.pl/feed/",
   "http://teamsystem.pl/syndication.axd",
   "http://feeds.feedburner.com/dario-g",
   "http://jacekciereszko.pl/feeds/posts/default?alt=rss",
   "http://michalkomorowski.blogspot.com/feeds/posts/default?alt=rss",
   "http://feeds.feedburner.com/BartekSzafko",
   "http://feeds2.feedburner.com/blogspot/wBGD",
   "http://vbamania.blogspot.com/feeds/posts/default?alt=rss",
   "http://machal85.wordpress.com/feed/",
   "http://feeds2.feedburner.com/eastgroup",
   "http://feeds.feedburner.com/LukaszGasior-Blog",
   "http://feeds.feedburner.com/tomaszwisniewski",
   "http://feeds.feedburner.com/kozmic",
   "http://www.codeguru.pl/RSS/News.aspx",
   "http://feeds2.feedburner.com/Dotnetomaniakpl-OstatnioOpublikowaneArtykuy",
   "http://crmblog.pl/feed/",
   "http://feeds.feedburner.com/MarcinWolanski",
   "http://feeds.feedburner.com/sharepointblog_pl",
   "http://feeds.feedburner.com/andrzejnetpl",
   "http://feeds.feedburner.com/DariuszTarczynski",
   "http://feeds.feedburner.com/JakubFlorczyk",
   "http://feeds.feedburner.com/ProgramowanieIOkolice",
   "http://www.pzielinski.com/?feed=rss2",
   "http://www.lesnikowski.com/blog/index.php/feed/",
   "http://blog.domas.pl/feed/",
   "http://blog.poslinski.net/feed/",
   "http://jlfedra.blogspot.com/feeds/posts/default?alt=rss",
   "http://feeds2.feedburner.com/czoper",
   "http://maciejgrabek.com/feed/",
   "http://netmajor.wordpress.com/feed/",
   "http://marcinkruszynski.blogspot.com/feeds/posts/default?alt=rss",
   "http://revis-dev.blogspot.com/feeds/posts/default",
   "http://feeds.feedburner.com/ZawodProgramistaNet",
   "http://feeds.feedburner.com/michalnajman",
   "http://poniat.wordpress.com/feed/",
   "http://mmulawa.blogspot.com/feeds/posts/default",
   "http://piotrsowa.eu/feed/",
   "http://feeds.feedburner.com/office365blogpl",
   "http://zine.net.pl/blogs/mgrzeg/rss.aspx",
   "http://krzysztofmorcinek.wordpress.com/feed/",
   "http://templinadam.wordpress.com/feed/",
   "http://mndevnotes.wordpress.com/feed/",
   "http://feeds.feedburner.com/PassionateProgram",
   "http://pawel.sawicz.eu/feed/",
   "http://paskol.robi.to/?feed=rss2"
];

var nano = require('nano')('http://localhost:5984');
// var nano = require('nano')('http://mfranc.iriscouch.com/');

nano.db.destroy('dotnetblogs', function() {
  // create a new database
	nano.db.create('dotnetblogs', function() {
    	// specify the database we are going to use
    	var db = nano.use('dotnetblogs');


      feeds.forEach( function(item) {
          // create feeds data

          var newDoc = {
            type : 'feed',
            url : item,
            isActive : true,
            isApproved : true,
            optionSelected: []
          };

          db.insert(newDoc, function(err, body, header) {
            if (err) {
              console.log('error inserting feeds', err.message);
              return;
            }
          });
      });

      console.log('restore finished');

	    // create design view for feeds
  	  db.insert(
		  { "views": 
		    {
          "feeds" : { 
		      	"map": function(doc) {
              var id = doc._id;
              if(doc.type === 'feed' && doc.isActive && doc.isApproved) {
                var url = doc.url;
                emit(id, url);
				    }
		      }
		    }, "notapproved" : {
                    "map": function(doc) {
              var id = doc._id;
              if(doc.type === 'feed' && !doc.isApproved) {
                var url = doc.url;
                emit(id, url);
            }
          }
        }, "byurl" : {
            "map" :   function(doc) {
                if(doc.type === 'feed'){
                  emit(doc.url, doc);
              }
          }
         } , "hasoption" : {
            "map" : function (doc) {
              var id = doc._id;
              if(doc.type === 'feed' && doc.optionSelected.length > 0) {
                emit(id, doc);
            }
          }
       }
		  }}, '_design/list', function (error, response) {
		  });
    });
});

