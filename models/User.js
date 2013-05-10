/**
 * User.js
 * The core model for a basic User object. The user object provides basic authentication using
 * username and password, using a SHA1 salted hash.
 **/
var    logger = require('ghiraldi-simple-logger'),
    registry = new require('ghiraldi-schema-registry')(),
    _ = require('underscore');
    
var User = {
    username: String,
    email: String
};

module.exports = {
    'User': User
}
