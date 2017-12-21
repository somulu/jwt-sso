var sslssso =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sso = __webpack_require__(1);

var _sso2 = _interopRequireDefault(_sso);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);

var console = window.console || { log: function log() {} };

function Observable() {

	this.listen = function (type, method, scope, context) {
		var listeners, handlers;
		if (!(listeners = this.listeners)) {
			listeners = this.listeners = {};
		}
		if (!(handlers = listeners[type])) {
			handlers = listeners[type] = [];
		}
		scope = scope ? scope : window;
		handlers.push({
			method: method,
			scope: scope,
			context: context ? context : scope
		});
	};
	this.fireEvent = function (type, data, context) {
		var listeners, handlers, i, n, handler, scope;
		if (!(listeners = this.listeners)) {
			return;
		}
		if (!(handlers = listeners[type])) {
			return;
		}
		for (i = 0, n = handlers.length; i < n; i++) {
			handler = handlers[i];
			if (typeof context !== "undefined" && context !== handler.context) continue;
			if (handler.method.call(handler.scope, this, type, data) === false) {
				return false;
			}
		}
		return true;
	};
};

function sslssso() {
	//"use strict";


	var DEFAULT_IFRAME_URI = _sso2.default;

	var obs = new Observable();
	var config = {};
	/*
 obs.listen("sso.onload", function(observable, eventType, data){
     console.log("----------------");
     console.log("sso.onload");
     console.log("----------------");
 });
 */
	this.listen = function (type, method, scope, context) {
		obs.listen(type, method, scope, context);
	};

	this.logout = function () {
		var message = { action: "logout" };
		postSSOMessage(message, _getUrl());
	};

	this.login = function (jwt) {
		var message = { action: "login", jwt: jwt };
		postSSOMessage(message, _getUrl());
	};

	function _getMeta(name) {
		var metas = document.getElementsByTagName('meta');

		for (var i = 0; i < metas.length; i++) {
			if (metas[i].getAttribute("name") == name) {
				return metas[i].getAttribute("content");
			}
		}
		return null;
	}

	function _getAccountId() {
		if (config.accountId) {
			return config.accountId;
		} else if (_getMeta("ssls.accountId")) {
			return _getMeta("ssls.accountId");
		} else if (typeof ssls_accountId !== 'undefined' && ssls_accountId) {
			return ssls_accountId;
		}

		return null;
	}

	function _getValidationUrl() {
		if (config.validationUrl) {
			return config.validationUrl;
		} else if (_getMeta("ssls.validationUrl")) {
			return _getMeta("ssls.validationUrl");
		} else if (typeof ssls_validationUrl !== 'undefined' && ssls_validationUrl) {
			return ssls_validationUrl;
		}
		return null;
	}

	function _getValidate() {
		if (config.validate) {
			return config.validate;
		} else if (_getMeta("ssls.validate")) {
			return _getMeta("ssls.validate");
		}

		return null;
	}

	var _getScriptURL = function () {
		var scripts = document.getElementsByTagName('script');
		var index = scripts.length - 1;
		var myScript = scripts[index];
		return function () {
			return myScript.src;
		};
	}();

	function _getIframeUrl() {
		var parser = document.createElement('a');
		parser.href = _getScriptURL();

		var pathname = parser.pathname.substring(0, parser.pathname.lastIndexOf("/"));
		var url = parser.protocol + "//" + parser.host + "/" + pathname + "/" + DEFAULT_IFRAME_URI;

		var origin = document.location.origin;
		var accountId = _getAccountId();
		var validationUrl = _getValidationUrl();
		var validate = _getValidate();

		url = url + "?domain=" + origin;
		if (accountId) {
			url = url + "&accountId=" + accountId;
		}

		if (validationUrl) {
			url = url + "&validationUrl=" + validationUrl;
		}

		if (validate != null) {
			url = url + "&validate=" + validate;
		}
		return url;
	}

	function _getUrl() {

		//https://gist.github.com/jlong/2428561
		var parser = document.createElement('a');
		parser.href = _getScriptURL();
		return parser.protocol + "//" + parser.host;

		/*
  var metas = document.getElementsByTagName('meta');
  for (var i=0; i<metas.length; i++) {
    if (metas[i].getAttribute("name") == "ssls.url") {
      return metas[i].getAttribute("content");
   }
  }
  if (typeof ssls_url !== 'undefined' && ssls_url) {
  return ssls_url;
  }
  return DEFAULT_URL;
  */
	}

	function postSSOMessage(message, domain) {
		var win = document.getElementById("ssls.sso.iframe").contentWindow;
		console.log("[SSLS SSO] postMessage " + message.action + " to " + _getUrl());
		if (window.attachEvent) {
			// IE before version 9
			//TODO No acaba de funcionar en ie8
			win.postMessage(JSON.stringify(message), "*");
		} else {
			win.postMessage(message, _getUrl());
		}
	}

	function dispatchEvent(eventName, detail) {
		console.log("[SSLS SSO] dispatchEvent " + eventName);
		obs.fireEvent(eventName, detail);
	}

	function _listener(event) {

		if (_getUrl().lastIndexOf(event.origin) == -1) {
			return;
		}

		var data = event.data; //Chrome, firefox, IE11 , etc
		if (event.data && !event.data.action) {
			//<=IE8 & IE9 porque no soporta JSON en objetos de mensaje
			data = eval('(' + event.data + ')');
		}

		if (data && data.action == "sso.onlogout") {
			console.log("[SSLS SSO] received event onlogout");
			if (typeof onLogout == "function") onLogout();
			dispatchEvent('sso.onlogout');
		} else if (data && data.action == "sso.onload") {
			console.log("[SSLS SSO] received event onload ");
			if (typeof onLoad == "function") onLoad();
			dispatchEvent('sso.onload');
		} else if (data && data.action == "sso.onidentification") {
			console.log("[SSLS SSO] received event onidentification ");
			if (typeof onIdentification == "function") onIdentification(data);
			dispatchEvent('sso.onidentification', data);
		}
	}

	function _init() {

		var accountId = _getAccountId();
		console.log("[SSLS SSO] accountId = " + accountId + " SSOServerUrl= " + _getUrl());

		//Message listener for SSO events (created by the SSO iframe)
		if (window.addEventListener) {
			addEventListener("message", _listener, false);
		} else {
			attachEvent("onmessage", _listener);
		}

		//Creates the iframe with reference to server SSO functions
		var iframeUrl = _getIframeUrl();
		console.log("[SSLS SSO] create iframe: " + iframeUrl);
		var iframe = document.createElement('iframe');
		iframe.style.display = "none";
		iframe.src = iframeUrl;
		iframe.id = 'ssls.sso.iframe';
		document.body.appendChild(iframe);
	}

	function init(conf) {
		if (conf) {
			config = conf;
		}
	}

	if (window.addEventListener) {
		// W3C standard
		window.addEventListener('load', _init, false); // NB **not** 'onload'
	} else if (window.attachEvent) {
		// Microsoft
		window.attachEvent('onload', _init);
	}
}

