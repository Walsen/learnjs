var express = require( 'express');
var mongoose = require( 'mongoose' );

var router = express.Router();
var User = mongoose.model( 'User' );

router.get( '/', function(req, res) {
    "use strict";

    if(req.session.loggedIn === true ) {
        res.render( 'user-page', {
           title: req.session.user.name,
            name: req.session.user.name,
            email: req.session.user.email,
            userID: req.session.user._id
        });
    } else {
        res.redirect('/login');
    }
});

/**
 * GET user creation form.
 */
router.get('/new', function(req, res) {
    "use strict";

    var strName = '',
        strEmail = '',
        arrErrors = [];

    if ( req.session.tmpUser ) {
        strName = req.session.tmpUser.name;
        strEmail = req.session.tmpUser.email;
    }

    if ( req.query ) {
        if ( req.query.name === 'invalid' ) {
            arrErrors.push('Please enter a valid name, minimum 5 characters');
        }

        if ( req.query.email === 'invalid' ) {
            arrErrors.push('Please enter a valid email address');
        }
    }
    res.render('user-form', {
        title: 'Create user',
        id: "",
        name: strName,
        email: strEmail,
        buttonText: "Join!",
        errors: arrErrors
    });
});

router.post('/new', function(req, res) {
    "use strict";

    User.create({
        name: req.body.FullName,
        email: req.body.Email,
        modifiedOn: Date.now(),
        lastLogin: Date.now()
    }, function(err, user) {
        var qstring = '';
        if (err) {
            console.log(err);
            if(err.code === 11000) {
                qstring = 'exists=true';
            } else if (err.name === "ValidationError") {
                for ( var input in err.errors ) {
                    qstring += input + '=invalid&';
                    console.log(err.errors[input].message);
                }
            } else {
                res.redirect('/?error=true')
            }
            req.session.tmpUser = { "name": req.body.FullName, "email": req.body.Email};
            res.redirect('/user/new?' + qstring);
        } else {
            console.log("User created and saved: " + user);
            req.session.user = { "name" : user.name, "email" : user.email, "_id" : user._id };
            req.session.loggedIn = true;
            res.redirect('/user');
        }
    });
});

router.get('/edit', function(req, res) {
    "use strict";

    if ( req.session.loggedIn ) {
        var strName = '',
            strEmail = '',
            arrErrors = [];

        if (req.session.tmpUser) {
            strName = req.session.tmpUser.name;
            strEmail = req.session.tmpUser.email;
            req.session.tmpUser = '';
        } else {
            strName = req.session.user.name;
            strEmail = req.session.user.email;
        }

        if (req.query) {
            if (req.query.name === 'invalid') {
                arrErrors.push('Please enter a valid name, minimum 5 characters');
            }

            if (req.query.email === 'invalid') {
                arrErrors.push('Please enter a valid email address');
            }
        }
        res.render('user-form', {
            title: 'Edit profile',
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email,
            buttonText: "Save",
            errors: arrErrors
        });
    } else {
            res.redirect('/login');
    }
});

/**
 * GET user edit form
 */

/**
 * POST user edit form
 */
router.post('/edit', function(req, res) {
    "use strict";

    if ( req.session.user._id ) {
        User.findById( req.session.user._id, function( err, user ) {
            doEditSave(req, res, err, user);
        });
    }
});

/**
 * GET yser delete confirmation form
 */
router.get('/delete', function(req, res) {
    "use strict";

    res.render('user-delete-form', {
        title: 'Delete account',
        _id: req.session.user._id,
        name: req.session.user.name,
        email: req.session.user.email
    });
});

/**
 * POST user delete form.
 */
router.post('/delete', function(req, res) {
    "use strict";

    if ( req.body._id ) {
        User.findByIdAndRemove( req.body._id, function(err, user) {
            if ( err ) {
                console.log( err );
            } else {
                console.log("User deleted: ", user);
                clearSession( req, res, function() {
                    res.redirect('/');
                });
            }
        });
    }
});

/**
 * GET Login page.
 */
router.get('/login', function(req, res) {
    "use strict";

    res.render('login-form', {
        title: "Log in"
    });
});

/**
 * POST log in a user.
 */
router.post('/login', function(req, res) {
    "use strict";

    if(req.body.Email) {
        User.findOne(
            { 'email' : req.body.Email },
            '_id name email',
            function(err, user) {
                if (!err) {
                    if (!user) {
                        res.redirect('/login?404=user');
                    } else {
                        req.session.user = {
                            "name" : user.name,
                            "email" : user.email,
                            "_id" : user._id
                        };
                        req.session.loggedIn = true;
                        console.log('Logged in user: ' + user );
                        User.update(
                            { _id : user._id },
                            { $set: { lastLogin: Date.now() } },
                            function() {
                              res.redirect('/user');
                            }
                        );
                    }
                } else {
                    res.redirect('/login?404=error');
                }
            });
    } else {
        res.redirect('/login?404=error');
    }
});

/**
 * GET Logs out the user.
 */
router.get('/logout', function(req, res) {
    "use strict";

    clearSession( req, res, function() {
        res.redirect('/');
    });
});

/****************** Non route methods *********************/

/**
 *
 * @param req
 * @param res
 * @param err
 * @param user
 */

var doEditSave = function(req, res, err, user) {
    "use strict";

    if ( err ) {
        console.log( err );
        res.redirect('/user?error=finding');
    } else {
        user.name = req.body.FullName;
        user.email = req.body.Email;
        user.modifiedOn = Date.now();
        user.save(
            function (err, user) {
                onEditSave(req, res, err, user);
            }
        );
    }
};

/**
 *
 * @param req
 * @param res
 * @param err
 * @param user
 */
var onEditSave = function(req, res, err, user) {
    "use strict";

    var qstring = '';

    if ( err ) {
        console.log( err );
        if ( err.name === "ValidationError" ) {
            for ( var input in err.errors ) {
                qstring += input + '=invalid%';
                console.log(err.errors[input].message);
            }
        } else {
            res.redirect('/?error=true');
        }
        req.session.tmpUser = { "name": req.body.FullName, "email": req.body.Email };
        res.redirect('/user/edit?' + qstring);
    } else {
        console.log('User updated: ' + req.body.FullName );
        req.session.user.name = req.body.FullName;
        req.session.user.email = req.body.Email;
        res.redirect('/user');
    }
};

/**
 *
 * @param req
 * @param res
 * @param callback
 */
var clearSession = function (req, res, callback) {
    req.session.user = {};
    req.session.loggedIn = "";
    callback();
};

module.exports = router;