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

/**
 * GET project creating form.
 */
router.get( '/new', function(req, res) {
    "use strict";

    var strProjectName = '',
        strTasks = '',
        arrErrors = [];

    if ( req.session.loggedIn === true ) {

        if ( req.session.tmpProject ) {
            strProjectName = req.session.tmpProject.projectName;
            strTasks = req.session.tmpProject.tasks;
            req.session.tmpProject = '';
        }

        if ( res.query ) {
            if ( req.query.projectName === 'invalid' ) {
                arrErrors.push('Please enter a valid project name, minimum 5 characters');
            }
        }

        res.render('project-form', {
            title: "Create New Project",
            userid: req.session.user._id,
            userName: req.session.user.name,
            projectID: '',
            projectName: strProjectName,
            tasks: strTasks,
            buttonText: "Make it so!",
            errors: arrErrors
        });
    } else {
        res.redirect('/login');
    }
});

/**
 * POST project creating form
 */
router.post( '/new', function(req, res) {
    "use strict";

    Project.create({
        projectName: req.body.projectName,
        createdBy: req.body.userid,
        createdOn: Date.now(),
        tasks: req.body.tasks
    }, function(err, project) {
        var qstring = '?';
       if ( err ) {
           console.log( err );
           if ( err.name === "ValidationError" ) {
               for ( var input in err.errors ) {
                   qstring += input + '=invalid&';
                   console.log(err.errors[input].message);
               }
           } else {
               res.redirect('/?error=true')
           }
           req.session.tmpProject = {
               "projectName": req.body.projectName,
               "tasks": req.body.tasks
           };
           res.redirect('/project/new' + qstring);
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

/**
 * GET project edit form
 */
router.get( '/edit/:id', function(req, res) {
    "use strict";

    var strProjectName = '',
        strTasks = '',
        arrErrors = [];

    if ( req.session.loggedIn !== true ) {
        res.redirect('/login');
    } else {
        if ( req.params.id ) {
            Project.findById( req.params.id, function( err, project ) {
                if ( err ) {
                    console.log(err);
                    res.redirect('/user?err=project404');
                } else {
                    if ( req.session.tmpProject ) {
                        strProjectName = req.session.tmpProject.projectName;
                        strTasks = req.session.tmpProject.tasks;
                        req.session.tmpProject = '';
                    } else {
                        strProjectName = project.projectName;
                        strTasks = project.tasks;
                    }

                    if ( req.query ) {
                        if ( req.query.projectName === 'invalid' ) {
                            arrErrors.push('Please enter a valid project name, minimum 5 characters');
                        }
                    }

                    res.render('project-form', {
                        title: 'Edit project',
                        userid: req.session.user._id,
                        userName: req.session.user.name,
                        projectID: req.params.id,
                        projectName: project.projectName,
                        tasks: project.tasks,
                        buttonText: 'Make the change!'
                    });
                }
            });
        } else {
            res.redirect('/user');
        }
    }
});

/**
 * POST project edit form
 */
router.post( '/edit/:id', function(req, res) {
    "use strict";

    if ( req.session.loggedIn !== true ) {
        res.redirect( '/login' );
    } else {
        if ( req.body.projectID ) {
            Project.findById( req.body.projectID, function(err, project) {
                if ( !err ) {
                    project.projectName = req.body.projectName;
                    project.tasks = req.body.tasks;
                    project.modifiedOn = Date.now();
                    project.save(function(err, project) {
                        var qstring = '?';
                        if ( err ) {
                            console.log( err );
                            if ( err.name === "ValidationError" ) {
                                for ( var input in err.errors ) {
                                    qstring += input + '=inalid&';
                                    console.log(err.errors[input].message);
                                }
                            } else {
                                res.redirect('/?error=true');
                            }
                            req.session.tmpProject = {
                                "projectName": req.body.projectName,
                                "tasks": req.body.tasks
                            };
                        res.redirect('/project/edit/' + req.body.projectID + qstring);
                        } else {
                            console.log('Project updated: ' + req.body.projectName);
                            res.redirect('/project/' + req.body.projectID );
                        }
                    });
                }
            });
        }
    }
});

/**
 * GET project delete confirmation form.
 */
router.get( '/delete/:id', function(req, res) {
    "use strict";

    if ( req.session.loggedIn !== true ) {
        res.redirect('/login');
    } else {
        if( req.params.id ) {
            Project.findById( req.params.id, function( err, project) {
                if ( err ) {
                    console.log( err );
                    res.redirect('/project/' + req.params.id);
                } else {
                    res.render('project-delete-form', {
                        title: "Delete " + project.projectName + "?",
                        projectName: project.projectName,
                        projectID: req.params.id,
                        userID: req.session.user._id
                    });
                }
            });
        } else {
            res.redirect('/user');
        }
    }
});

/**
 * POST project delete form.
 */
router.post( '/delete/:id', function(req, res) {
    "use strict";

    if ( req.body.projectID ) {
        Project.findByIdAndRemove( req.body.projectID, function( err, project ) {
            if ( err ) {
                console.log( err );
                return res.redirect('/project/' + req.body.projectID + '?error=deletion');
            }
            console.log("project id " + project._id + " deleted");
            res.redirect('/user?confirm=project-deleted');
        });
    }
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