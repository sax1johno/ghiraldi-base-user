/**
 * User.js
 * The core model for a basic User object. The user object provides basic authentication using
 * username and password, using a SHA1 salted hash.
 **/
var passwordUtils = require('../util/passwordUtils'),
    logger = require('ghiraldi-simple-logger'),
    registry = new require('ghiraldi-schema-registry')(),
    _ = require('underscore');
    
var SALT_LENGTH = 30;

var User = {
    username: String,
    password: {type: String},
    salt: String
};

logger.log('trace', 'User in user.js = ' + JSON.stringify(User));

User.methods = {};

User.methods.authenticate = authenticate;

User.validators = {};

// User.validators.validatesPresenceOf = [arg1, args2];

User.methods.beforeSave = function(next, data) {
    if (!_.isUndefined(data.password) && !_.isNull(data.password)) {
        if ('string' !== typeof data.password) {
            data.password = JSON.stringify(data.password);
        }
        data.password = setPassword(data.password);
    };
    next();
};

function setPassword(pPassword) {
    this.salt = passwordUtils.generateSalt(SALT_LENGTH);
    return passwordUtils.hash(pPassword, this.salt);
}

function authenticate(pPassword) {
    return passwordUtils.validate(this.password, pPassword, this.salt);
}

module.exports = {
    'User': User
}