module.exports = new sslssso();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "90398aded4c724441bf1a8678d057e4c.html";

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LogLevels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
var logLevel = LogLevels.DEBUG;
var console = window.console || { log: function log() {} };
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function encode(e) {
		var t = "";var n, r, i, s, o, u, a;var f = 0;e = Base64._utf8_encode(e);while (f < e.length) {
			n = e.charCodeAt(f++);r = e.charCodeAt(f++);i = e.charCodeAt(f++);s = n >> 2;o = (n & 3) << 4 | r >> 4;u = (r & 15) << 2 | i >> 6;a = i & 63;if (isNaN(r)) {
				u = a = 64;
			} else if (isNaN(i)) {
				a = 64;
			}t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
		}return t;
	}, decode: function decode(e) {
		var t = "";var n, r, i;var s, o, u, a;var f = 0;e = e.replace(/[^A-Za-z0-9+/=]/g, "");while (f < e.length) {
			s = this._keyStr.indexOf(e.charAt(f++));o = this._keyStr.indexOf(e.charAt(f++));u = this._keyStr.indexOf(e.charAt(f++));a = this._keyStr.indexOf(e.charAt(f++));n = s << 2 | o >> 4;r = (o & 15) << 4 | u >> 2;i = (u & 3) << 6 | a;t = t + String.fromCharCode(n);if (u != 64) {
				t = t + String.fromCharCode(r);
			}if (a != 64) {
				t = t + String.fromCharCode(i);
			}
		}t = Base64._utf8_decode(t);return t;
	}, _utf8_encode: function _utf8_encode(e) {
		e = e.replace(/rn/g, "n");var t = "";for (var n = 0; n < e.length; n++) {
			var r = e.charCodeAt(n);if (r < 128) {
				t += String.fromCharCode(r);
			} else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);t += String.fromCharCode(r & 63 | 128);
			} else {
				t += String.fromCharCode(r >> 12 | 224);t += String.fromCharCode(r >> 6 & 63 | 128);t += String.fromCharCode(r & 63 | 128);
			}
		}return t;
	}, _utf8_decode: function _utf8_decode(e) {
		var t = "";var n = 0;var r = c1 = c2 = 0;while (n < e.length) {
			r = e.charCodeAt(n);if (r < 128) {
				t += String.fromCharCode(r);n++;
			} else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);t += String.fromCharCode((r & 31) << 6 | c2 & 63);n += 2;
			} else {
				c2 = e.charCodeAt(n + 1);c3 = e.charCodeAt(n + 2);t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);n += 3;
			}
		}return t;
	} };

