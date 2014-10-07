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

router.get('/new', function(req, res) {
    "use strict";

    res.render('user-form', {
        title: 'Create user',
        name: "",
        email: "",
        buttonText: "Join!"
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
        if (err) {
            console.log(err);
            if(err.code === 11000) {
                res.redirect('/user/new?exists=true');
            } else {
                res.redirect('/?error=true')
            }
        } else {
            console.log("User created and saved: " + user);
            req.session.user = { "name" : user.name, "email" : user.email, "_id" : user._id };
            req.session.loggedIn = true;
            res.redirect('/user');
        }
    });
});

/**
 * GET user edit form
 */
router.get('/edit', function(req, res) {
    "use strict";

    if ( req.session.loggedIn !== true ) {
        res.redirect('/login');
    } else {
        res.render( 'user-form', {
            title: 'Edit profile',
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email,
            buttonText: "Save"
        });
    }
});

/**
 * POST user edit form
 */
router.post('/edit', function(req, res) {
    "use strict";

    if ( req.session.user._id ) {
        User.findById( req.session.user._id, function( err, user ) {
            /*if ( err ) {
                console.log( err );
                res.redirect('/user?error=finding');
            } else {
                user.name = req.body.FullName;
                user.email = req.body.Email;
                user.modifiedOn = Date.now();
                user.save( function(err) {
                    if ( !err ) {
                        console.log( 'User updated: ' + req.body.FullName );
                        req.session.user.name = req.body.FullName;
                        req.session.user.email = req.body.Email;
                        res.redirect('/user');
                    }
                });
            }*/
            doEditSave(req, res, err, user);
        });
    }
});

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

var onEditSave = function(req, res, err, user) {
    "use strict";

    if ( err ) {
        console.log( err );
        res.redirect('/user?error=saving');
    } else {
        console.log('User updated: ' + req.body.FullName );
        req.session.user.name = req.body.FullName;
        req.session.user.email = req.body.Email;
        res.redirect('/user');
    }
};

router.get('/delete', function(req, res) {
    "use strict";

});

router.post('/delete', function(req, res) {
    "use strict";

});

router.get('/login', function(req, res) {
    "use strict";

    res.render('login-form', {
        title: "Log in"
    });
});

router.post('/login', function(req, res) {
    "use strict";

    if(req.body.Email) {
        User.findOne(
            { 'email' : req.body.Email },
            '_id name email',
            function(err, user) {
                if (!err) {
                    if (!user) {
                        res.redirect('/user/new');
                        /*res.redirect('/login?404=user');*/
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

router.get('/logout', function(req, res) {
    "use strict";

});

module.exports = router;