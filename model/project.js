/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var mongoose = require('mongoose');

/*****************************
 * PROJECT SCHEMA
 * **************************/
var Schema = mongoose.Schema;

var isNotTooShort = function (string) {
    return string && string.length >= 5;
};
// The following two lines will do the same thing
// var validateLength = [isNotTooShort, 'Too short'];
var validateLength = [{validator: isNotTooShort, msg: "Too short"}];

var projectSchema = new Schema( {
    projectName: String,
    /* Validate projectName inline calling the function directly */
    // projectName: {type: String, required: true; validate: {validator: isNotTooShort, msg: 'Much too short'}},
    /* Validate projectName by referencing a validator object */
    // projectName: {type: String, required: true; validate: validateLength },

    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: { type: String, require: true },
    contributors: String,
    tasks: String
});

projectSchema.statics.findByUserID = function(userid, callback) {
    this.find(
        { createdBy: userid },
        '_id projectName',
        { sort : 'modifiedOn' },
        callback
    );
};

/* Add all projectName validation using schemaType methods, outside of the schema declaration */
projectSchema.path('projectName').required(true);
projectSchema.path('projectName').validate(isNotTooShort, 'Is too short');
/* Asynchronous validator checking agains the database */
projectSchema.path('projectName').validate(function(value, respond) {
    // if the project has a modifiedOn value pass validation as project already exists
    if (this.modifiedOn) {
        console.log('Validation passed: ', this);
        respond(true);
    } else {
        // Otherwise check to see if this user already has a project with the same name.
        console.log('Looking for projects called ' + value);
        Project.find({projectNme: value, createdBy: this.createdBy}, function(err, projects){
            console.log('Number found: ' + projects.length);
            respond(projects.length ? false : true);
        });
    }
}, 'Duplicate projectName');

// Build the Project model
module.exports = mongoose.model( 'Project', projectSchema );