function log(level, object) {
	if (level >= logLevel) {
		console.log(object);
	}
}

function getOrigin() {
	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
	}
	return window.location.origin;
}

function getGetParam(vr) {
	var src = String(window.location.href).split('?')[1];

	if (src != null) {
		var vrs = src.split('&');

		for (var x = 0, c = vrs.length; x < c; x++) {
			if (vrs[x].indexOf(vr) == 0) {
				return decodeURI(vrs[x].split('=')[1]);
				break;
			};
		};
	} else {
		return "";
	}
};

function JWT(jwt) {
	"use strict";

	this.header = function () {
		var headerB64u = jwt.substring(0, jwt.indexOf('.'));
		var headerB64 = _b64utob64(headerB64u);
		var headerJSON = Base64.decode(headerB64);
		var header = JSON.parse(headerJSON);
		return header;
	};
	this.payload = function () {
		var payloadB64u = jwt.substring(jwt.indexOf('.') + 1, jwt.lastIndexOf('.'));
		var payloadB64 = _b64utob64(payloadB64u);
		var payloadJSON = Base64.decode(payloadB64);
		var payload = JSON.parse(payloadJSON);
		return payload;
	};

	this.isExpired = function () {
		var body = this.payload();
		if (body.exp) {
			return body.exp <= Date.now() / 1000;
		} else {
			return true;
		}
	};

	function _b64tob64u(a) {
		a = a.replace(/\=/g, "");
		a = a.replace(/\+/g, "-");
		a = a.replace(/\//g, "_");
		return a;
	};

	function _b64utob64(a) {
		if (a.length % 4 == 2) {
			a = a + "==";
		} else {
			if (a.length % 4 == 3) {
				a = a + "=";
			}
		}
		a = a.replace(/-/g, "+");
		a = a.replace(/_/g, "/");
		return a;
	};
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function RestClient(host, accountId, apiKey, scheme) {
	"use strict";

	//this.host = host;
	//this.accountId = accountId;
	//this.apiKey = apiKey;

	scheme = _validateScheme(scheme);

	this.validateJWT = function (jwt, fulfill, reject) {
		//var uri = host+'/sso/' + accountId + '/jwt';
		var uri = host;
		var request = { jwt: jwt };
		return _post(uri, request, fulfill, reject);
	};

	function _validateScheme(scheme) {
		if (!scheme) scheme = "Basic";

		if (!(scheme == 'Basic' || scheme == 'JWT' || scheme == 'CJWT')) throw "Scheme " + scheme + "not valid";

		return scheme;
	}

	function _makeAuth(scheme, user, password) {
		var tok = user + ':' + password;
		var hash;
		if (window.btoa) {
			hash = btoa(tok);
		} else {
			hash = Base64.encode(tok);
		}
		return scheme + " " + hash;
	}

	function _get(url, fulfill, reject) {
		var contentType = "application/json; charset=utf-8";

		log(LogLevels.INFO, "GET " + url + " " + contentType);

		$.support.cors = true;
		$.ajax({
			type: "GET", //GET or POST or PUT or DELETE verb
			url: url, // Location of the service
			crossdomain: true,
			contentType: contentType,
			accepts: { text: "application/json" },
			dataType: "json",
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader("Authorization", _makeAuth(scheme, accountId, apiKey));
			}
		}).done(function (response) {
			response = _decodeJson(response);
			fulfill(response);
		}).fail(function (err) {
			reject(err);
		});
	}

	function makeBearerAuth(token) {
		return "Bearer " + token;
	}

	function _post(url, request, fulfill, reject) {

		var contentType = "application/json; charset=utf-8";
		var jsondata = null;
		if (request) jsondata = JSON.stringify(request, null, 4);

		log(LogLevels.INFO, "POST " + url + " " + contentType);
		log(LogLevels.DEBUG, "  Request: " + jsondata);

		$.support.cors = true;
		$.ajax({
			type: "POST", //GET or POST or PUT or DELETE verb
			url: url, // Location of the service
			data: jsondata, //Data sent to server
			contentType: contentType,
			crossdomain: true,
			beforeSend: function beforeSend(xhr) {
				// Modified to send Auth header as expected by JWT server
				xhr.setRequestHeader("Authorization", makeBearerAuth(request.jwt));
			}
		}).done(function (response) {

			response = _decodeJson(response);
			fulfill(response);
		}).fail(function (err) {
			reject(err);
		});
	}

	function _postForm(url, request, fulfill, reject) {
		//return new Promise(function(fulfill, reject) {
		//var contentType = "application/json; charset=utf-8";
		var contentType = "application/x-www-form-urlencoded";
		var jsondata = null;
		if (request) jsondata = JSON.stringify(request, null, 4);

		log(LogLevels.INFO, "POST " + url + " " + contentType);
		log(LogLevels.DEBUG, "  Request: " + jsondata);

		$.support.cors = true;
		$.ajax({
			type: "POST", //GET or POST or PUT or DELETE verb
			url: url, // Location of the service
			data: request, //Data sent to server
			contentType: contentType,
			crossdomain: true,
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader("Authorization", _makeAuth(scheme, accountId, apiKey));
			}
		}).done(function (response) {

			response = _decodeJson(response);
			fulfill(response);
		}).fail(function (err) {
			reject(err);
		});
		//});
	}

	function _postFormNoJQuery(url, request, fulfill, reject) {

		var contentType = "application/x-www-form-urlencoded";
		var jsondata = null;
		if (request) jsondata = JSON.stringify(request, null, 4);

		log(LogLevels.INFO, "POST " + url + " " + contentType);
		log(LogLevels.DEBUG, "  Request: " + jsondata);

		_ajax.post(url, request, function (response) {
			response = _decodeJson(response);
			fulfill(response);
		});
	}

	function _delete(url, fulfill, reject) {

		var contentType = "application/json; charset=utf-8";
		var jsondata = null;

		log(LogLevels.INFO, "DELETE " + url + " " + contentType);

		$.support.cors = true;
		$.ajax({
			type: "DELETE", //GET or POST or PUT or DELETE verb
			url: url, // Location of the service
			data: jsondata, //Data sent to server
			contentType: contentType,
			crossdomain: true,
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader("Authorization", _makeAuth(scheme, accountId, apiKey));
			}
		}).done(function (response) {
			response = _decodeJson(response);
			fulfill(response);
		}).fail(function (err) {
			reject(err);
		});
	}

	function _isAbv(value) {
		var ArrayBufferView = Object.getPrototypeOf(Object.getPrototypeOf(new Uint8Array())).constructor;
		return value instanceof ArrayBufferView;
	}
	function _isAb(value) {
		return value && value instanceof ArrayBuffer && value.byteLength;
	}

	function _postStream(url, data, fulfill, reject) {

		var contentType = "application/octet-stream";

		log(LogLevels.INFO, "POST " + url + " " + contentType);
		log(LogLevels.DEBUG, data);

		if (!_isAbv(data) && !_isAb(data)) throw "data is not an ArrayBuffer";

		$.support.cors = true;
		$.ajax({
			type: "POST", //GET or POST or PUT or DELETE verb
			url: url, // Location of the service
			data: data, //Data sent to server
			contentType: contentType,
			processData: false,
			crossdomain: true,
			beforeSend: function beforeSend(xhr) {
				xhr.setRequestHeader("Authorization", _makeAuth(scheme, accountId, apiKey));
			}
		}).done(function (response) {
			response = _decodeJson(response);
			fulfill(response);
		}).fail(function (err) {
			reject(err);
		});
	}

	function _decodeJson(response) {
		if (response) {
			var jsonresponse = response;
			if ((typeof response === "undefined" ? "undefined" : _typeof(response)) === 'object') jsonresponse = JSON.stringify(response, null, 4);
			log(LogLevels.DEBUG, "  Response: " + jsonresponse);
			var obj = JSON.parse(jsonresponse);
			return obj;
		} else {
			log(LogLevels.DEBUG, "  Response: NULL");
			return;
		}
	}

	function _convertMimetype(mimetype) {
		if (mimetype == 'gallery/manual') return 'application/pdf';else if (mimetype == 'application/binary') return 'application/pdf';
		return mimetype;
	}

	var _ajax = {};
	_ajax.x = function () {
		if (typeof XMLHttpRequest !== 'undefined') {
			return new XMLHttpRequest();
		}
		var versions = ["MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];

		var xhr;
		for (var i = 0; i < versions.length; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			} catch (e) {}
		}
		return xhr;
	};

	_ajax.send = function (url, callback, method, data, async) {
		if (async === undefined) {
			async = true;
		}
		var x = _ajax.x();
		x.open(method, url, async);
		x.onreadystatechange = function () {
			if (x.readyState == 4) {
				callback(x.responseText);
			}
		};
		if (method == 'POST') {
			x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		x.send(data);
	};

	_ajax.get = function (url, data, callback, async) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		_ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
	};

	_ajax.post = function (url, data, callback, async) {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		_ajax.send(url, callback, 'POST', query.join('&'), async);
	};
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validationUrl;
var validate;
var accountId;
var tokenId;
var apiKey;

