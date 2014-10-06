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

    if ( req.session.loggedIn === true ) {
        res.render('project-form', {
            title: "Create New Project",
            userid: req.session.user._id,
            userName: req.session.user.name,
            buttonText: "Make it so!"
        });
    } else {
        res.redirect('/login');
    }
});

router.post( '/new', function(req, res) {
    "use strict";

    Project.create({
        projectName: req.body.projectName,
        createdBy: req.body.userid,
        createdOn: Date.now(),
        tasks: req.body.tasks
    }, function(err, project) {
       if ( err ) {
           console.log( err );
           res.redirect('/?error=project')
       } else {
           console.log("Project created and saved: " + project);
           console.log("project._id = " + project._id);
           res.redirect('/project/' + project._id);
       }
    });
});

/**
 * GET project info
 */
router.get( '/:id', function(req, res) {
    "use strict";

    console.log('Finding project _id: ' + req.params.id);
    if ( req.session.loggedIn !== true ) {
        res.redirect('/login');
    } else {
        if ( req.params.id ) {
            Project.findById( req.params.id, function(err, project) {
                if ( err ) {
                    console.log(err);
                    res.redirect('/user?404=project');
                } else {
                    console.log(project);
                    res.render('project-page', {
                        title: project.projectName,
                        projectName: project.projectName,
                        tasks: project.tasks,
                        createdBy: project.createdBy,
                        projectID: req.params.id
                    });
                }
            });
        } else {
            res.redirect('/user');
        }
    }
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
    if ( req.params.userid ) {
        Project.findByUserID (req.params.userid, function(err, projects) {
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