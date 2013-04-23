var _ = require('underscore');

function restrictToLoggedIn(req, res, next) {
    if (req.session.user !== null && req.session.user !== undefined) {
        next();
    } else {
        // req.flash('error', 'You are not authorized to view this page.');
        res.redirect('/');
    }
};

function restrictToSelf(req, res, next) {
    if (req.session.user !== null && req.session.user !== undefined) {
        if (req.session.user._id.toString() !== req.user._id.toString()) {
            req.flash('error', 'This action is restricted.');
            res.redirect('/');
        }
    } else {
            // req.flash('error', 'You are not logged in');
            res.redirect('/');
    }
}

function redirectIfLoggedIn(req, res, next) {
    if (!_.isNull(req.session.user) && !_.isUndefined(req.session.user)) {
        var mongoose = require('mongoose');
        var Role = mongoose.model('Role');
        Role.findById(req.session.user.role, function(err, myRole) {
            console.log("should redirect now to " + '/' + myRole.title);
            res.redirect('/' + myRole.title);
        });
    }
    else {
        console.log("No need to redirect - not logged in");
        next();
    }
};

module.exports = {
    restrictToSelf: restrictToSelf,
    restrictToLoggedIn: restrictToLoggedIn,
    redirectIfLoggedIn: redirectIfLoggedIn
};

