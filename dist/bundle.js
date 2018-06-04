(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["sslssso"] = factory();
	else
		root["sslssso"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

// var console = window.console || { log: function() {} };

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
		if (window.attachEvent) {
			// IE before version 9
			//TODO No acaba de funcionar en ie8
			win.postMessage(JSON.stringify(message), "*");
		} else {
			win.postMessage(message, _getUrl());
		}
	}

	function dispatchEvent(eventName, detail) {
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
			if (typeof onLogout == "function") onLogout();
			dispatchEvent('sso.onlogout');
		} else if (data && data.action == "sso.onload") {
			if (typeof onLoad == "function") onLoad();
			dispatchEvent('sso.onload');
		} else if (data && data.action == "sso.onidentification") {
			if (typeof onIdentification == "function") onIdentification(data);
			dispatchEvent('sso.onidentification', data);
		} else if (data && data.action == "sso.noauthfound") {
			if (typeof noAuthFound == "function") noAuthFound(data);
			dispatchEvent('sso.noauthfound', data);
		}
	}

	function _init() {

		var accountId = _getAccountId();

		//Message listener for SSO events (created by the SSO iframe)
		if (window.addEventListener) {
			addEventListener("message", _listener, false);
		} else {
			attachEvent("onmessage", _listener);
		}

		//Creates the iframe with reference to server SSO functions
		var iframeUrl = _getIframeUrl();
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

module.exports = __webpack_require__.p + "cd7ea539de2cef6e5b983c09360d3a4b.html";

/***/ })
/******/ ]);
});