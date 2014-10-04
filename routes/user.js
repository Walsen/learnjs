var express = require( 'express');
var mongoose = require( 'mongoose' );

var router = express.Router();
var User = mongoose.model( 'User' );

router.get( '/', function(req, res) {
    "use strict";
    res.send("Welcome to the user page.");
});

router.get('/new', function(req, res) {
    "use strict";
    res.render('user-form', {
        title: "Create user",
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

router.get('/edit', function(req, res) {
    "use strict";

});

router.post('/edit', function(req, res) {
    "use strict";

});

router.get('/delete', function(req, res) {
    "use strict";

});

router.post('/delete', function(req, res) {
    "use strict";

});

router.get('/login', function(req, res) {
    "use strict";

});

router.post('/login', function(req, res) {
    "use strict";

});

router.get('/logout', function(req, res) {
    "use strict";

});

module.exports = router;