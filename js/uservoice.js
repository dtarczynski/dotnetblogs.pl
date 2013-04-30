  var uservoiceOptions = {
    key: 'dotnetblogspl',
    host: 'dotnetblogspl.uservoice.com', 
    forum: '75743',
    alignment: 'left',
    background_color:'#f00', 
    text_color: 'white',
    hover_color: '#06c',
    lang: 'en',
    showTab: true
  };
  function _loadUserVoice() {
    var s = document.createElement('script');
    s.src = ("https:" == document.location.protocol ? "https://" : "http://") + "uservoice.com/javascripts/widgets/tab.js";
    document.getElementsByTagName('head')[0].appendChild(s);
  }
  _loadSuper = window.onload;
  window.onload = (typeof window.onload != 'function') ? _loadUserVoice : function() { _loadSuper(); _loadUserVoice(); };