$(function(){
    
	/*
	 * Sintax highlight
	 * 
	 */
	$( 'pre' ).tinylight( { wordWrap:false, showScroller:false, maxHeight:'auto' } );
	
	/*
	 * Last modified date of current document
	 * TODO: Fix footer position 
	 * 
	 */
	$('#lastmodified').text("Page last modified: "+ document.lastModified)
	
	
	
	/*
	 * Last modified date of a file
	 * TODO: Move to an object, or event better a plugin 
	 * 
	 */
	
	var filehref = $('#mainmenu li a').attr('href');
	console.log(filehref);
	
	$.get('javascript-basics.html', function(data) {
		//console.log(this.lastModified);
	});

	var getMTime = function(url, callback) {
	  var xhr = XMLHttpRequest();
	  xhr.open('HEAD', url, true); // use HEAD - we only need the headers
	  xhr.onreadystatechange = function() {
	    if (xhr.readyState === 4 && xhr.status === 200) {
	      var mtime = new Date(xhr.getResponseHeader('Last-Modified'));
	      if (mtime.toString() === 'Invalid Date') {
	        callback(); // dont want to return a bad date
	      } else {
	        callback(mtime);
	      }
	    }
	  }
	  xhr.send();
	};
	
	getMTime('./javascript-basics.html', function(mtime) {
	  console.log('the mtime is:' + mtime.toISOString());
	});	

	console.log();
	
});