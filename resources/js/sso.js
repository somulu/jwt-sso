import { getOrigin, getGetParam, JWT, getCookieByName, setPersistentCookie, deleteCookieByName, isSafariBrowser } from './sso_common.js'
import { RestClient } from './sso_rest.js'

var validationUrl;
var validate;
var accountId;
var tokenId;
var apiKey;
var domain;
var redirectRequired;
var safariCookie = '__c2FmYXJpVmVyaWZpY2F0aW9uVG9rZW4';

// Public functions
function onIdentification(operation){
  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";

  postMessageToListeners (operation,domain);
}

// Private functions
function onLogout(){

  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";
  var operation = {action:"sso.onlogout"};

  postMessageToListeners (operation,domain);
}

function onLoad(){
  //var domain = getGetParam2("domain");
  //if (!domain || domain=="")
  domain = "*";
  var operation = {action:"sso.onload"};

  postMessageToListeners (operation,domain);
}

function noAuthFound(){
  domain = "*";
  var operation = {action: "sso.noauthfound"};
  postMessageToListeners (operation,domain);
}

function redirectForToken() {
  domain = "*";
  var operation = {action: "sso.redirectforaccess"};
  postMessageToListeners (operation,domain);
}

function postMessageToListeners (operation, domain){
  if (window.attachEvent) {   // IE before version 9
    window.parent.postMessage(JSON.stringify(operation), domain);
  } else {
    window.parent.postMessage(operation, domain);
  }
}



function doLogout(){
  localStorage.removeItem(tokenId);
  if(isSafariBrowser()) {
    deleteCookieByName(safariCookie);
  }
  onLogout();
}

function doLogin(jwt){
  localStorage.setItem(tokenId,jwt);
  if(isSafariBrowser()) {
    setPersistentCookie(safariCookie, jwt);
  }
  /*if (isIE()){
    //Mas mierda de IE. En el caso de IE11 no sincroniza entre pesta�as si no haces esta guarrer�a. Y tampoco va
    localStorage.setItem('dummy', 'dummyvalue');
    localStorage.removeItem('dummy');
  } */
}

function localStorageHandler(e) {
  var jwtsso = localStorage.getItem(tokenId);
  if (jwtsso){
    validateJWT(jwtsso);
  } else {
    onLogout();
  }
}
function localStorageHandlerIE8(e) {
  // var jwtsso = localStorage.getItem(tokenId); ->  old value in IE
  // timeout waiting IE8 browser to update the new value
  setTimeout(function(){
      var jwtsso = localStorage.getItem(tokenId); // new value
      if (jwtsso){
      validateJWT (jwtsso);
    } else {
      onLogout();
    }
   }, 1); // delay
}


function listener(event){
  //if ( event.origin !== "https://pfb.sslsignature.com" ){
  //  return;
  //}
  var data = event.data; //Chrome, firefox, IE11 , etc
  // if (event.data && !event.data.action){ //<=IE8 & IE9 porque no soporta JSON en objetos de mensaje
  //   data  =  eval('(' + event.data+ ')');
  // }


  if(data.hasOwnProperty('action')) {
    var action = data.action;
    if (action == 'logout'){
      doLogout();
    } else if (action == 'login'){
      if (data.hasOwnProperty('jwt')){
        doLogin(data.jwt);
      }
    }
  }

}


function validateJWT(jwtsso){
  if (validate && validationUrl){
    //Invoke server to get remote validation of token signature, parse and return extra data if necessary
    validateJWTRemote(jwtsso);
  } else {
    // Do not validate. Expected token validation on first usage of jwt
    parseJWTLocal(jwtsso);
  }

}

function validateJWTRemote(jwtsso){
  var jwt = new JWT(jwtsso);
  var rest = new RestClient(validationUrl,accountId,apiKey);

  /*
   POST validationUrl
   jwt={jwtsso}

   Expected JSON response {status:SUCCESS,sub:yourUserId, jwt:newTokenIfNeeded, eidentifier:username, name:fullname, email:useremail, ... }
   or {AuthenticationOperation: {status:SUCCESS,sub:...} }
   */
  rest.validateJWT(jwtsso,
     function (obj){
      var operation = obj;
      if (obj.AuthenticationOperation){
        operation = obj.AuthenticationOperation;
      }
      if (operation.status == 'SUCCESS') {
        if (operation.jwt && operation.jwt != jwtsso){
          doLogin(operation.jwt);
        } else  {
          operation.jwt = jwtsso;
        }

        operation.action = "sso.onidentification";

        //Identification successful. Fire onIdentification event
        onIdentification(operation);

      } else {
        doLogout();
      }
      //Authentication process finish. //fire onload event
      onLoad();
    });
    // ,
    // function(err) {
    //   console.log(LogLevels.DEBUG,err);
    // });

}

function parseJWTLocal(jwtsso){
  try{
    var jwt = new JWT(jwtsso);
    var payload = jwt.payload();
    if (jwt.isExpired())
      throw ("JWT expired");

    //We have not validated. So UNKNOWN
    payload.status = 'UNKNOWN';
    payload.action = "sso.onidentification";
    payload.jwt = jwtsso;

    //Identification finished. Fire onIdentification event
    onIdentification(payload);

  } catch (err){
    //Bad token. remove it
    doLogout();
  }
  //Authentication process finish. //fire onload event
  onLoad();
}

function ready(){
  // Do nothing if redirect required meta is set. Subscriber app will user parameter hash to log the user in.
  // if(redirectRequired) {
  //   redirectForToken();
  //   return;
  // }
  // Explicit cookie implementation for safari because localStorage is not accessible from remote iFrame but cookies are
  if (isSafariBrowser()) {
    var jwtsso = getCookieByName(safariCookie);
  } else {
    // Try to fetch the localStorage
    // If third party cookies are disabled, this would raise an error
    // Catch the error, emit a redirect event and do nothing (assuming application is handling the redirect part)
    try {
      var jwtsso = localStorage.getItem(tokenId);
    } catch (err) {
      redirectForToken();
      return;
    }
  }
  if (jwtsso){
    validateJWT (jwtsso);
  } else {
    noAuthFound()
    //OnLoad must be the last method invocation. Invoked head or from validateJWT after token validation
    onLoad();
  }
}

function init(){
  accountId = getGetParam("accountId");
  domain = getGetParam("domain");
  validationUrl = getGetParam("validationUrl");
  validate = !(getGetParam("validate") == 'false');
  redirectRequired = (getGetParam("redirectRequired") == 'true');
  if (validate && !validationUrl)
    validationUrl = getOrigin() + '/validate';

  var config = {
    validationUrl: validationUrl,
    accountId: accountId,
    apiKey: '',
    domain: domain,
    tokenId: 'ssls.sso.jwt.' + accountId,
    validate: validate,
    redirectRequired: redirectRequired
  }
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
  if (window.addEventListener){
    addEventListener("message", listener, false);
  } else {
    attachEvent("onmessage", listener);
  }

  //onLoad document listener
  if (window.addEventListener) {
    // W3C standard
    window.addEventListener('load', ready, false); // NB **not** 'onload'
  } else if (window.attachEvent){
     // Microsoft
    window.attachEvent('onload', ready);
  }

  validationUrl = config.validationUrl;
  validate = config.validate;
  accountId = config.accountId;
  tokenId = config.tokenId;
  apiKey = config.apiKey;
}

module.exports = {
  init: init,
  onIdentification: onIdentification
};
