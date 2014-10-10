/**
 * Created by sergio.rodriguez on 10/9/14.
 */

var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var Project = mongoose.model( 'Project' );

/**
 * GET task creation form
 */
router.get( '/new', function(req, res) {
    "use strict";

    var strTaskName = '',
        strTaskDesc = '',
        arrErrors = [];

    if ( req.session.loggedIn === true ) {
        Project.findById( req.params.id, 'projectName', function(err, project) {
            if ( err ) {
                console.log( err );
                res.redirect('/user');
            } else {
                if ( req.session.tmpTask ) {
                    strTaskName = req.session.tmpTask.taskName;
                    strTaskDesc = req.session.tmpTask.taskDesc;
                    req.session.tmpTask = '';
                }

                if ( req.query ) {
                    if ( req.query.taskName === 'invalid' ) {
                        arrErrors.push('Please enter a valid task name, minimum 5 characters');
                    }
                }

                res.render('task-form', {
                    title: 'Add task to project',
                    userid: req.session.user._id,
                    projectID: req.params.id,
                    projectName: project.projectName,
                    taskID: '',
                    taskName: strTaskName,
                    taskDesc: strTaskDesc,
                    buttonText: 'Add it!',
                    errors: arrErrors
                });
            }
        });
    } else {
        res.redirect('/login');
    }
});

/**
 * POST task creation form
 */
router.post( '/new', function(req, res) {
    "use strict";

    if ( req.session.loggedIn !== true ) {
        res.redirect('/login');
    } else {
        if ( req.body.projectID ) {
            Project.findById( req.body.projectID, 'tasks modifiedOn', function(err, project) {
                if ( !err ) {
                    project.tasks.push({
                        taskName: req.body.taskName,
                        taskDesc: req.body.taskDesc,
                        createdBy: req.session.user._id
                    });
                    project.modifiedOn = Date.now();
                    project.save( function( err, project ) {
                        var qstring = '?';
                        if ( err ) {
                            console.log( 'Oh dear', err );
                            if ( err.name === "ValidationError" ) {
                                for ( var input in err.errors ) {
                                    qstring += err.errors[input].path + '=invalid&';
                                    console.log(err.errors[input].message);
                                }
                            } else {
                                res.redirect('/?error=true');
                            }
                            req.session.tmpTask = {
                                "taskName": req.body.taskName,
                                "taskDesc": req.body.taskDesc
                            };
                            res.redirect('/project/' + req.body.projectID + '/task/new' + qstring );
                        } else {
                            console.log('Task saved:' + req.body.taskName);
                            res.redirect('/project/' + req.body.projectID);
                        }
                    });
                }
            });
        }
    }
});

