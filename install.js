console.log("Just testing the installation");

/**
 * This is the install file for your new express-powered Ghiraldi app.
 * If you have tasks that need to be completed prior to running the Ghiraldi framework (such as creating initial
 * user types or admin users), you can do so using this install script.
 * 
 **/
 
/** INSTALL TASKS GO HERE **/
var mongoose = require('mongoose'),
    pluginRegistry = require('ghiraldi-plugin-registry').registry,
    _ = require('underscore'),
    logger = require('ghiraldi-simple-logger');

exports.install = function() {
    var passwordUtils = require(pluginRegistry.get('user').getModule('/util/passwordUtils'));
    var User = mongoose.model('User');
    var Role = mongoose.model('Role');
    var adminRole = function(errorFn, completeFn) {
        logger.log('debug', 'In the admin role installation process');
        Role.findOne({title: 'admin'}).exec(function(err, role) {
            if (err) {
                errorFn(err);
            } else {
                if (!_.isUndefined(role) && !_.isNull(role)) {
                    completeFn();
                } else {
                    // Admin role does not exist. Create it.
                    var adminRole = new Role();
                    adminRole.title = 'admin';
                    adminRole.save(function(err, role) {
                        if (err) {
                            errorFn(err);
                        } else {
                            completeFn();
                        }
                    });
                }
            }
        });
    };
    
    var userRole = function(errorFn, completeFn) {
        Role.findOne({title: 'user'}).exec(function(err, role) {
            if (err) {
                errorFn(err);
            } else {
                if (!_.isUndefined(role) && !_.isNull(role)) {
                    completeFn();
                } else {
                    // Admin role does not exist. Create it.
                    var userRole = new Role();
                    userRole.title = 'user';
                    userRole.save(function(err, role) {
                        if (err) {
                            errorFn(err);
                        } else {
                            completeFn();
                        }
                    });
                }
            }
        });
    };
    
    var adminUser = function(errorFn, completeFn) {
        Role.findOne({title: 'admin'}).exec(function(err, role) {
            User.findOne({username: 'admin'}).exec(function(err, user) {
                if (err) {
                    errorFn(err);
                } else {
                    if (!_.isUndefined(user) && !_.isNull(user)) {
                        console.log("Admin user already defined.  Would you like to reset this user (type 'yes' or 'no')?");
                        var stdin = process.openStdin();
                        stdin.on('data', function(chunk) { 
                            var answer = "" + chunk;
                            if (answer.match(/^y/i)) {
                                var newPassword = passwordUtils.generateSalt(12);
                                user.password = newPassword;
                                user.save(function(err, u) {
                                    if (err) {
                                        completeFn(err);
                                    } else {
                                        console.log("Created a new password for admin user:");
                                        console.log("Username: " + u.username);
                                        console.log("Password: " + newPassword);
                                        console.log("NOTE: Please record this password as it is non-recoverable.  If you forget your admin password, you'll need to re-run this install script.");  
                                        completeFn(null, u);
                                    }
                                });
                            } else {
                                console.log("Ok - skipping creating an admin user");
                                completeFn();
                            }
                        });
                    } else {
                        createNewUser('admin', role, function(err, user) {
                            if (err) {
                                errorFn(err);
                            } else {
                                completeFn();
                            }
                        });
                    }
                }
            });                
        });
    };
    
    var createNewUser = function(username, role, completeFn) {
        // Admin role does not exist. Create it.
        var u = new User();
        u.username = username;
        u.role = role._id;
        // Generate a new password that's 12 characters long.
        var newPassword = passwordUtils.generateSalt(12);
        u.password = newPassword;
        u.save(function(err, u) {
            if (err) {
                completeFn(err);
            } else {
                console.log("Created a new user:");
                console.log("Username: " + u.username);
                console.log("Password: " + newPassword);
                console.log("NOTE: Please record this password as it is non-recoverable.  If you forget your admin password, you'll need to re-run this install script.");  
                completeFn(null, u);
            }
        });
    }
    console.log("Ready to run install script");
    adminRole(function(err) {
        console.log("An error occurred creating the admin role during installation: " + err);
        }, function() {
            console.log("Created the admin role");
            userRole(function(err) {
                console.log("An error occurred creating the user role during installation: " + err);
            }, function() {
                console.log("Created the user role");
                adminUser(function(err) {
                    console.log("An error occurred while creating the admin user during installation: " + err);
                }, function() {
                    console.log("Installation complete.");
                    process.exit();
                }); 
            });
        });
};
