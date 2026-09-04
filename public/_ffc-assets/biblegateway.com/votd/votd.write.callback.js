(function() {

/* Keep everything in BG variable
    augment existing variable if it exists.
*/
if ( !window.BG || typeof window.BG !== 'object') {
    window.BG = {};
}
var BG = window.BG;

BG.votdWriteCallback = function(json) {
    var votd = json.votd;
    var votd_html = '';
    votd_html += '<div>' + votd.text;
    votd_html += ' -<a href="' + votd.permalink +'">' + votd.display_ref + '</a>';
    if (votd.audiolink) {
      votd_html += ' <a rel="nofollow" href="' + votd.audiolink + '" title="Listen to chapter"><img alt="Listen to chapter" src="//www.biblegateway.com/assets/images/audio/sound.gif" border=0/></a>';
    }
    votd_html += ' <a href="' + votd.copyrightlink + '">' + votd.copyright + '</a>';
    votd_html += '<br/><br/>Powered by <a rel="nofollow" href="https://www.biblegateway.com/">BibleGateway.com</a>';
    votd_html += '</div>';
    document.write(votd_html);
};

window.BG = BG;

})();
