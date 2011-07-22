// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];  
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
//make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

/*
# -----------------------------------------------------------------------
# Name ...... : TinyLight ( jQuery Plugin ). 
# Info ...... : Simple code snippet highlighter plugin for jQuery. 
# Author .... : Rainner Lins ( rainnerlins@gmail.com ) 
# Site ...... : http://rainnerlins.com/resources/work/jquery-tinylight/
# License ... : http://opensource.org/licenses/mit-license.php 
# Modified .. : MAR-20-2011 
# Version ... : 1.2 ( release.revisisons ) 
# -----------------------------------------------------------------------
*/

(function( $ )
		{
			var code_basics = function( t, p )
			{
				t = t.replace( /((?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\"))/gi, '<i class="tl-string'+p+'">$1</i>' ); // "strings"   
				t = t.replace( /([^\w\:\-]+)(\/\/.*?)(<br\s\/>)/gi, '$1<i class="tl-comment">$2</i>$3' ); // comment 
				t = t.replace( /(\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\/)/gi, '<i class="tl-comment">$1</i>' ); /* comment */
				t = t.replace( /(&lt;\![\r\n\t\s]*(--([^\-]|[\r\n]|-[^\-])*--[\r\n\t\s]*)&gt;)/gi, '<i class="tl-comment">$1</i>' ); // <!-- comment --> 
				t = t.replace( /(&lt;\?(php|\=))/gi, '<i class="tl-integer'+p+'">$1</i>' ); // <?php= 
				t = t.replace( /(&lt;\%(\=|\$|\#|\@)?)/gi, '<i class="tl-integer'+p+'">$1</i>' ); // ASP <%=@#$
				t = t.replace( /((\?|\%)&gt;)/gi, '<i class="tl-integer'+p+'">$1</i>' ); // %?>
				t = t.replace( /(&lt;|&gt;|&amp;|\&|\+|\-|\!)([\=]+)/gi, '<i class="tl-operator'+p+'">$1$2</i>' ); // >=, <=  
				t = t.replace( /((&amp;|\&){2,3})/gi, '<i class="tl-operator'+p+'">$1</i>' ); // &&  
				t = t.replace( /([\+\-\!\=\|\%]+)([\s\;\r]+)/gi, '<i class="tl-operator'+p+'">$1$2</i>' ); // ||, ===, %%, ++, --   
				t = t.replace( /([0-9\s]+)([\*\/\%\+\-]+)([0-9\s]+)/gi, '$1<i class="tl-operator'+p+'">$2</i>$3' ); // +, *  
				return t; 
			}
			var code_default = function( t, p )
			{
				t = t.replace( /([^\w])([0-9]+)/gi, '$1<i class="tl-integer'+p+'">$2</i>' ); // 0-9 
				t = t.replace( /(global|case|default|echo|print|exit|return|continue|break|true|false)+([\s\;\:]+)/gi, '<i class="tl-keyword'+p+'">$1</i>$2' ); // key; 
				t = t.replace( /(var|import|die|try|catch|do|while|class|switch|typeof|print_r)([\s\(\)\{]+|<br\s\/>)/gi, '<i class="tl-keyword'+p+'">$1</i>$2' ); // key ({ 
				t = t.replace( /(if|else|switch|for|foreach|empty)([\s\(\)\{]+|<br\s\/>)/gi, '<i class="tl-keyword'+p+'">$1</i>$2' ); // key ({ 
				t = t.replace( /(import|include|require)(\_once)?([\s\(\)\{]+|<br\s\/>)/gi, '<i class="tl-keyword'+p+'">$1$2</i>$3' ); // key ({ 
				t = t.replace( /([\:\(\=\>]\s+?)(null|false|true|this|parent)(\s+?[\)\;])/gi, '$1<i class="tl-keyword'+p+'">$2</i>$3' ); // =key, (key, key; 
				t = t.replace( /(new|extends?)([\s\w\{]+)/gi, '<i class="tl-keyword'+p+'">$1</i>$2' ); // =key, (key, key; 
				t = t.replace( /(\$\_[A-Z]+)/gi, '<i class="tl-global'+p+'">$1</i>' ); // $_GLOBALS;
				t = t.replace( /(\.|\:)([\w]+)([\s\;\)\,\-\+\=]+)/gi, '$1<i class="tl-function'+p+'">$2</i>$3' ); // :strict, .prop 
				t = t.replace( /([\w\-\_]+)(\s{0,1}\()/gi, '<i class="tl-function'+p+'">$1</i>$2' ); // function ( ); 
				return t; 
			}
			var code_css = function( t, p )
			{
				t = t.replace( /([\w\s\#\:\.\,\_\-]+)(\{|<br\s\/>)/gi, '<i class="tl-target'+p+'">$1</i>$2' ); // tag .class, #id 
				t = t.replace( /(\![\w\s\-]+)(\;)/gi, '<i class="tl-warn'+p+'">$1</i><i class="tl-target'+p+'">$2</i>' ); // !important; 
				t = t.replace( /(\@[\w\-\,]+)(\s+)/gi, '<i class="tl-import'+p+'">$1</i>$2' ); // @import, @media
				t = t.replace( /([\w\-]+)(\s+)?(\:)/gi, '$1$2<i class="tl-target'+p+'">$3</i>' ); // : 
				t = t.replace( /([\w\#\s\-\,]+)(\;)/gi, '<i class="tl-value'+p+'">$1</i><i class="tl-target'+p+'">$2</i>' ); // 10px value; 
				t = t.replace( /([\w\-\_]+)(\s+)?(\()/gi, '<i class="tl-value'+p+'">$1</i>$2$3' ); // function() 
				return t; 
			}
			var code_html = function( t, p )
			{
				t = t.replace( /(&lt;[\w\s\"\'\=\/\?\-\_\.]+(.*?)&gt;)/gi, '<i class="tl-tag'+p+'">$1</i>' ); // <tag> 
				t = t.replace( /(&lt;\/?(a|table|tr|td|th)(.*?)&gt;)/gi, '<i class="tl-table'+p+'">$1</i>' ); // <a..>, <table..>  
				t = t.replace( /(&lt;\/?(form|input|select|option|textarea)(.*?)&gt;)/gi, '<i class="tl-form'+p+'">$1</i>' ); // <form..>  
				t = t.replace( /(&lt;\/?(script)(.*?)&gt;)/gi, '<i class="tl-script'+p+'">$1</i>' ); // <script..>  
				t = t.replace( /(&lt;\/?(style|css)(.*?)&gt;)/gi, '<i class="tl-style'+p+'">$1</i>' ); // <style..>  
				t = t.replace( /(&lt;\/?(image|img)(.*?)&gt;)/gi, '<i class="tl-image'+p+'">$1</i>' ); // <img..>  
				t = t.replace( /([\w\-\_]+)(\s+)?(\()/gi, '<i class="tl-function'+p+'">$1</i>$2$3' ); // function() 
				return t; 
			}
			var code_xml = function( t, p )
			{
				t = t.replace( /(&lt;[\w\s\"\'\=\/\?\-\_\.]+(.*?)&gt;)/gi, '<i class="tl-tag'+p+'">$1</i>' ); // <tag> 
				t = t.replace( /(&lt;\!\[CDATA\[(.*?)\]\]&gt;)/gi, '<i class="tl-cdata'+p+'">$1</i>' ); // <![CDATA[ .. ]]> 
				return t; 
			}
			var space = function( t ) 
			{
				t = t.replace( /\s\s/gim, '&nbsp;&nbsp;' ); 
				t = t.replace( /\t/gim, '&nbsp;&nbsp;&nbsp;&nbsp;' ); 
				return t; 
			}	
			var trim = function( t )
			{
				t = t.replace( /^(&nbsp;)/gi, '' );  
				t = t.replace( /([\t\s\r\n]+)$/gi, '' );  
				return t; 
			}
			var prep = function( t ) 
			{
				t = t.replace( /^([\s\t\r\n]+)/gi, '' ); 
				t = t.replace( /([\s\t\r\n]+)$/gi, '' ); 
				t = t.replace( /<br.*?>/gi, '' ); 
				t = t.replace( /<.*?(code|pre).*?>/gi, '' ); 
				t = t.replace( /\&\s/gi, '&amp; ' ); 	
				t = t.replace( /\</gi, '&lt;' ); 
				t = t.replace( /\>/gi, '&gt;' ); 
				t = t.replace( /\r/gi, '' ); 
				return t; 
			}
			var style = function( t, p )
			{
				t = code_basics( t, p ); 
				if( /^\-(css|styles?)$/.test( p ) ){ return code_css( t, p ); }
				if( /^\-(s?html?)$/.test( p ) ){ return code_html( t, p ); } 
				if( /^\-(xml)$/.test( p ) ){ return code_xml( t, p ); }
				return code_default( t, p ); 
			}
			
			if( !$ ){ return; } 
			$.fn.tinylight = function( opt ) 
			{  
				return this.each( function() 
				{
					var WRAP   = $( this ); 
					var CODE   = String( WRAP.html() ); 
					var TYPE   = String( WRAP.attr( 'class' ) || 'code' ); 
					//
					var scrlrs = ( opt && opt.showScroller === false ) ? 'hidden' : 'auto'; 
					var width  = ( opt && opt.wordWrap !== false ) ? '100%' : '2000px'; 
					var height = ( opt && typeof opt.maxHeight === 'string' ) ? opt.maxHeight : 'auto'; 
					//
					var count  = 0; 
					var lines  = prep( CODE ).split( "\n" ); 
					var c      = { count:'', code:' ', out:'' }; 
					var i      = 0;
					// 
					for( i=0; i < lines.length; i++ ){ count = (i + 1); c.code += trim( lines[i] ) + "<br />"; } 
					// 
					c.out = '' + 
					'<div class="tl-wrap">' + 
						'<h1 class="tl-header">' + TYPE.toUpperCase() + ' Source - '+ count +' Lines</h1>' + 
						'<div class="tl-scroller">' + 
							'<div class="tl-code" style="width:'+width+';">' + space( style( trim( c.code ), '-'+TYPE ) ) + '</div>' + 
						'</div>' + 
					'</div>';
					// 
					WRAP
					.css( { 'display':'none' } ).after( c.out ).next()
					.css( { 'border-radius':'5px','-webkit-border-radius':'5px','-moz-border-radius':'5px'} ); 
					// 
					$( '.tl-scroller' )
					.css( { 'display':'block', 'overflow':'hidden', 'height':height } )
					.hover( 
						function(){ $( this ).css( 'overflow', scrlrs ); }, 
						function(){ $( this ).css( 'overflow', 'hidden' ); } 
					); 
					// 
					$( '.tl-cdata, .tl-string, .tl-comment' ).each( function() 
					{
						var o = $( this ); 
						var t = String( o.html() ).replace( /<\/?i([\w\s\=\'\"\-]+)?>/gim, '' ); 
						o.html( t );  
					}); 
					
				});
			}
		})( jQuery ); 
