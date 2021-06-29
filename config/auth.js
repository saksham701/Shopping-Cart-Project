exports.isUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('danger', 'Please Log in to Continue!');
        res.redirect('/users/login');
    }
}


exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin) {
        next();
    }
    else {
        req.flash('danger', 'Please Log as Admin!');
        res.redirect('/users/login');
    }
}