function onIdentification(operation) {
  log(LogLevels.INFO, "[SSO IFRAME] fire event onidentification jwt: " + operation.jwt);

  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";

  postMessageToListeners(operation, domain);
}

function onLogout() {
  log(LogLevels.INFO, "[SSO IFRAME] fire event onlogout ");

  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";
  log(LogLevels.DEBUG, "[SSO IFRAME] postMessage to: " + domain);
  var operation = { action: "sso.onlogout" };

  postMessageToListeners(operation, domain);
}

function onLoad() {
  log(LogLevels.INFO, "[SSO IFRAME] fire event onload ");

  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";
  log(LogLevels.DEBUG, "[SSO IFRAME] postMessage to: " + domain);
  var operation = { action: "sso.onload" };

  postMessageToListeners(operation, domain);
}

function postMessageToListeners(operation, domain) {
  log(LogLevels.DEBUG, "[SSO IFRAME] postMessage " + operation.action + " to: " + domain);
  if (window.attachEvent) {
    // IE before version 9
    window.parent.postMessage(JSON.stringify(operation), domain);
  } else {
    window.parent.postMessage(operation, domain);
  }
}

function doLogout() {
  log(LogLevels.INFO, "[SSO IFRAME] logout ");
  localStorage.removeItem(tokenId);

  onLogout();
}

