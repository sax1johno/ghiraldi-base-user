var logger = require('ghiraldi-simple-logger'),
    plugins = require('ghiraldi-plugin-registry').registry,
    logger = require('ghiraldi-simple-logger'),
    User = new require('ghiraldi-schema-registry')().getModel('User'),
    _ = require('underscore');

function get(id, fn) {
    User.findById(id, fn);
}

var index = function(req, res){
    res.send('/admin/user');
    // User.find({}).exec(function(err, users) {
    //     if (err) {
    //         logger.log('error', err);
    //         res.send(err);
    //     } else {
    //         logger.log('debug', 'test array is ' + JSON.stringify(users));
    //         res.render(plugins.get('user').views['index'], {users: users, title: 'Users'});
    //         // res.render('../views/index.jade', {users: users, title: 'Users', selected: 'users'});
    //         // res.render(plugins.get('admin').views., {users: users, title: 'Users', selected: 'users'});
    //         // res.send(users);
    //     }
    // });
    // res.render(plugins.get('admin').views['index'], {});
};

var add = function(req, res) {
    // res.render('../views/add.jade', {title: 'Add a User', selected: 'users'});
    res.send({'message': 'Add page admin for users. This should be overridden'});
};

var show = function(req, res, next){
    get(req.params.id, function(err, user){
        if (err) return next(err);
        // res.render('../views/show.jade', {user: user, title: 'User View', selected: 'users'});
        res.send(user);
    });
};

var edit = function(req, res, next){
    get(req.params.id, function(err, user) {
        if (err) return next(err);
        // res.render('../views/edit.jade', {user: user, title: 'Edit User', selected: 'users'});
        res.send({'message': 'Edit page for a user.  This should be overridden.'});
    });
};

var update = function(req, res, next){
    var thisUser = req.body.user;
    var id = req.params.id;
    get(id, function(err, user) {
        if (err) {
            req.session.messages = {'error': 'Unable to update: ' + err};
            return next(err);
        }
        var thisUser = req.body.user;
        _.extend(user, thisUser);
        user.save(function(error) {
            if (!error) {
                res.send({'success': 'Successfully updated user  ' + user.username});
            } else {
                res.send({'error': 'Unable to update: ' + error});
            }
        });
    }
    );
};

var create = function(req, res, next) {
        var thisUser = req.body.user;
        var addedUser = new User();
        _.extend(addedUser, thisUser);
        addedUser.save(function(error) {
            if (!error) {
                req.session.messages = {'success': 'Successfully created new user  ' + addedUser.username};
            } else {
                req.session.messages = {'error': 'Unable to create: ' + error};
            }
        res.redirect('/users');
        });
}; 

var destroy =  function(req, res, next) {
    var id = req.params.id;
    get(id, function(err, user) {
        if (err) return next(err);
        if (user.username == 'admin') {
            req.session.messages = {'error': 'Unable to delete the root admin user'};
            return res.redirect('back');
        }
        var deleted = user;
        user.remove(function(err) {
            if (!err) {
                req.session.messages = {'success': 'Successfully deleted  ' + deleted.username};
                res.redirect('back');
            }
        });
    });
};

module.exports = {
  // /users
  routes: [
    {
        method: index,
        verb: 'get',
        route: '/admin/user'
    },
    {
        method: show,
        verb: 'get',
        route: '/admin/user/show/:id.:format?'
    },
    {
        method: add,
        verb: 'get',
        route: '/admin/user/add'
    },
    {
        method: create,
        verb: 'post',
        route: '/admin/user/create'
    },
    {
        method: edit,
        verb: 'get',
        route: '/admin/user/edit/:id'
    },
    {
        method: update,
        verb: 'put',
        route: '/admin/user/:id'
    },
    {
        method: destroy,
        verb: 'del',
        route: '/admin/user/:id'
    }
  ]
};