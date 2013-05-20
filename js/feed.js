/* this only loads apis */
google.load('feeds', '1');

        /* changed test feeds to assocative array 
            note that assocative array doesnt have length attribute
            we will store our special object length in it
        */
        var testFeeds = {};
        testFeeds["length"] = 0;

        var data = {
            feeds: new Array()
        };

        var toolTipIndex = 0;
        
        function allDone() {
            toolTipIndex = 0;
            
            doSort();

            $("#headlines").setTemplateElement("allFeeds");
            $("#headlines").processTemplate(data);

            $('.feed-block').each(function() {

                toolTipIndex++;
                if (toolTipIndex % 3 == 0) {
                    cornerToolTip = 'topRight';
                    cornerTarget = 'bottomLeft';
                } else {
                    cornerToolTip = 'topLeft';
                    cornerTarget = 'bottomRight';
                }

                $(this).find('.hentry').each(function() {
                    
                    $(this).qtip(
                    {
                        content: $(this).find('.full-post').html(),
                        style: 'codaStyle',
                        position: {
                            corner: {
                                tooltip: cornerToolTip,
                                target: cornerTarget
                            }
                        }
                    });
                });
            });

            /* moderation script */
            $(".feed_options_button").click( function() {
                var popup = $("#moderate_feed_popup").bPopup();

                var optionsButtons = $(this);

                $("#moderate_feed_ok_button").one('click', function(){
                    var selectedOption = $("[name='moderate_type']:checked").val();

                    var data = {
                        selectedOption : selectedOption,
                        documentId: optionsButtons.attr('feed_id')
                    };

                    $.ajax({
                        url : '/feed/changeoption/',
                        type : 'post',
                        dataType: 'json',
                        contentType  : 'application/json',
                        data:  JSON.stringify(data),
                        success : function (data){
                            popup.close();
                            if(data.isSuccess){
                                $("#success_message").text(data.message);
                                $("#success_popup").bPopup();

                            } else {
                                $("#error_message").text(data.message);
                                $("#error_popup").bPopup()
                            }

                        },
                        error : function (msg){
                            popup.close();
                            $("#error_popup").bPopup();
                        } 
                    });
                });

                $("#moderate_feed_cancel_button").one('click', function(){
                    popup.close();
                });
            });
        }

        function replaceHelper(str) {

            str = str.replace('&#243;', 'ó').replace('&oacute;', 'ó');
            str = str.replace('&amp;', '&');
            str = str.replace('&nbsp;', ' ').replace('&#160;', ' ');
            str = str.replace('&#8211;', '-').replace('&ndash;', "-");
            str = str.replace('&ldquo;', '"').replace('&rdquo;', '"');
            str = str.replace('&#8217;', "'").replace('&rsquo;', "'");
            str = str.replace('&lt;', '<').replace('&gt;', '>');
            return str;
        }

        function changeSort(elem) {

            if ($(elem).text() == 'sortuj po tytule') {
                $(elem).text('sortuj po dacie');
                $.cookie('sortFunName', 'sortByTitle', { expires: 350 });
                $.cookie('sortFunText', 'sortuj po dacie', { expires: 350 });
            } else {
                $(elem).text('sortuj po tytule');
                $.cookie('sortFunName', 'sortByDate', { expires: 350 });
                $.cookie('sortFunText', 'sortuj po tytule', { expires: 350 });
            }

            allDone();
        }

        function initialize() {

            // check if user is using opera
            if ($.browser.opera) {
                $('.share-facebook').css('margin-left', '110px');
            }

            // nasty workaround for tweetme button on IE
            var theframes = document.getElementsByTagName('iframe');
            for (var i = 0; i < theframes.length; i++) {
                theframes[i].setAttribute("allowTransparency", "true");
            }

            try {
                var v = $.cookie('sortFunText');
                if (v.length != 0 && v != 'undefined') {
                    $('#sortBy').text(v);
                }
                
                // sortuj po dacie
            } catch (err) { }

           // get all feeds at once
           for (var feedId in testFeeds) {
               var rssFeed = new google.feeds.Feed(testFeeds[feedId].feed_url);
               callbackTrack.queue = callbackTrack.queue || [false];
               rssFeed.load(callbackTrack);
           }

            allDone();
        }

         function callbackTrack(result, d) {
            if (d == 'done') {
                if (callbackTrack.queue.length % 10 == 0) {
                    partialDone(data);
                }

                if (callbackTrack.queue.length == testFeeds.length + 1)
                {
                    allDone();
                }

                return;
            }

            if (!result.error) {

                if(result.feed)
                {
                    var idForFeed = testFeeds[result.feed.feedUrl].feed_id;
                    $(result.feed).extend(result.feed,{
                        feed_id : idForFeed
                    });
                }

                result.feed.engTitle = convert_plToEng(result.feed.title).toUpperCase().replace('£', 'L').replace('¥', 'A');
                for (var feedIndex = 0; feedIndex < result.feed.entries.length; feedIndex++) {
                    result.feed.entries[feedIndex].content = '';
                    result.feed.entries[feedIndex].title = replaceHelper(result.feed.entries[feedIndex].title);
                    result.feed.entries[feedIndex].contentSnippet = replaceHelper(result.feed.entries[feedIndex].contentSnippet);
                }
                data.feeds.push(result.feed);
            }

            callbackTrack.queue.push(true);

            return callbackTrack(null, 'done');
        }

        function doSort() {
            try {
                var funName = $.cookie('sortFunName');
                if (funName.length > 0 && funName != 'undefined') {
                    // alert(funName);
                    eval('data.feeds.sort(' + funName + ');');
                }
            } catch (err) {
                data.feeds.sort(sortByDate);
            }
        }

        function start() {
            $.ajax({
                url : '/feed/all/',
                type : 'get',
                success : function (data){

                    data.forEach( function(item) {
                        testFeeds[item.value] =
                        {
                            feed_id: item.id,
                            feed_url: item.value
                        };
                        testFeeds["length"] = testFeeds["length"] + 1;
                    });
                    
                    initialize();
                }
            });
        }

        google.setOnLoadCallback(start);