function doLogin(jwt) {
  log(LogLevels.INFO, "[SSO IFRAME] login :" + jwt);
  localStorage.setItem(tokenId, jwt);
  /*if (isIE()){
    //Mas mierda de IE. En el caso de IE11 no sincroniza entre pesta�as si no haces esta guarrer�a. Y tampoco va
    localStorage.setItem('dummy', 'dummyvalue');
    localStorage.removeItem('dummy');
  } */
}

function localStorageHandler(e) {

  log(LogLevels.DEBUG, '[SSO IFRAME] Successfully communicate with other tab');
  log(LogLevels.DEBUG, '[SSO IFRAME] Received data: ' + localStorage.getItem(tokenId));
  var jwtsso = localStorage.getItem(tokenId);
  if (jwtsso) {
    validateJWT(jwtsso);
  } else {
    onLogout();
  }
}
function localStorageHandlerIE8(e) {
  log(LogLevels.DEBUG, '[SSO IFRAME] Successfully communicate with other tab IE8');

  // var jwtsso = localStorage.getItem(tokenId); ->  old value in IE
  // timeout waiting IE8 browser to update the new value
  setTimeout(function () {
    var jwtsso = localStorage.getItem(tokenId); // new value
    if (jwtsso) {
      validateJWT(jwtsso);
    } else {
      onLogout();
    }
  }, 1); // delay
}

