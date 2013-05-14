google.load('feeds', '1');

        var testFeeds = [];

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

                $("#moderate_feed_ok_button").one('click', function(){
                    var selectedOption = $("[name='moderate_type']:checked").val();

                    var data = {
                        selectedOption : selectedOption
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
               var rssFeed = new google.feeds.Feed(testFeeds[feedId]);
               callbackTrack.queue = callbackTrack.queue || [false];
               rssFeed.load(callbackTrack);
           }

            allDone();
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
                        testFeeds.push(item.value);
                    });
                    
                    initialize();
                }
            });
        }

        google.setOnLoadCallback(start);