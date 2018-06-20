!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.sslssso=e():t.sslssso=e()}("undefined"!=typeof self?self:this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return t[o].call(a.exports,a,a.exports,e),a.l=!0,a.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}function Observable(){this.listen=function(t,e,n,o){var a,i;(a=this.listeners)||(a=this.listeners={}),(i=a[t])||(i=a[t]=[]),n=n||window,i.push({method:e,scope:n,context:o||n})},this.fireEvent=function(t,e,n){var o,a,i,s,r;if((o=this.listeners)&&(a=o[t])){for(i=0,s=a.length;i<s;i++)if(r=a[i],(void 0===n||n===r.context)&&!1===r.method.call(r.scope,this,t,e))return!1;return!0}}}function sslssso(){function _getMeta(t){for(var e=document.getElementsByTagName("meta"),n=0;n<e.length;n++)if(e[n].getAttribute("name")==t)return e[n].getAttribute("content");return null}function _getAccountId(){return config.accountId?config.accountId:_getMeta("ssls.accountId")?_getMeta("ssls.accountId"):"undefined"!=typeof ssls_accountId&&ssls_accountId?ssls_accountId:null}function _getValidationUrl(){return config.validationUrl?config.validationUrl:_getMeta("ssls.validationUrl")?_getMeta("ssls.validationUrl"):"undefined"!=typeof ssls_validationUrl&&ssls_validationUrl?ssls_validationUrl:null}function _getValidate(){return config.validate?config.validate:_getMeta("ssls.validate")?_getMeta("ssls.validate"):null}function _getRedirectRequired(){return config.redirectRequired?config.redirectRequired:_getMeta("ssls.crossdomainredirect")?_getMeta("ssls.crossdomainredirect"):null}function _getIframeUrl(){var t=document.createElement("a");t.href=_getScriptURL();var e=t.pathname.substring(0,t.pathname.lastIndexOf("/")),n=t.protocol+"//"+t.host+"/"+e+"/"+DEFAULT_IFRAME_URI,o=document.location.origin,a=_getAccountId(),i=_getValidationUrl(),s=_getValidate(),r=_getRedirectRequired();return n=n+"?domain="+o,a&&(n=n+"&accountId="+a),i&&(n=n+"&validationUrl="+i),null!=s&&(n=n+"&validate="+s),null!=r&&(n=n+"&redirectRequired="+r),n}function _getUrl(){var t=document.createElement("a");return t.href=_getScriptURL(),t.protocol+"//"+t.host}function postSSOMessage(t,e){var n=document.getElementById("ssls.sso.iframe").contentWindow;window.attachEvent?n.postMessage(JSON.stringify(t),"*"):n.postMessage(t,_getUrl())}function dispatchEvent(t,e){obs.fireEvent(t,e)}function _listener(event){if(-1!=_getUrl().lastIndexOf(event.origin)){var data=event.data;event.data&&!event.data.action&&(data=eval("("+event.data+")")),data&&"sso.onlogout"==data.action?("function"==typeof onLogout&&onLogout(),dispatchEvent("sso.onlogout")):data&&"sso.onload"==data.action?("function"==typeof onLoad&&onLoad(),dispatchEvent("sso.onload")):data&&"sso.onidentification"==data.action?("function"==typeof onIdentification&&onIdentification(data),dispatchEvent("sso.onidentification",data)):data&&"sso.redirectforaccess"==data.action?("function"==typeof redirectForAccess&&redirectForAccess(data),dispatchEvent("sso.redirectforaccess",data)):data&&"sso.noauthfound"==data.action&&("function"==typeof noAuthFound&&noAuthFound(data),dispatchEvent("sso.noauthfound",data))}}function _init(){_getAccountId();window.addEventListener?addEventListener("message",_listener,!1):attachEvent("onmessage",_listener);var t=_getIframeUrl(),e=document.createElement("iframe");e.style.display="none",e.src=t,e.id="ssls.sso.iframe";var n=document.getElementById("footerWrap");n?n.appendChild(e):document.body.appendChild(e)}function init(t){t&&(config=t)}var DEFAULT_IFRAME_URI=_sso2.default,obs=new Observable,config={};this.listen=function(t,e,n,o){obs.listen(t,e,n,o)},this.logout=function(){postSSOMessage({action:"logout"},_getUrl())},this.login=function(t){postSSOMessage({action:"login",jwt:t},_getUrl())};var _getScriptURL=function(){var t=document.getElementsByTagName("script"),e=t[t.length-1];return function(){return e.src}}();window.addEventListener?window.addEventListener("load",_init,!1):window.attachEvent&&window.attachEvent("onload",_init)}var _sso=__webpack_require__(1),_sso2=_interopRequireDefault(_sso);module.exports=new sslssso},function(t,e,n){t.exports=n.p+"cd7ea539de2cef6e5b983c09360d3a4b.html"}])});