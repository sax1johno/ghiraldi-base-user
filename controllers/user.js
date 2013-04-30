var _ = require('underscore'),
    logger = require('ghiraldi-simple-logger'),
    plugins = require('ghiraldi-plugin-registry').registry,
    models = new require('ghiraldi-schema-registry')(),
    User = models.getModel('User'),
    Role = models.getModel('Role');

var index = function(req, res){
    res.send("in the index function of user");
};

var login = function(req, res) {
    res.render(plugins.get('user').views.login, {});
};

/**
 * Uses username and password authentication with user info 
 * stored in mongoose to authenticate the user and add
 * the user to the session if successful.
 **/
var processLogin = function(req, res) {
    var loginInfo = req.body.loginInfo;
    User.findOne({username: loginInfo.username}, function(err, doc) {
        if (err) {
            req.flash('error', 'Unable to authenticate: username or password is invalid');
            res.redirect('back');
        } else {
            if (!doc) {
                req.flash('error', 'Unable to authenticate: username or password is invalid');
                res.redirect('back');
            } else {
                if (loginInfo.password) {
                    if (doc.authenticate(loginInfo.password)) {
                        req.session.user = doc;
                        req.flash('success', 'You are now logged in as ' + doc.username);
                        Role.findById(doc.role, function(err, role) {
                            req.session.role = role;
                            res.redirect('/');
                        });
                    } else {
                        req.flash('error', 'Unable to authenticate: username or password is invalid');
                        res.redirect('back');
                    }
                }
            }
        }
    });    
};

var logout = function(req, res) {
    delete req.session.user;
    delete req.session.role;
    req.flash('info', 'You have been logged out.');
    res.redirect('/');
};

var signup = function(req, res) {
    res.render(plugins.get('user').views.signup, {});
};

var signup_process = function(req, res) {
    // TODO: Add stub signup code.
    req.flash('error', 'Signup has not been implemented yet.');
    res.redirect('back');
};

module.exports = {
    routes: [
        { 
            verb: 'get',
            route: '/login',
            method: index
        },
        { 
            verb: 'post',
            route: '/login/process',
            method: processLogin
        },
        {
            verb: 'get',
            route: '/logout',
            method: logout
        },
        {
            verb: 'get',
            route: '/signup',
            method: signup
        },
        {
            verb: 'post',
            route: '/signup/process',
            method: signup_process
        }
    ]
};

module.exports = {
  // /users
  routes: [
    {
        method: index,
        verb: 'get',
        route: '/user'
    },
    // {
    //     method: show,
    //     verb: 'get',
    //     route: '/user/show/:id.:format?'
    // },
    // {
    //     method: add,
    //     verb: 'get',
    //     route: '/user/add'
    // },
    // {
    //     method: create,
    //     verb: 'post',
    //     route: '/user/create'
    // },
    // {
    //     method: edit,
    //     verb: 'get',
    //     route: '/user/edit/:id'
    // },
    // {
    //     method: update,
    //     verb: 'put',
    //     route: '/user/:id'
    // },
    // {
    //     method: destroy,
    //     verb: 'del',
    //     route: '/user/:id'
    // }
  ]
};