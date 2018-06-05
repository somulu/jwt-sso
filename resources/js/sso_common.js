// var LogLevels = {DEBUG:0, INFO:1, WARN:2, ERROR:3};
// var logLevel = LogLevels.ERROR;
// var console = window.console || { log: function() {} };
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r = 0;var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// function log(level, object){
// 	if (level >= logLevel){
// 		console.log (object);
// 	}
// }

function getOrigin(){
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
	return window.location.origin;
}

function getGetParam (vr){
    var src = String( window.location.href ).split('?')[1];

    if (src != null) {
      	var vrs = src.split('&');

       	for (var x = 0, c = vrs.length; x < c; x++)	{
        		if (vrs[x].indexOf(vr) == 0){
        			return decodeURI( vrs[x].split('=')[1] );
        			break;
        		};
        	};
    } else {
      	 return "";
    }
};

function getCookieByName(name) {
  var parts, value;
  value = '; ' + document.cookie;
  parts = value.split('; ' + name + '=');
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

function setPersistentCookie(name, value) {
  // Build the expiration date string:
  var expiration_date = new Date();
  var cookie_string = '';
  expiration_date.setFullYear(expiration_date.getFullYear() + 5);
  // Build the set-cookie string:
  cookie_string = name + '=' + value + "; path=/; expires=" + expiration_date.toUTCString();
  // Create or update the cookie:
  document.cookie = cookie_string;
}

function deleteCookieByName(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function isSafariBrowser() {
  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
  // Chrome has Safari in the user agent so we need to filter (https://stackoverflow.com/a/7768006/1502448)
  var is_chrome = navigator.userAgent.indexOf("Chrome") > -1;
  if ((is_chrome) && (is_safari)) {is_safari = false;}
  return is_safari;
}


function JWT (jwt){
	"use strict";
	 this.header = function() {
		 var headerB64u = jwt.substring(0,jwt.indexOf('.'));
		 var headerB64 = _b64utob64(headerB64u);
		 var headerJSON = Base64.decode(headerB64);
		 var header = JSON.parse( headerJSON );
		 return header;
	 };
	 this.payload = function() {
		 var payloadB64u = jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'));
		 var payloadB64 = _b64utob64(payloadB64u);
		 var payloadJSON = Base64.decode(payloadB64);
		 var payload = JSON.parse( payloadJSON );
		 return payload;
	 };

	 this.isExpired = function(){
		 var body = this.payload();
		 if (body.exp){
			 return body.exp <= Date.now()/1000;
		 } else {
			 return true;
		 }

	 };



	function _b64tob64u(a){
		a=a.replace(/\=/g,"");
		a=a.replace(/\+/g,"-");
		a=a.replace(/\//g,"_");
		return a;
	};

	function _b64utob64(a){
		if(a.length%4==2){
			a=a+"==";
		}else{
			if(a.length%4==3){
				a=a+"=";
			}
		}
		a=a.replace(/-/g,"+");
		a=a.replace(/_/g,"/");
		return a;
	};
};

module.exports = {
	getOrigin: getOrigin,
	getGetParam: getGetParam,
	JWT: JWT,
	Base64: Base64,
  setPersistentCookie: setPersistentCookie,
	getCookieByName: getCookieByName,
  deleteCookieByName: deleteCookieByName,
	isSafariBrowser: isSafariBrowser
}
