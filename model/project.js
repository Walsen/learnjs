/**
 * Created by sergio.rodriguez on 9/30/14.
 */
var mongoose = require('mongoose');

/*****************************
 * PROJECT SCHEMA
 * **************************/
var Schema = mongoose.Schema;

var projectSchema = new Schema( {
    projectName: String,
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    createdBy: String,
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

// Build the Project model
module.exports = mongoose.model( 'Project', projectSchema );

