/*
 *Passport auth information
 */

module.exports = {
  'facebookAuth' : {
    'clientID'      : '500315036745040', // App ID
    'clientSecret'  : '5f9da6dbd3638df1bb7573a6baa44e0d', // App Secret
    'callbackURL'   : 'http://localhost:4000/auth/facebook/callback'
  },
  /*
   *'twitterAuth' : {
   *  'consumerKey'     : 'wd9HNtLc9rVjcWfKVwOaw', // API Key
   *  'consumerSecret'  : 'S4A8PaaMwum4vtRyidgJyfTOUjrHIzvAvVUUgvG5c', // API Secret
   *  'callbackURL'     : 'http://127.0.0.1:4000/auth/twitter/callback'
   *},
   */
  'googleAuth' : {
    'clientID'        : '863839027492-8jnml5igp7kdou76m232c9c9ljjommop.apps.googleusercontent.com',
    'clientSecret'    : 'bwCzpq8DF_9exZmMbqAMILLi',
    'callbackURL'     : 'http://localhost:4000/auth/google/callback'
  }
};
