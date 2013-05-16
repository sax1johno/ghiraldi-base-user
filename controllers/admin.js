var logger = require('ghiraldi-simple-logger'),
    plugins = require('ghiraldi-plugin-registry').registry,
    logger = require('ghiraldi-simple-logger'),
    User = new require('ghiraldi-schema-registry')().getModel('User'),
    ModelControllerFactory = require('ghiraldi-schema-registry').ModelControllerFactory,
    userPlugin = plugins.get('user'),
    util = require('util'),
    _ = require('underscore');

var options = {
    create: {
        redirect: '/admin/user'
    }
}
var UserController = ModelControllerFactory.createModelController(User, options, 'user');

logger.log('trace', 'User Controller = ' + util.inspect(UserController));

// var index = function(req, res){
//     User.all(function(err, users) {
//         logger.log('trace', util.inspect(users));
//         if (err) {
//             logger.log('error', err);
//             res.send(err);
//         } else {
//             logger.log('debug', 'user array is ' + users);
//             userPlugin.render('index', {users: users}, function(err, html) {
//                 logger.log('trace', 'html = ' + html);
//                 if (!err) {
//                     res.send(html);
//                 } else {
//                     res.send('error: ' + err);
//                 }
//             });
//         }
//     });
// };

// var add = function(req, res) {
//     userPlugin.render('add', {}, function(err, html) {
//         if (err) {
//             logger.log('error', err);
//             res.send(err);
//         } else {
//             logger.log('trace', html);
//             res.send(html);            
//         }
//     });
// };

// var show = function(req, res, next){
//     User.find(req.params.id, function(err, user){
//         if (err) return next(err);
//         // res.render('../views/show.jade', {user: user, title: 'User View', selected: 'users'});
//         userPlugin.render('show', {user: user}, function(err, html) {
//             if (!err) {
//                 res.send(html);
//             } else {
//                 res.send(err);
//             }
//         });
//         // res.send(user);
//     });
// };

// var edit = function(req, res, next){
//     get(req.params.id, function(err, user) {
//         if (err) {
//             return res.send(err);
//         }
//         userPlugin.render('edit', {user: user}, function(err, html) {
//             if (!err) {
//                 res.send(html);
//             } else {
//                 res.send(err);
//             }
//         });
//     });
// };

// var update = function(req, res, next){
//     var thisUser = req.body.user;
//     var id = req.params.id;
//     get(id, function(err, user) {
//         if (err) {
//             req.session.messages = {'error': 'Unable to update: ' + err};
//             return next(err);
//         }
//         var thisUser = req.body.user;
//         _.extend(user, thisUser);
//         user.save(function(error) {
//             if (!error) {
//                 req.flash('success', 'Successfully updated user ' + user.username);
//                 res.redirect('back');
//             } else {
//                 req.flash('error', 'Unable to update: ' + error);
//                 res.redirect('back');
//             }
//         });
//     }
//     );
// };

// var create = function(req, res, next) {
//         var thisUser = req.body.user;
//         logger.log("user = " + thisUser);
//         User.create(thisUser, function(err, user) {
//             if (!err) {
//                 req.session.messages = {'success': 'Successfully created new user  ' + thisUser.username};
//             } else {
//                 req.session.messages = {'error': 'Unable to create: ' + err};
//             }
//             res.redirect('/admin/user');
//         });
// }; 

// var destroy =  function(req, res, next) {
//     var id = req.params.id;
//     get(id, function(err, user) {
//         if (err) return next(err);
//         if (user.username == 'admin') {
//             req.session.messages = {'error': 'Unable to delete the root admin user'};
//             return res.redirect('back');
//         }
//         var deleted = user;
//         user.destroy(function(err) {
//             if (!err) {
//                 req.session.messages = {'success': 'Successfully deleted  ' + deleted.username};
//                 res.redirect('back');
//             }
//         });
//     });
// };

module.exports = {
  // /users
  routes: [
    {
        method: UserController.index,
        verb: 'get',
        route: '/admin/user'
    },
    {
        method: UserController.show,
        verb: 'get',
        route: '/admin/user/show/:id.:format?'
    },
    {
        method: UserController.add,
        verb: 'get',
        route: '/admin/user/add'
    },
    {
        method: UserController.create,
        verb: 'post',
        route: '/admin/user'
    },
    {
        method: UserController.edit,
        verb: 'get',
        route: '/admin/user/edit/:id'
    },
    {
        method: UserController.update,
        verb: 'put',
        route: '/admin/user/:id'
    },
    {
        method: UserController.destroy,
        verb: 'del',
        route: '/admin/user/:id'
    }
  ]
};