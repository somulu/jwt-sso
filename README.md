# jwt-sso
Cross Domain Single Sign On with the help of Json Web Tokens (JWT)

#### How it works:
- Cross domain communication
  - The browser cookies, localStorage, sessionStorage can not be shared across domains. To make sure we can communicate across domains, we make use of embedded iframe and window event dipatch and listeners (https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- Working principle
  - The javascript library would be loaded on all subscribing applications
  - The js upon loading will:
    - Embed the iframe in browser
    - Add event dispatch and listeners for cross domain communication
    - Validate the authenticated user (if already logged in)
  - One of the applications shall be a Provider Application which will serve as CAS (central authentication server)
  - Upon successful logging in from CAS, the script will dispatch a login event which will set a token in embedded iframe domain. It should also dispatch a login event for all listeners
  - With the login event, all listeners recieve the token, which then can be sent to server to be verified. Ideally, a request should be sent to the server (listner's server) with token and the server should verify the token with Provider (via an API call) and if verified, can create user's session
  - Upon logout (recieved from any application), the listener should destroy session of the user in their application and call the logout function provided by the embedded js which would delete the token and dispatch a log out event to all listeners. Listeners can then log themselves out individually

#### Implementation:

  - The library has 3 main components (found in 'dist' folder),
    1. Iframe html (The html to be loaded as an iframe)
    2. ssoIframe.js (The javascript to be utilized from the iframe html)
    3. ssojs (bundle.js) (Initializes the sso implementation and communicates to the client. This js mounts the iframe which in turn uses ssoiframe.js)
  - The library makes use of HTML meta tags to verify and map each subscribe individually. The meta tags are,
    - `<meta name="ssls.accountId" content="59975rt56-678b-433jhdg" />`
      - Identifies the account. Value should be constant across all listeners.
    - `<meta name="ssls.validate" content="true" />`
      - Defines whether the javascript should validate the provided token. Must be set true for Provider. Can be set to false for consumers to avoid frequent validation request on every page load.
    - `<meta name="ssls.validationUrl" content="yourdomain.com/validate" />`
      - Works only if the `ssls.validate` meta content is set to "true". When provided, calls the given url with jwt token as a parameter for verification.
  - The library also calls specific functions on listeners (if defined) after recieving some events, we can make use of such functions on listener end to achieve callbacks required from listener window, the functions are,
    - `onLoad` : Called after the SSO JS is loaded and events listners are assigned
    - `onIdentification`: Called after logging in from Provider or after validation completes for already logged in session
    - `onLogout`: Called after `sslssso.logout` function is called and existing token is removed from browser

  - **Steps to implement** (Common for consumer and provider applications unless specified otherwise):
    - Provide meta tags (listed above)
    - Load the javascript on client (browser). It will expose `sslssso` object containing following login and logout functions,
      - `sslssso.login("your jwt token")`
      - `sslssso.logout()`
    - Create an endpoint for the validation url on the server (must for Provider, optional for Consumer),
      - Eg: `yourdomain.com/validate` (The sso js makes an ajax (xhr) request. The endpoint should be able to serve xhr requests with json data)
      - Expected response parameters upon sucessful authentication: `{
        'status' => 'SUCCESS',
        'sub' => 'your user id',
        'eidentifier' => 'your user email'
      }`
    - **FOR PROVIDER**
      - Logging in with credentials:
        - Authenticate with user credentials and get the (JWT) token
        - Upon successful authentication, call the `sslssso.login` function and provide recieved jwt token as a parameter,
          - Example with jQuery:
            ```javascript
              $('#login-form').submit(function(event) {
                params = {
                  email: $('#email').val(),
                  password: $('#password').val()
                };
                $.post(
                    "yourdomain.com/validate",
                    params,
                    function(data) {
                      // Store JWT in browser SSO
                      sslssso.login(data.auth_token);
                    }
                );
                event.preventDefault();
              });
            ```
        - Optional but recommended (required only when consumers will verify the recieved token from server side): Provide a REST API endpoint for the consumers to verify the token
    - **FOR CONSUMER**
      - Create an `onIdentification()` function which will recieve the token and validate it on the server side
      - Create an API endpoint to be called from `onIdentification()` which will sign the user in after succesful identification/verification
      - The API endpoint can verify the token from Provider end and sign user in accordingly (recommended)
      - Once signed in, note that after each page load, onIdentification() function will be called. If API endpoint validation is obtained, you can always store a cookie/storage variable on the browser whcih will be checked in the onIdentification() function. If set, the validation call wont be made. And on log out, it can be removed.
      - `onIdentification` example with jQuery:
        ```javascript
          // Fired after validating JWT on page onLoad process, or after a successful identification
          function onIdentification(operation){
            // Validate token from subscriber's server
            if (!getItem('ssoLocalSession')) {
              var validator = '/yourvalidationurl',
                params = { jwt: operation.jwt },
                contentType = "application/json; charset=utf-8";
              $.ajax({
                type: "POST", //GET or POST or PUT or DELETE verb
                url: validator, // Location of the service
                data: params //Data sent to server
                // contentType: contentType
              }).done(function (response) {
                if (response.status == 'SUCCESS') {
                  setItem('ssoLocalSession', true); // Set local identifier for session to prevent validate calls on each reload
                  window.location.href = response.link.href;
                }
              }).fail(function (err)  {
                reject(err);
              });
            }
          }
        ```
    - Logout flow:
      - The `logout()` request can be initiated from any subscribing application
      - To log out, log the current session out from application and call `sslssso.logout()` which will send the logout event to all listeners
      - On all listeners, The `onLogout()` function will be called (if defined) and in that function, a logout call to respective applications can be made to clear the session
        - Example:
          ```javascript
            Example:
            //Fired onLogout
            function onLogout() {
              removeItem('ssoLocalSession');
              // logout code goes here;
            }
          ```
