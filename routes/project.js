/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var express = require( 'express' );
var mongoose = require( 'mongoose' );

var router = express.Router();
var Project = mongoose.model( 'Project' );

router.get( '/', function(req, res) {
    "use strict";

    res.send("Welcome to the project page.");
});

router.get( '/new', function(req, res) {
    "use strict";

    res.render('project-form', {
        title: "Create New Project",
        buttonText: "Create!"
    });
});

router.post( '/new', function(req, res) {
    "use strict";

});

router.get( '/:id', function(req, res) {
    "use strict";

});

router.get( '/edit/:id', function(req, res) {
    "use strict";

});

router.post( '/edit/:id', function(req, res) {
    "use strict";

});

router.get( '/delete/:id', function(req, res) {
    "use strict";

});

router.post( '/delete/:id', function(req, res) {
    "use strict";

});

/**
 * GET Projects by UserID.
 */
router.get( '/byuser/:userid', function(req, res) {
    "use strict";

    console.log("Getting user projects");
    if ( req.params.userid) {
        Project.findByUserID(
            req.params.userid,
            function(err, projects) {
                if ( !err ) {
                    console.log(projects);
                    res.json(projects);
                } else {
                    console.log(err);
                    res.json({"status" : "error", "error" : "Error finding projects"});
                }
            });
    } else {
        console.log("No user id supplied");
        res.json({"status" : "error", "error" : "No user id supplied"});
    }
});

module.exports = router;