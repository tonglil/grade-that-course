/*
 *Passport auth information
 */

module.exports = {
  'facebookAuth' : {
    'clientID'      : '500315036745040', // App ID
    'clientSecret'  : '5f9da6dbd3638df1bb7573a6baa44e0d', // App Secret
    'callbackURL'   : 'http://localhost:4000/auth/facebook/callback'
  },
  'twitterAuth' : {
    'consumerKey'     : 'your-consumer-key-here',
    'consumerSecret'  : 'your-client-secret-here',
    'callbackURL'     : 'http://localhost:4000/auth/twitter/callback'
  },
  'googleAuth' : {
    'clientID'        : 'your-secret-clientID-here',
    'clientSecret'    : 'your-client-secret-here',
    'callbackURL'     : 'http://localhost:4000/auth/google/callback'
  }
};