function listener(event) {
  //if ( event.origin !== "https://pfb.sslsignature.com" ){
  //  return;
  //}
  log(LogLevels.DEBUG, "[SSO IFRAME] received event ");

  var data = event.data; //Chrome, firefox, IE11 , etc
  if (event.data && !event.data.action) {
    //<=IE8 & IE9 porque no soporta JSON en objetos de mensaje
    data = eval('(' + event.data + ')');
  }

  if (data.hasOwnProperty('action')) {
    log(LogLevels.DEBUG, "[SSO IFRAME] received event " + data.action);
    var action = data.action;
    if (action == 'logout') {
      doLogout();
    } else if (action == 'login') {
      if (data.hasOwnProperty('jwt')) {
        doLogin(data.jwt);
      }
    }
  } else {
    log(LogLevels.WARN, "[SSO IFRAME] received unknown event ");
  }
}

function validateJWT(jwtsso) {
  if (validate && validationUrl) {
    //Invoke server to get remote validation of token signature, parse and return extra data if necessary
    validateJWTRemote(jwtsso);
  } else {
    //Do not validate. Expected token validation on first usage of jwt
    parseJWTLocal(jwtsso);
  }
}

function validateJWTRemote(jwtsso) {
  log(LogLevels.DEBUG, "[SSO IFRAME] Remote validation of JWT with url: " + validationUrl + " accountId:" + accountId + " apiKey:" + apiKey);

  jwt = new JWT(jwtsso);
  log(LogLevels.DEBUG, jwt.payload());
  var rest = new RestClient(validationUrl, accountId, apiKey);

  /*
   POST validationUrl
   jwt={jwtsso}
    Expected JSON response {status:SUCCESS,sub:yourUserId, jwt:newTokenIfNeeded, eidentifier:username, name:fullname, email:useremail, ... }
   or {AuthenticationOperation: {status:SUCCESS,sub:...} }
   */
  rest.validateJWT(jwtsso, function (obj) {
    var operation = obj;
    if (obj.AuthenticationOperation) {
      operation = obj.AuthenticationOperation;
    }
    log(LogLevels.DEBUG, "[SSO IFRAME] Validating token " + operation.status);

    if (operation.status == 'SUCCESS') {
      log(LogLevels.INFO, "[SSO IFRAME] token is valid ");
      if (operation.jwt && operation.jwt != jwtsso) {
        log(LogLevels.INFO, "[SSO IFRAME] Backend issued a new JWT. Replace current token");
        doLogin(operation.jwt);
      } else {
        operation.jwt = jwtsso;
      }

      operation.action = "sso.onidentification";

      //Identification successful. Fire onIdentification event
      onIdentification(operation);
    } else {
      localStorage.removeItem(tokenId);
      log(LogLevels.ERROR, "[SSO IFRAME] invalid token: " + operation.error);
    }
    //Authentication process finish. //fire onload event
    onLoad();
  }, function (err) {
    log(LogLevels.DEBUG, err);
  });
}

