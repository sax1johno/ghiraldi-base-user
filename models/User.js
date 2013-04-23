/**
 * User.js
 * The core model for a basic User object. The user object provides basic authentication using
 * username and password, using a SHA1 salted hash.
 **/
var mongoose = require('mongoose'),
    Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    passwordUtils = require('../util/passwordUtils'),
    registry = require('mongoose-schema-registry'),
    logger = require('ghiraldi-simple-logger');

var SALT_LENGTH = 30;

// var registry = ModelRegistry;

var User = registry.getSchema('User');

if (User instanceof Schema) {
    logger.log('trace', 'In User, it is a schema.');
} else {
    logger.log('trace', 'In User, it is not a schema');
    logger.log('trace', JSON.stringify(Object.getPrototypeOf(User)));
}

User.add({
    username        : String,
    password        : {type: String, set: setPassword},
    salt            : String
});

logger.log('trace', 'User in user.js = ' + JSON.stringify(User));

User.methods.authenticate = authenticate;

function setPassword(pPassword) {
    this.salt = passwordUtils.generateSalt(SALT_LENGTH);
    return passwordUtils.hash(pPassword, this.salt);
}

function authenticate(pPassword) {
    return passwordUtils.validate(this.password, pPassword, this.salt);
}

registry.add('User', User);

module.exports = {
    'User': User
}