function parseJWTLocal(jwtsso) {
  log(LogLevels.INFO, "[SSO IFRAME] Local parse of JWT (no signature validation)");
  try {
    var jwt = new JWT(jwtsso);
    var payload = jwt.payload();
    log(LogLevels.DEBUG, payload);

    if (jwt.isExpired()) throw "JWT expired";

    //We have not validated. So UNKNOWN
    payload.status = 'UNKNOWN';
    payload.action = "sso.onidentification";
    payload.jwt = jwtsso;

    //Identification finished. Fire onIdentification event
    onIdentification(payload);
  } catch (err) {
    //Bad token. remove it
    localStorage.removeItem(tokenId);
    log(LogLevels.ERROR, "[SSO IFRAME] invalid token: " + err);
  }
  //Authentication process finish. //fire onload event
  onLoad();
}

function ready() {
  var jwtsso = localStorage.getItem(tokenId);
  log(LogLevels.INFO, "[SSO IFRAME] ready");
  log(LogLevels.DEBUG, "[SSO IFRAME] " + tokenId + " = " + jwtsso);
  if (jwtsso) {
    validateJWT(jwtsso);
  } else {
    //OnLoad must be the last method invocation. Invoked head or from validateJWT after token validation
    onLoad();
  }
}

function init(config) {
  //Listener for localStorage changes of ssls.sso.jwt.[accountId] tokens
  if (window.addEventListener) {
    // Normal browsers
    window.addEventListener("storage", localStorageHandler, false);
  } else {
    // for IE (why make your life more difficult)
    //Adem�s hay que suscribierse al documento y no al windows
    //Y para acabar de tocar los huevos, localStorage.getItem devuelve el valor viejo y no el nuevo. Por supuesto el evento no lleva la informacion
    //window.attachEvent("onstorage", localStorageHandlerIE8);
    document.attachEvent("onstorage", localStorageHandlerIE8);
  };

  //Iframe message listener from SSO clients
  if (window.addEventListener) {
    addEventListener("message", listener, false);
  } else {
    attachEvent("onmessage", listener);
  }

  //onLoad document listener
  if (window.addEventListener) {
    // W3C standard
    window.addEventListener('load', ready, false); // NB **not** 'onload'
  } else if (window.attachEvent) {
    // Microsoft
    window.attachEvent('onload', ready);
  }

  validationUrl = config.validationUrl;
  validate = config.validate;
  accountId = config.accountId;
  tokenId = config.tokenId;
  apiKey = config.apiKey;
  log(LogLevels.INFO, "[SSO IFRAME] inited");
}

//init();

/***/ })
/******/ ]);